const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  department: { type: String },
  year: { type: Number },
  hostelType: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['student'] },
  verified: { type: Boolean, default: false },
  photo: { type: String },
  bio: { type: String },
  skills: { type: [String], default: [] },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  badges: { type: [String], default: [] },
  totalTransactions: { type: Number, default: 0 },
  availability: { type: String },
  portfolio: { type: [String], default: [] },
  socials: { type: Object, default: {} },
  listingsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)

