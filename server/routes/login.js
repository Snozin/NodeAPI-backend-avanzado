import express from 'express'

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.locals.home = ''
  res.locals.login = 'active'

  res.render('login')
})

export default router
