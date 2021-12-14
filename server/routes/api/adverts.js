import express from 'express'
import createError from 'http-errors'
import { Advert } from '../../models'
import { getPriceValues } from '../../lib/utils'

const router = express.Router()
const msg404 = 'No se encontró el elemento:'

router.get('/tags', (req, res, next) => {
  try {
    res.json({ results: ['Lifestyle', 'mobile', 'work', 'motor'] })
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const { name, tags, sale, price, skip, limit, select, sort } = req.query
    const filter = {
      // Crear el filtro condicionalmente
      ...(name ? { name: new RegExp(name, 'i') } : {}),
      ...(price ? { price: getPriceValues(price) } : {}),
      ...(tags ? { tags: tags.split(' ') } : {}),
      ...(sale !== undefined ? { sale: sale } : {}),
    }

    const adverts = await Advert.filterList(filter, skip, limit, select, sort)

    res.json({ results: adverts })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    const advert = await Advert.find({ _id })

    if (advert.length === 0) {
      next(createError(404, `${msg404} ${_id}`))
      return
    }

    res.json({ results: advert })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const advertData = req.body
    const advert = new Advert(advertData)
    const createdAdvert = await advert.save()

    res.status(201).json({ results: createdAdvert })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    const advertData = req.body
    const advert = await Advert.findOneAndUpdate({ _id }, advertData, {
      new: true, //Devuelve el estado después de la actualización
    })

    if (!advert) {
      next(createError(404, `${msg404} ${_id}`))
      return
    }

    res.json({ results: advert })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    const { deletedCount } = await Advert.deleteOne({ _id })

    if (deletedCount === 0) {
      next(createError(404, `${msg404} ${_id}`))
      return
    }

    res.json({ results: 'deleted.' })
  } catch (error) {
    next(error)
  }
})

export default router
