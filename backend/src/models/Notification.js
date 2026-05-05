const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String }, // message, listing_sold, service_booked, price_offer, event_reminder
  title: { type: String },
  body: { type: String },
  link: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Notification', NotificationSchema)
