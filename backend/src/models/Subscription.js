const mongoose = require('mongoose')

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['pro_seller', 'premium'], required: true },
  tier: { type: String }, // basic, pro, premium
  price: { type: Number },
  billingCycle: { type: String, default: 'monthly' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  active: { type: Boolean, default: true },
  autoRenew: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Subscription', SubscriptionSchema)
