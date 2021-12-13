import 'regenerator-runtime/runtime'
import dotenv from 'dotenv'
dotenv.config()

import readline from 'readline'
import connection from '../lib/MongooseConnection'

import { User, Advert } from '../models'

const main = async () => {
  await new Promise((resolve, reject) => {
    connection.once('open', resolve)
    connection.once('error', reject)
  })

  if (!(await confirm('¿Quires inicializar la BD? (yes/no)'))) {
    console.log('Proceso abortado. No se ha borrado nada')
    return process.exit(0)
  }

  await initAdverts()
  // await initUsers()

  connection.close()
}

const initAdverts = async () => {
  try {
    const { deletedCount } = await Advert.deleteMany()
    console.log(`Eliminados ${deletedCount} anuncios`)

    const inserted = await Advert.loadJSON()
    console.log(`Insertados ${inserted.length} anuncios`)
  } catch (error) {
    console.log(error)
  }
}

// const initUsers = async () => {
//   const { deletedCount } = await User.deleteMany()
//   console.log(`Eliminados ${deletedCount} usuarios`)

//   const result = await User.insertMany([
//     {
//       email: 'admin@example.com',
//       password: 1234,
//     },
//     {
//       email: 'user@example.com',
//       password: 1234,
//     },
//   ])
//   console.log(`Insertados ${result.length} usuarios.`)
// }

const confirm = (questionText) =>
  new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question(questionText, (answer) => {
      rl.close()
      if (answer.toLowerCase() === 'yes') {
        resolve(true)
        return
      }
      resolve(false)
    })
  })

main().catch((err) => console.log(err))
