const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'pending' }, // pending, success, failed
  type: { type: String }, // listing_boost, pro_seller, service_booking
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Payment', PaymentSchema)
