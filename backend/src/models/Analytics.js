const mongoose = require('mongoose')

const AnalyticsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  dau: { type: Number, default: 0 }, // daily active users
  mau: { type: Number, default: 0 }, // monthly
  listingsCreated: { type: Number, default: 0 },
  listingsSold: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  topCategories: { type: [String], default: [] },
  topSellers: { type: [Object], default: [] }
})

module.exports = mongoose.model('Analytics', AnalyticsSchema)
