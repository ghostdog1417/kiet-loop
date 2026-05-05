const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  title: { type: String, required: true },
  content: { type: String },
  images: { type: [String], default: [] },
  postType: { type: String, enum: ['announcement', 'update', 'event', 'lostfound'] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ author: mongoose.Schema.Types.ObjectId, text: String, date: Date }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Post', PostSchema)
