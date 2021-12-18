import { User } from '../models'
import jwt from 'jsonwebtoken'
import { Requester } from 'cote'
import '../lib/ThumbnailService'

const requester = new Requester({ name: 'thumbnailRequester' })
class APIController {
  // POST /api/register
  async loginAPI(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user || !(await user.checkPwd(password))) {
        res.json({ error: 'Invalid credentials' })
        return
      }
      jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '2h' },
        (error, jwtToken) => {
          if (error) {
            next(error)
            return
          }

          res.json({ token: jwtToken })
        }
      )
    } catch (error) {
      next(error)
    }
  }

  // POST /api/thumbnail
  makeThumbnail(req, res, next) {
    const { path: image, originalname: name } = req.file

    requester.send({ type: 'makeThumbnail', image, name }, (result) => {
      console.log('Requester recibe:', result)

      res.status(201).json({
        result: {
          url: `http://localhost:${process.env.PORT}/thumbnails/${name}`,
        },
      })
      return
    })
  }
}

export default APIController
