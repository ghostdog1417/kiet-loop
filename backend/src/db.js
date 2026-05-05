const mongoose = require('mongoose')
const dns = require('dns')

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/kietloop'
  try {
    console.log('Attempting MongoDB connection...')
    if (uri.startsWith('mongodb+srv://')) {
      console.log('Setting DNS servers for SRV resolution...')
      dns.setServers(['1.1.1.1', '8.8.8.8'])
    }
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    })
    console.log('MongoDB connected successfully')
    return true
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err)
    // don't exit; return false so caller can decide
    return false
  }
}

module.exports = connectDB
