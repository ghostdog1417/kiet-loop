const mongoose = require('mongoose')

const OTPSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 }
})

module.exports = mongoose.model('OTPVerification', OTPSchema)
