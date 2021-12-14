import dotenv from 'dotenv'
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import ejs from 'ejs'

import { indexRouter, privateRouter, changeLocale, APIRouter } from './routes'
import LoginController from './controllers/loginController'

import './lib/MongooseConnection'
import { isAPIRequest, authRequired } from './lib/utils'
import i18n from './lib/i18nConfig'

import session from 'express-session'
import MongoStore from 'connect-mongo'

dotenv.config()

const app = express()

// view engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'html')
app.engine('html', ejs.__express)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

// Rutas del API
app.use('/api/adverts', APIRouter)

// Inicio de i18n
app.use(i18n.init)

// Titlo de la cabecera de las vistass
app.locals.title = 'NodeShop'

// Creación de la sesion
app.use(
  session({
    name: 'nodeshop-session',
    secret: 'askjhdapsifuhasç!',
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2, //La cookie caduca tras 2 días inactivo
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_STRING
    })
  })
)

// Insertar sesion en las vistas
app.use((req, res, next) =>{
  app.locals.session = req.session
  next()
})

// Rutas de las vistass
app.use('/', indexRouter)
app.use('/private', authRequired, privateRouter)
app.use('/change-locale', changeLocale)

// Usando controladores
const loginController = new LoginController()
app.get('/login', loginController.index)
app.get('/logout', loginController.logout)
app.post('/login', loginController.post)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set response status headers
  res.status(err.status || 500)

  if (isAPIRequest(req)) {
    res.json({ error: err.message })
    return
  }

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.render('error')
})

export default app

//TODO Probar ngrok.com si sobra tiempo (Video 1 Avanzado. Min 32:33)
