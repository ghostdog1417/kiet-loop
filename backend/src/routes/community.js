const express = require('express')
const router = express.Router()
const LostAndFound = require('../models/LostAndFound')
const Roommate = require('../models/Roommate')
const Internship = require('../models/Internship')

// ===== Lost & Found =====
router.post('/lostfound', async (req, res) => {
  try {
    const { title, description, type, category, images, location, date, postedBy, contact } = req.body
    const post = new LostAndFound({ title, description, type, category, images, location, date, postedBy, contact })
    await post.save()
    return res.status(201).json(post)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.get('/lostfound', async (req, res) => {
  try {
    const { type, q, page = 1 } = req.query
    const filter = {}
    if (type) filter.type = type
    if (q) filter.$text = { $search: q }
    const posts = await LostAndFound.find(filter).populate('postedBy', 'fullName phone').skip((page - 1) * 20).limit(20)
    return res.json(posts)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// ===== Roommate Finder =====
router.post('/roommate', async (req, res) => {
  try {
    const { user, budget, location, hostel, preferredGender, moveInDate, preferences } = req.body
    const post = new Roommate({ user, budget, location, hostel, preferredGender, moveInDate, preferences })
    await post.save()
    return res.status(201).json(post)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.get('/roommate', async (req, res) => {
  try {
    const { budget, location, gender, page = 1 } = req.query
    const filter = { active: true }
    if (budget) filter.budget = { $lte: parseInt(budget) }
    if (location) filter.location = location
    if (gender) filter.preferredGender = gender
    const posts = await Roommate.find(filter).populate('user', 'fullName phone photo').skip((page - 1) * 20).limit(20)
    return res.json(posts)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// ===== Internship Board =====
router.post('/internship', async (req, res) => {
  try {
    const { title, company, postedBy, description, duration, stipend, type, location, applyLink, deadline } = req.body
    const post = new Internship({ title, company, postedBy, description, duration, stipend, type, location, applyLink, deadline })
    await post.save()
    return res.status(201).json(post)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.get('/internship', async (req, res) => {
  try {
    const { type, q, page = 1 } = req.query
    const filter = {}
    if (type) filter.type = type
    if (q) filter.$text = { $search: q }
    const posts = await Internship.find(filter).populate('postedBy', 'fullName company').skip((page - 1) * 20).limit(20)
    return res.json(posts)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Apply for internship
router.post('/internship/:id/apply', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ error: 'missing userId' })
    const internship = await Internship.findByIdAndUpdate(req.params.id, { $push: { applicants: userId } }, { new: true })
    return res.json(internship)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
