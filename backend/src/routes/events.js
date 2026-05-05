const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const Club = require('../models/Club')

// ===== Events =====
router.post('/', async (req, res) => {
  try {
    const { title, description, organizer, club, date, location, image, category, capacity } = req.body
    const event = new Event({ title, description, organizer, club, date, location, image, category, capacity })
    await event.save()
    return res.status(201).json(event)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const { category, club, page = 1 } = req.query
    const filter = {}
    if (category) filter.category = category
    if (club) filter.club = club
    const events = await Event.find(filter).populate('organizer club', 'name fullName').skip((page - 1) * 20).limit(20)
    return res.json(events)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer club registrations', 'fullName name')
    if (!event) return res.status(404).json({ error: 'not found' })
    return res.json(event)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Register for event
router.post('/:id/register', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ error: 'missing userId' })
    const event = await Event.findByIdAndUpdate(req.params.id, { $push: { registrations: userId } }, { new: true })
    return res.json(event)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// ===== Clubs =====
router.post('/clubs', async (req, res) => {
  try {
    const { name, description, logo, admin, category } = req.body
    const club = new Club({ name, description, logo, admin, category })
    await club.save()
    return res.status(201).json(club)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.get('/clubs', async (req, res) => {
  try {
    const { category, page = 1 } = req.query
    const filter = {}
    if (category) filter.category = category
    const clubs = await Club.find(filter).populate('admin members', 'fullName').skip((page - 1) * 20).limit(20)
    return res.json(clubs)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

router.post('/clubs/:id/join', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ error: 'missing userId' })
    const club = await Club.findByIdAndUpdate(req.params.id, { $push: { members: userId } }, { new: true })
    return res.json(club)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
