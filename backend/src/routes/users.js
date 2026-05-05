const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Review = require('../models/Review')

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if (!user) return res.status(404).json({ error: 'not found' })
    const reviews = await Review.find({ reviewee: req.params.id }).populate('reviewer', 'fullName photo')
    return res.json({ user, reviews })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Update profile
router.put('/:id', async (req, res) => {
  try {
    const allowed = ['bio', 'skills', 'availability', 'photo', 'portfolio', 'socials']
    const updates = {}
    allowed.forEach(field => {
      if (req.body[field]) updates[field] = req.body[field]
    })
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-passwordHash')
    return res.json(user)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get user badges and stats
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'not found' })
    return res.json({
      rating: user.rating,
      badges: user.badges,
      totalTransactions: user.totalTransactions,
      listingsCount: user.listingsCount
    })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
