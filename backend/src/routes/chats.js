const express = require('express')
const router = express.Router()
const Chat = require('../models/Chat')
const Message = require('../models/Message')

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed
}

// Get all chats for user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId
    if (!userId) return res.status(400).json({ error: 'missing userId' })
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'fullName photo')
      .sort({ _id: -1 })
    return res.json(chats)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Create or get chat between two users
router.post('/direct', async (req, res) => {
  try {
    const { user1, user2 } = req.body
    if (!user1 || !user2) return res.status(400).json({ error: 'missing users' })
    let chat = await Chat.findOne({ participants: { $all: [user1, user2] }, $expr: { $eq: [{ $size: '$participants' }, 2] } })
    if (!chat) {
      const unreadCounts = new Map()
      unreadCounts.set(String(user1), 0)
      unreadCounts.set(String(user2), 0)
      chat = new Chat({ participants: [user1, user2], unreadCounts })
      await chat.save()
    }
    return res.json(chat)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get one chat (for join-room bootstrap)
router.get('/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate('participants', 'fullName photo')
    if (!chat) return res.status(404).json({ error: 'chat not found' })
    return res.json(chat)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Get messages in a chat
router.get('/:chatId/messages', async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1)
    const limit = parsePositiveInt(req.query.limit, 50)

    const [messages, total] = await Promise.all([
      Message.find({ chat: req.params.chatId })
        .populate('sender', 'fullName photo')
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Message.countDocuments({ chat: req.params.chatId })
    ])

    return res.json({ messages, page, limit, total, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Send message (Socket.IO handles real-time; this persists)
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { sender, content } = req.body
    if (!sender || !content) return res.status(400).json({ error: 'missing fields' })
    const chat = await Chat.findById(req.params.chatId)
    if (!chat) return res.status(404).json({ error: 'chat not found' })

    const message = new Message({ chat: req.params.chatId, sender, content })
    await message.save()

    const unreadCounts = chat.unreadCounts || new Map()
    for (const participant of chat.participants) {
      const participantId = String(participant)
      if (participantId !== String(sender)) {
        const current = unreadCounts.get(participantId) || 0
        unreadCounts.set(participantId, current + 1)
      }
    }

    chat.lastMessage = content
    chat.unreadCounts = unreadCounts
    await chat.save()

    return res.status(201).json(message)
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// Mark chat as read for user
router.patch('/:chatId/read', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ error: 'missing userId' })

    const chat = await Chat.findById(req.params.chatId)
    if (!chat) return res.status(404).json({ error: 'chat not found' })

    const unreadCounts = chat.unreadCounts || new Map()
    unreadCounts.set(String(userId), 0)
    chat.unreadCounts = unreadCounts
    await chat.save()

    await Message.updateMany({ chat: req.params.chatId, readBy: { $ne: userId } }, { $push: { readBy: userId } })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
