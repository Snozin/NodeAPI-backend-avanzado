import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connection.on('error', (error) => {
  console.log('Error durante el proceso de conexión:', error)
  process.exit(1)
})

mongoose.connection.once('open', () => {
  console.log('MongoDB conected to:', mongoose.connection.name)
})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export default mongoose.connection
