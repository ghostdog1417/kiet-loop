const mongoose = require('mongoose')

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  subcategory: { type: String },
  price: { type: Number, required: true },
  negotiable: { type: Boolean, default: false },
  condition: { type: String },
  images: { type: [String], default: [] },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: { type: [String], default: [] },
  location: { type: String },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Listing', ListingSchema)
