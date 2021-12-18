import { Requester } from 'cote'
import '../lib/ThumbnailService'
// import path from 'path'

class APIController {
  // POST /api/thumbnail
  makeThumbnail(req, res, next) {
    const requester = new Requester({ name: 'thumbnailRequester' })

    const { path: image, originalname: name } = req.file

    // console.log(path.join(__dirname, `./public/thumbnails/${name}`))

    requester.send({ type: 'makeThumbnail', image, name }, (result) => {
      console.log('Requester recibe:', result)
    })

    res.json({ result: 'pruebando' })
    return
  }
}

export default APIController
