import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
  },
  {
    collection: 'Users',
  }
)

const User = mongoose.model('User', userSchema)

export default User
