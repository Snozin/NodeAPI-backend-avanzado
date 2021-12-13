import express from 'express'

const router = express.Router()

// GET /change-locale/
router.get('/:locale', async (req, res, next) => {
  // Recoger parametro de la url
  const language = req.params.locale

  // Setear cookie
  res.cookie('locale-lang', language, {
    maxAge: 1000 * 60 * 60 * 24 * 30, //30 días duración de la cookie
  })

  console.log(language)

  // Redireccionar al origen del usuario
  res.redirect(req.get('referer'))
})

export default router
