const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const Referral = require('../models/Referral')
const User = require('../models/User')
const crypto = require('crypto')

// ===== Notifications =====
router.get('/', async (req, res) => {
  try {
    const { userId, unread } = req.query
    if (!userId) return res.status(400).json({ error: 'missing userId' })
    const filter = { user: userId }
    if (unread === 'true') filter.read = false
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50)
    return res.json(notifications)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { user, type, title, body, link } = req.body
    const notification = new Notification({ user, type, title, body, link })
    await notification.save()
    return res.status(201).json(notification)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    return res.json(notification)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// ===== Referral System =====
router.post('/referral/generate', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ error: 'missing userId' })
    
    const code = crypto.randomBytes(6).toString('hex').toUpperCase()
    let referral = await Referral.findOne({ referrer: userId })
    if (!referral) {
      referral = new Referral({ referrer: userId, referrerCode: code })
    } else {
      referral.referrerCode = code
    }
    await referral.save()
    return res.json({ code })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.post('/referral/apply', async (req, res) => {
  try {
    const { userId, referralCode } = req.body
    if (!userId || !referralCode) return res.status(400).json({ error: 'missing fields' })
    
    const referral = await Referral.findOne({ referrerCode: referralCode })
    if (!referral) return res.status(404).json({ error: 'invalid code' })
    
    // Add referred user
    referral.referred.push(userId)
    referral.loopCoins += 10 // reward coins
    await referral.save()
    
    return res.json({ ok: true, loopCoins: referral.loopCoins })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.get('/referral/:userId', async (req, res) => {
  try {
    const referral = await Referral.findOne({ referrer: req.params.userId }).populate('referred', 'fullName email')
    if (!referral) return res.status(404).json({ error: 'not found' })
    return res.json(referral)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
