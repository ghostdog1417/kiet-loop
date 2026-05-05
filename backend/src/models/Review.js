const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  categories: { honesty: Number, quality: Number, communication: Number },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Review', ReviewSchema)
