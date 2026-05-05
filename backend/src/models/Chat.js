const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: String },
  unreadCounts: { type: Map, of: Number },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Chat', ChatSchema)
