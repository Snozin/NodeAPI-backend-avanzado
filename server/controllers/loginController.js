import { User } from '../models'

class loginController {
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
      if (!user || user.password !== password) {
        res.locals.error = res.__('Invalid credentials')
        res.render('login')
      }


      // Si encuentro usuario redirijo a /private
      res.redirect('/private')
    } catch (error) {
      next(error)
    }
  }
}

export default loginController
