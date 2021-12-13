import express from 'express'
import { Advert } from '../models'
const router = express.Router()

router.get('/', async (req, res, next) => {
  res.locals.title = 'NodeAPI'

// Ejemplo i18n 
  res.locals.prueba = res.__('thats an example')

  try {
    const { name, tags, sale, price, skip, limit, select, sort } = req.query
    const filter = {
      ...(name ? { name: new RegExp(name, 'i') } : {}),
      ...(price ? { price: getPriceValues(price) } : {}),
      ...(tags ? { tags: tags.split(' ') } : {}),
      ...(sale !== undefined ? { sale: sale } : {}),
    }

    const adverts = await Advert.filterList(filter, skip, limit, select, sort)

    console.log(adverts)
    res.render('index', { results: adverts })
  } catch (error) {
    next(error)
  }
})

export default router
