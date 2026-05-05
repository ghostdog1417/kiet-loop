const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const OTP = require('../models/OTPVerification')

const KIET_EMAIL_REGEX = /@.*kiet.*\.(edu|ac)(\.in)?$/i

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

router.post('/signup', async (req, res) => {
  try {
    const { fullName, rollNumber, department, year, hostelType, email, phone, password } = req.body
    if (!fullName || !rollNumber || !email || !password) return res.status(400).json({ error: 'missing fields' })
    if (!KIET_EMAIL_REGEX.test(email)) return res.status(400).json({ error: 'email must be a KIET college email' })

    const existing = await User.findOne({ $or: [{ email }, { rollNumber }] })
    if (existing) return res.status(409).json({ error: 'user already exists' })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User({ fullName, rollNumber, department, year, hostelType, email, phone, passwordHash: hash })
    await user.save()

    // create OTP
    const otpCode = generateOTP()
    const expires = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes
    await OTP.create({ userEmail: email, otp: otpCode, expiresAt: expires })

    // send OTP via email helper (if configured), otherwise console
    try {
      const mailer = require('../utils/email')
      if (process.env.SMTP_HOST) {
        await mailer.sendMail({ to: email, subject: 'KIET Loop OTP', text: `Your OTP is ${otpCode}` })
      } else {
        console.log(`Send OTP ${otpCode} to ${email} (SMTP not configured)`)
      }
    } catch (e) {
      console.warn('email helper failed', e.message || e)
    }

    return res.status(201).json({ ok: true, message: 'user created, verify email with OTP' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ error: 'missing' })
    const record = await OTP.findOne({ userEmail: email }).sort({ _id: -1 })
    if (!record) return res.status(404).json({ error: 'no otp found' })
    if (record.expiresAt < new Date()) return res.status(400).json({ error: 'otp expired' })
    if (record.otp !== otp) {
      record.attempts += 1
      await record.save()
      return res.status(400).json({ error: 'invalid otp' })
    }

    // mark user verified
    await User.updateOne({ email }, { verified: true })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'missing' })
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: 'user not found' })
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ error: 'invalid credentials' })
    if (!user.verified) return res.status(403).json({ error: 'account not verified' })

    const payload = { id: user._id, roles: user.roles }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        verified: user.verified,
        photo: user.photo
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
