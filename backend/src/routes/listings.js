const express = require('express')
const router = express.Router()
const Listing = require('../models/Listing')

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Create listing
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      price,
      negotiable,
      condition,
      images,
      seller,
      tags,
      location
    } = req.body

    if (!title || !seller || typeof price !== 'number') {
      return res.status(400).json({ error: 'title, seller and numeric price are required' })
    }

    const listing = new Listing({
      title: title.trim(),
      description,
      category,
      subcategory,
      price,
      negotiable: Boolean(negotiable),
      condition,
      images: Array.isArray(images) ? images : [],
      seller,
      tags: Array.isArray(tags) ? tags : [],
      location
    })
    await listing.save()
    const populated = await listing.populate('seller', 'fullName verified photo')
    return res.status(201).json(populated)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

// Read listings (query)
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, seller, sort = 'newest' } = req.query
    const page = parsePositiveInt(req.query.page, 1)
    const limit = parsePositiveInt(req.query.limit, 20)
    const filter = { available: true }

    if (category) filter.category = category
    if (seller) filter.seller = seller
    if (typeof minPrice !== 'undefined' || typeof maxPrice !== 'undefined') {
      filter.price = {}
      if (typeof minPrice !== 'undefined') filter.price.$gte = Number(minPrice)
      if (typeof maxPrice !== 'undefined') filter.price.$lte = Number(maxPrice)
    }
    if (q) {
      const safe = escapeRegex(String(q).trim())
      const regex = new RegExp(safe, 'i')
      filter.$or = [{ title: regex }, { description: regex }, { tags: regex }, { location: regex }]
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { price: 1 },
      price_high: { price: -1 }
    }
    const sortBy = sortMap[sort] || sortMap.newest

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('seller', 'fullName verified photo'),
      Listing.countDocuments(filter)
    ])

    return res.json({
      listings,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

// Get single
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'fullName verified')
    if (!listing) return res.status(404).json({ error: 'not found' })
    return res.json(listing)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

// Update (placeholder)
router.put('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ error: 'not found' })

    const actorSellerId = req.body.seller
    if (!actorSellerId || String(listing.seller) !== String(actorSellerId)) {
      return res.status(403).json({ error: 'only owner can update listing' })
    }

    const allowed = [
      'title',
      'description',
      'category',
      'subcategory',
      'price',
      'negotiable',
      'condition',
      'images',
      'tags',
      'location',
      'available'
    ]
    for (const key of allowed) {
      if (typeof req.body[key] !== 'undefined') listing[key] = req.body[key]
    }

    const updated = await listing.save()
    return res.json(updated)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

// Delete (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ error: 'not found' })

    const sellerId = req.query.sellerId || req.body.sellerId
    if (!sellerId || String(listing.seller) !== String(sellerId)) {
      return res.status(403).json({ error: 'only owner can delete listing' })
    }

    listing.available = false
    await listing.save()
    return res.json(listing)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
