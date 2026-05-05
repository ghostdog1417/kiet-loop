const mongoose = require('mongoose')

const LostAndFoundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['lost', 'found'] },
  category: { type: String },
  images: { type: [String], default: [] },
  location: { type: String },
  date: { type: Date },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact: { type: String },
  resolved: { type: Boolean, default: false },
  resolvedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('LostAndFound', LostAndFoundSchema)
