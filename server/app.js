import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import ejs from 'ejs'
import multer from 'multer'
import { indexRouter, privateRouter, changeLocale, APIRouter } from './routes'
import LoginController from './controllers/loginController'
import APIController from './controllers/APIController'
import { isAPIRequest, authRequired, jwtAuth } from './lib/utils'
import i18n from './lib/i18nConfig'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import './lib/MongooseConnection'

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

// Creación de la carpeta de subidas
const uploads = multer({ dest: './rawImgData' })

// Rutas del API
const apiController = new APIController()
app.use('/api/adverts', jwtAuth, APIRouter)
app.post('/api/register', apiController.loginAPI)
app.post(
  '/api/thumbnail',
  jwtAuth,
  uploads.single('image'),
  apiController.makeThumbnail
)

// Inicio de i18n
app.use(i18n.init)

// Titlo de la cabecera de las vistass
app.locals.title = 'NodeShop'

// Creación de sesion para website
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
      mongoUrl: process.env.MONGODB_CONNECTION_STRING,
    }),
  })
)

// Insertar sesion en las vistas
app.use((req, res, next) => {
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
