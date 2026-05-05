const mongoose = require('mongoose')

const RoommateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Number },
  location: { type: String },
  hostel: { type: String },
  preferredGender: { type: String },
  moveInDate: { type: Date },
  preferences: { type: String },
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Roommate', RoommateSchema)
