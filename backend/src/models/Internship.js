const mongoose = require('mongoose')

const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String },
  duration: { type: String },
  stipend: { type: Number },
  type: { type: String, enum: ['internship', 'campus_ambassador', 'freelance', 'startup'] },
  location: { type: String },
  applyLink: { type: String },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Internship', InternshipSchema)
