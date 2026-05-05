const express = require('express')
const router = express.Router()
const Service = require('../models/Service')
const ServiceBooking = require('../models/ServiceBooking')
const Review = require('../models/Review')

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Create service
router.post('/', async (req, res) => {
  try {
    const { provider, title, description, hourlyRate, packages, skills } = req.body
    if (!provider || !title) return res.status(400).json({ error: 'missing fields' })
    const service = new Service({ provider, title, description, hourlyRate, packages, skills })
    await service.save()
    return res.status(201).json(service)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// List services
router.get('/', async (req, res) => {
  try {
    const { q, skill, provider, sort = 'newest' } = req.query
    const page = parsePositiveInt(req.query.page, 1)
    const limit = parsePositiveInt(req.query.limit, 20)
    const filter = {}
    if (skill) filter.skills = { $in: [skill] }
    if (provider) filter.provider = provider
    if (q) {
      const safe = escapeRegex(String(q).trim())
      const regex = new RegExp(safe, 'i')
      filter.$or = [{ title: regex }, { description: regex }, { skills: regex }]
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { hourlyRate: 1 },
      price_high: { hourlyRate: -1 },
      rating: { rating: -1 }
    }
    const sortBy = sortMap[sort] || sortMap.newest

    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate('provider', 'fullName rating photo')
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
      Service.countDocuments(filter)
    ])

    return res.json({
      services,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get service detail
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'fullName rating photo bio')
    if (!service) return res.status(404).json({ error: 'not found' })
    const reviews = await Review.find({ service: req.params.id }).populate('reviewer', 'fullName photo')
    return res.json({ service, reviews })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Create booking
router.post('/:id/book', async (req, res) => {
  try {
    const { buyer, price, deliveryDeadline, deliverables } = req.body
    if (!buyer) return res.status(400).json({ error: 'missing buyer' })
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ error: 'service not found' })
    const finalPrice = typeof price === 'number' ? price : service.hourlyRate
    if (typeof finalPrice !== 'number') return res.status(400).json({ error: 'booking price is required' })

    const booking = new ServiceBooking({
      service: req.params.id,
      buyer,
      seller: service.provider,
      price: finalPrice,
      commission: Math.ceil(finalPrice * 0.1),
      deliveryDeadline,
      deliverables
    })
    await booking.save()
    return res.status(201).json(booking)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get bookings
router.get('/:id/bookings', async (req, res) => {
  try {
    const { userId } = req.query
    const filter = { service: req.params.id }
    if (userId) {
      filter.$or = [{ buyer: userId }, { seller: userId }]
    }
    const bookings = await ServiceBooking.find(filter)
      .sort({ createdAt: -1 })
      .populate('buyer seller', 'fullName photo')
    return res.json({ bookings })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    const { status, userId } = req.body
    if (!status) return res.status(400).json({ error: 'missing status' })

    const allowedStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled']
    if (!allowedStatuses.includes(status)) return res.status(400).json({ error: 'invalid status' })

    const booking = await ServiceBooking.findById(req.params.id)
    if (!booking) return res.status(404).json({ error: 'booking not found' })

    // Simple ownership control without full auth middleware.
    if (userId && String(booking.buyer) !== String(userId) && String(booking.seller) !== String(userId)) {
      return res.status(403).json({ error: 'not allowed to update this booking' })
    }

    booking.status = status
    await booking.save()
    return res.json(booking)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Update service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ error: 'service not found' })

    if (!req.body.provider || String(service.provider) !== String(req.body.provider)) {
      return res.status(403).json({ error: 'only provider can update service' })
    }

    const allowed = ['title', 'description', 'hourlyRate', 'packages', 'skills']
    for (const key of allowed) {
      if (typeof req.body[key] !== 'undefined') service[key] = req.body[key]
    }
    await service.save()
    return res.json(service)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ error: 'service not found' })

    const provider = req.query.provider || req.body.provider
    if (!provider || String(service.provider) !== String(provider)) {
      return res.status(403).json({ error: 'only provider can delete service' })
    }

    await Service.deleteOne({ _id: req.params.id })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
