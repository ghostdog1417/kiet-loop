require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const connectDB = require('./db')
const morgan = require('morgan')

const authRoutes = require('./routes/auth')
const authExtras = require('./routes/auth_extras')
const listingsRoutes = require('./routes/listings')
const paymentRoutes = require('./routes/payments')
const adminRoutes = require('./routes/admin')
const usersRoutes = require('./routes/users')
const chatsRoutes = require('./routes/chats')
const servicesRoutes = require('./routes/services')
const communityRoutes = require('./routes/community')
const eventsRoutes = require('./routes/events')
const reviewsRoutes = require('./routes/reviews')
const launchRoutes = require('./routes/launch')

const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://kiet-loop.vercel.app',
  'http://localhost:3000'
]

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}

const app = express()
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRoutes)
app.use('/auth', authExtras)
app.use('/listings', listingsRoutes)
app.use('/payments', paymentRoutes)
app.use('/admin', adminRoutes)
app.use('/users', usersRoutes)
app.use('/chats', chatsRoutes)
app.use('/services', servicesRoutes)
app.use('/community', communityRoutes)
app.use('/events', eventsRoutes)
app.use('/reviews', reviewsRoutes)
app.use('/notifications', launchRoutes)
app.use('/referral', launchRoutes)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log('socket connected', socket.id)
  socket.on('join', (room) => socket.join(room))
  socket.on('message', (msg) => {
    io.to(msg.room).emit('message', { sender: socket.id, content: msg.content, timestamp: Date.now() })
  })
  socket.on('typing', (room) => io.to(room).emit('typing', { user: socket.id }))
  socket.on('disconnect', () => console.log('socket disconnected', socket.id))
})

const PORT = process.env.PORT || 5000
connectDB().then((ok) => {
  if (!ok) console.warn('Warning: DB not connected; some features will be disabled until DB is available.')
  server.listen(PORT, () => console.log(`Backend listening on ${PORT}`))
})
