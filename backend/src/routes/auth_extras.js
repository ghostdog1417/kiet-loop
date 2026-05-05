const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const RefreshToken = require('../models/RefreshToken')
const User = require('../models/User')

// issue refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'missing' })
    const stored = await RefreshToken.findOne({ token })
    if (!stored) return res.status(401).json({ error: 'invalid' })
    if (stored.expiresAt < new Date()) {
      await stored.deleteOne()
      return res.status(401).json({ error: 'expired' })
    }
    const user = await User.findById(stored.user)
    const payload = { id: user._id, roles: user.roles }
    const access = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
    return res.json({ token: access })
  } catch (err) { console.error(err); return res.status(500).json({ error: 'server error' }) }
})

// forgot password -> generate reset token (console send)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'missing' })
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: 'no user' })
    const token = crypto.randomBytes(20).toString('hex')
    // in production, store token hashed with expiry and send email
    console.log(`Password reset token for ${email}: ${token}`)
    return res.json({ ok: true })
  } catch (err) { console.error(err); return res.status(500).json({ error: 'server error' }) }
})

module.exports = router
