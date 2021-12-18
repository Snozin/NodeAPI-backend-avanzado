import jwt from 'jsonwebtoken'
import Multer from 'multer'

export const isAPIRequest = (req) => {
  return req.url.startsWith('/api/')
}

// Función de comprobación de precios para /home y /api/adverts
export const getPriceValues = (price) => {
  const prices = price.split('-')
  const [min, max] = prices

  if (prices.length === 1) return min

  const result = {
    ...(min === '' ? { $lte: max } : {}),
    ...(max === '' ? { $gte: min } : {}),
    ...(min ? { $gte: min } : {}),
    ...(max ? { $lte: max } : {}),
  }

  return result
}

// Middleware para comprobar que un usuario está logueado
export const authRequired = (req, res, next) => {
  if (!req.session.isLogged) {
    res.redirect('/login')
    return
  }

  next()
}

// Middleware para autenticación con JWT
export const jwtAuth = (req, res, next) => {
  // Recoger el token de la cabecera o por query string
  const token = req.get('Authorization') || req.query.token

  // Comprobar que el token existe
  if (!token) {
    const error = new Error('No token provided')
    error.status = 401
    next(error)
    return
  }

  // Comprobar que el token es válido
  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      error.status = 401
      next(error)
      return
    }
    next()
  })
}
