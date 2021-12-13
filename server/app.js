import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import ejs from 'ejs'

import APIadverts from './routes/api/adverts'
import indexRouter from './routes/index'
import advertsRouter from './routes/adverts'

import './lib/MongooseConnection'
import { isAPIRequest } from './lib/utils'

const app = express()

// Cosass locas del i18n
import i18n from './lib/i18nConfig'
app.use(i18n.init)

// Pruebechita i18n no más
i18n.setLocale('es')
console.log(i18n.__('Welcome to NodeAPI'))

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
app.use('/api/adverts', APIadverts)

// Rutas de las vistass
app.use('/', indexRouter)
app.use('/adverts', advertsRouter)

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
