import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
  },
  {
    collection: 'Users',
  }
)

userSchema.statics.hashPwd = function (plainTextPwd) {
  return bcrypt.hash(plainTextPwd, 9)
}

userSchema.methods.checkPwd = function (plainTextPwd) {
  return bcrypt.compare(plainTextPwd, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
