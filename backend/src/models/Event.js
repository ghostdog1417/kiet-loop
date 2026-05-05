const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  date: { type: Date, required: true },
  location: { type: String },
  image: { type: String },
  category: { type: String }, // hackathon, cultural, sports, etc.
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  capacity: { type: Number },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Event', EventSchema)
