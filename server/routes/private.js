import express from 'express'

const router = express.Router()

router.get('/', async (req, res, next) => {
  if (!req.session.isLogged) {
    res.redirect('/login')
    return
  }

  res.render('private')
})

export default router
