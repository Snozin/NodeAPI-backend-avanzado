import { Responder } from 'cote'
import Jimp from 'jimp'
import fs from 'fs'
import path from 'path'

const responder = new Responder({ name: 'ThumbnailService' })
const dir = path.join(__dirname, '../../rawImgData/')

responder.on('makeThumbnail', async (req, done) => {
  const { image, name } = req
  const result = await resize(image, name)

  result ? done('Thumbnail Creado') : done('Error al crear thumbnail')
  cleanUp(dir)
})

// Redimensionar la imagen con jimp
const resize = async (imagePath, imageName) => {
  await Jimp.read(imagePath)
    .then((result) => {
      return result
        .resize(100, 100)
        .writeAsync(`./public/thumbnails/${imageName}`)
    })
    .catch((error) => {
      console.log('Error al procesar la imagen:', error)
      return false
    })

  return true
}

// Eliminar los ficheros de la imagen en crudo
const cleanUp = (dir) => {
  fs.readdir(dir, (error, files) => {
    if (error) {
      console.log(`Error leyendo: ${dir} \n ${error}`)
    } else {
      files.forEach((file) => {
        fs.rm(`${dir}${file}`, (error) => {
          if (error) {
            console.log(`Error al borrar : ${file} \n ${error}`)
          }
        })
      })
    }
  })
}
