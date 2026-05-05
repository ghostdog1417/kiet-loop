const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const User = require('../models/User')
const Listing = require('../models/Listing')
const Service = require('../models/Service')

// Create review
router.post('/', async (req, res) => {
  try {
    const { reviewer, reviewee, listing, service, rating, comment, categories } = req.body
    if (!reviewer || !reviewee || !rating) return res.status(400).json({ error: 'missing fields' })
    const review = new Review({ reviewer, reviewee, listing, service, rating, comment, categories })
    await review.save()
    
    // Update reviewee rating
    const reviews = await Review.find({ reviewee })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await User.findByIdAndUpdate(reviewee, { rating: avgRating })
    
    return res.status(201).json(review)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get reviews for user
router.get('/user/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id }).populate('reviewer', 'fullName photo')
    return res.json(reviews)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Recommendation engine
router.get('/recommendations', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ error: 'missing userId' })
    
    const user = await User.findById(userId)
    
    // Placeholder recommendations - replace with real ML/algorithm
    const recommendations = {
      suggestedListings: [], // would be listings matching user interests
      suggestedSellers: [], // top rated sellers in categories user browses
      suggestedServices: [], // services user might need
      suggestedConnections: [] // potential roommates, freelancers
    }
    
    // Get top listings (mock)
    const listings = await Listing.find({ available: true }).limit(5)
    recommendations.suggestedListings = listings
    
    // Get top sellers
    const sellers = await User.find({ roles: { $in: ['verified_seller'] }, verified: true }).limit(5)
    recommendations.suggestedSellers = sellers
    
    // Get trending services
    const services = await Service.find().sort({ rating: -1 }).limit(5)
    recommendations.suggestedServices = services
    
    return res.json(recommendations)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
