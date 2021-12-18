import 'regenerator-runtime/runtime'
import connection from '../lib/MongooseConnection'
import { User, Advert } from '../models'

const main = async () => {
  await new Promise((resolve, reject) => {
    connection.once('open', resolve)
    connection.once('error', reject)
  })

  await initAdverts()
  await initUsers()

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

const initUsers = async () => {
  const { deletedCount } = await User.deleteMany()
  console.log(`Eliminados ${deletedCount} usuarios`)

  const result = await User.insertMany([
    {
      email: 'admin@example.com',
      password: await User.hashPwd('1234'),
    },
    {
      email: 'user@example.com',
      password: await User.hashPwd('1234'),
    },
  ])
  console.log(`Insertados ${result.length} usuarios.`)
}

main().catch((err) => console.log(err))
