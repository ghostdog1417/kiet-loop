const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Listing = require('../models/Listing')
const Report = require('../models/Report')
const Analytics = require('../models/Analytics')

// Middleware: check admin role (placeholder)
function adminOnly(req, res, next) {
  const roles = req.user?.roles || []
  if (!roles.includes('super_admin')) {
    return res.status(403).json({ error: 'unauthorized' })
  }
  next()
}

// Get all users (with filters)
router.get('/users', adminOnly, async (req, res) => {
  try {
    const { role, verified, page = 1, limit = 20 } = req.query
    const filter = {}
    if (role) filter.roles = role
    if (verified) filter.verified = verified === 'true'
    const users = await User.find(filter).skip((page - 1) * limit).limit(parseInt(limit))
    const total = await User.countDocuments(filter)
    return res.json({ users, total })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Suspend/activate user
router.put('/users/:id', adminOnly, async (req, res) => {
  try {
    const { verified, roles } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { verified, roles } }, { new: true })
    return res.json(user)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get reports
router.get('/reports', adminOnly, async (req, res) => {
  try {
    const { status = 'open', page = 1 } = req.query
    const reports = await Report.find({ status }).skip((page - 1) * 20).limit(20).populate('reportedBy', 'fullName email')
    return res.json(reports)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Update report status
router.put('/reports/:id', adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body
    const report = await Report.findByIdAndUpdate(req.params.id, { status, adminNotes }, { new: true })
    return res.json(report)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get listings (moderate)
router.get('/listings', adminOnly, async (req, res) => {
  try {
    const listings = await Listing.find().skip(0).limit(50).populate('seller', 'fullName email')
    return res.json(listings)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Delete listing
router.delete('/listings/:id', adminOnly, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { available: false }, { new: true })
    return res.json(listing)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get analytics
router.get('/analytics', adminOnly, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const analytics = await Analytics.findOne({ date: { $gte: today } })
    if (!analytics) return res.json({ dau: 0, mau: 0, revenue: 0, listingsCreated: 0 })
    return res.json(analytics)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
