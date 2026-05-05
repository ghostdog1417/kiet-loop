require('dotenv').config()
const connectDB = require('../src/db')
const User = require('../src/models/User')
const bcrypt = require('bcrypt')

async function seed() {
  await connectDB()
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@kiet.edu'
  const existing = await User.findOne({ email: adminEmail })
  if (existing) {
    console.log('Admin already exists')
    process.exit(0)
  }
  const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASS || 'adminpass', 10)
  const admin = new User({ fullName: 'KIET Admin', rollNumber: 'ADMIN001', email: adminEmail, passwordHash: hash, roles: ['super_admin'], verified: true })
  await admin.save()
  console.log('Admin user created:', adminEmail)
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
