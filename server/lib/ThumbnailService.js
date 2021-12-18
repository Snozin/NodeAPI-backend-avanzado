import { Responder } from 'cote'
import Jimp from 'jimp'
import fs from 'fs'

const responder = new Responder({ name: 'ThumbnailService' })

responder.on('makeThumbnail', async (req, done) => {
  const { image, name } = req
  const result = await resize(image, name)

  result ? done('Thumbnail Creado') : done('Error al crear thumbnail')
})

// Redimensionar la imagen con jimp
const resize = async (imageFile, imageName) => {
  // const image = await Jimp.read('https://frontend-testing.org/img/coverx2.png')
  await Jimp.read(imageFile)
    .then((result) => {
      return result
        .resize(100, 100)
        .writeAsync(`./public/images/thumb-${imageName}`)
    })
    .catch((error) => {
      console.log('Error al procesar la imagen:', error)
      return false
    })

  return true
}

const cleanUp = ()=> {
  
}
