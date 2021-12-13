import express from 'express'
import path from 'path'
import { Advert } from '../models'

const router = express.Router()

router.get('/', async (req, res, next) => {
  // try {
  //   const file = path.join(__dirname, '../../anuncios.json')
  //   const numAdverts = await Advert.loadJSON(file)

  //   res.send(`Se han insertado: ${numAdverts} anuncios`)
  // } catch (error) {
  //   next(error)
  // }

  //// res.json(numAdverts)

  res.send('Aún en construcción')
})

export default router
