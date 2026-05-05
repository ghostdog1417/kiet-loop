const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  hourlyRate: { type: Number },
  packages: { type: [Object], default: [] },
  skills: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Service', ServiceSchema)
