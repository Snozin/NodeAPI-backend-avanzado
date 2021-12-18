import { User } from '../models'
import jwt from 'jsonwebtoken'

class loginController {
  // Métodos de las vistas
  index(req, res, next) {
    res.locals.error = ''

    res.render('login')
  }

  async post(req, res, next) {
    try {
      res.locals.error = ''
      const { email, password } = req.body

      // Buscar usuario por email
      const user = await User.findOne({ email })

      if (!user || !(await user.checkPwd(password))) {
        res.locals.error = res.__('Invalid credentials')
        res.render('login')
        return
      }

      // Añadir sesión al usuario
      req.session.isLogged = {
        _id: user._id,
      }

      res.redirect('/private')
    } catch (error) {
      next(error)
    }
  }

  logout(req, res, next) {
    const callback = (error) => {
      if (error) {
        next(error)
        return
      }
      res.redirect('/')
    }

    req.session.regenerate(callback)
  }

  // Métodos del API
  async loginAPI(req, res, next) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user || !(await user.checkPwd(password))) {
        res.json({ error: 'Invalid credentials' })
        return
      }
      jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '2h' },
        (error, jwtToken) => {
          if (error) {
            next(error)
            return
          }

          res.json({ token: jwtToken })
        }
      )
    } catch (error) {
      next(error)
    }
  }
}

export default loginController
