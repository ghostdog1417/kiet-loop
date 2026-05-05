const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedItem: { type: mongoose.Schema.Types.ObjectId }, // listing, user, comment, etc
  itemType: { type: String }, // 'listing', 'user', 'message'
  reason: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'open' }, // open, investigating, resolved, dismissed
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Report', ReportSchema)
