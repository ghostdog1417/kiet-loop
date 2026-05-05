const mongoose = require('mongoose')

const ServiceBookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  price: { type: Number, required: true },
  commission: { type: Number },
  deliveryDeadline: { type: Date },
  deliverables: { type: String },
  attachments: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('ServiceBooking', ServiceBookingSchema)
