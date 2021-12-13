class loginController {
  // constructor() {
  //   this.index()
  // }

  index(req, res, next) {
    res.locals.home = ''
    res.locals.login = 'active'
    
    res.render('login')
  }
}

export default loginController
