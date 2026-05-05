const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')

// Razorpay placeholder - in production, initialize Razorpay with key/secret
const Razorpay = require('razorpay')

let razorpay = null
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

// Create payment order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, type, metadata } = req.body
    if (!amount || !type) return res.status(400).json({ error: 'missing' })

    // Store payment record
    const payment = new Payment({
      user: req.user?.id || 'guest', // placeholder auth check
      amount,
      type,
      metadata,
      status: 'pending'
    })

    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: amount * 100, // razorpay uses paise
          currency: 'INR',
          receipt: payment._id.toString(),
          notes: metadata
        })
        payment.razorpayOrderId = order.id
      } catch (e) {
        console.warn('razorpay order creation failed:', e.message)
      }
    } else {
      console.log('Razorpay not configured; mock order created')
    }

    await payment.save()
    return res.status(201).json({ orderId: payment.razorpayOrderId || payment._id, amount })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body
    if (!paymentId || !orderId) return res.status(400).json({ error: 'missing' })

    const payment = await Payment.findById(orderId)
    if (!payment) return res.status(404).json({ error: 'not found' })

    if (razorpay) {
      // in production, verify signature
      // const verified = razorpay.utils.verifyPaymentSignature({ orderId, paymentId, signature })
      // if (verified) payment.status = 'success'
    }

    payment.razorpayPaymentId = paymentId
    payment.status = 'success'
    await payment.save()

    return res.json({ ok: true, payment })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

// Get payment status
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
    if (!payment) return res.status(404).json({ error: 'not found' })
    return res.json(payment)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
