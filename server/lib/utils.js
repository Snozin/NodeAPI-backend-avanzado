export const isAPIRequest = (req) => {
  return req.url.startsWith('/api/')
}

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

export const authRequired = (req, res, next) => {
  if (!req.session.isLogged) {
    res.redirect('/login')
    return
  }

  next()
}
