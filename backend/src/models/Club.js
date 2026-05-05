const mongoose = require('mongoose')

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  logo: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: { type: String }, // coding, robotics, cultural, sports
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Club', ClubSchema)
