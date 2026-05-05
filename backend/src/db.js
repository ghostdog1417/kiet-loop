const mongoose = require('mongoose')
const dns = require('dns')

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/kietloop'
  try {
    if (uri.startsWith('mongodb+srv://')) {
      dns.setServers(['1.1.1.1', '8.8.8.8'])
    }
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('MongoDB connected')
    return true
  } catch (err) {
    console.warn('MongoDB connection error (continuing without DB):', err.message || err)
    // don't exit; return false so caller can decide
    return false
  }
}

module.exports = connectDB
