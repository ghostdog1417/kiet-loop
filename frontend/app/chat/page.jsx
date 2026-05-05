"use client"
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuthStore } from '../../context/authStore'

export default function Chat() {
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const socketRef = useRef(null)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
    
    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return
    const fetchChats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/chats?userId=${user.id}`)
        const data = await res.json()
        setChats(data)
      } catch (e) { console.error(e) }
    }
    fetchChats()
  }, [user?.id])

  useEffect(() => {
    if (!activeChat) return
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/chats/${activeChat}/messages`)
        const data = await res.json()
        setMessages(data.messages || [])
      } catch (e) { console.error(e) }
    }
    fetchMessages()
  }, [activeChat])

  const handleSend = async () => {
    if (!input.trim() || !activeChat || !user?.id) return
    
    const message = { sender: user.id, content: input, timestamp: Date.now() }
    setMessages([...messages, message])
    setInput('')
    
    if (socketRef.current) {
      socketRef.current.emit('message', { room: activeChat, content: input })
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/chats/${activeChat}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: user.id, content: input })
      })
    } catch (e) { console.error(e) }
  }

  return (
    <div className="flex h-screen">
      {/* Chat List */}
      <div className="w-80 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {chats.map((chat) => (
            <div key={chat._id} onClick={() => setActiveChat(chat._id)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeChat === chat._id ? 'bg-blue-50 border-l-4 border-kietBlue' : ''}`}>
              <h3 className="font-semibold">{chat.participants?.[0]?.fullName || 'User'}</h3>
              <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${String(msg.sender?._id || msg.sender) === String(user?.id) ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg ${String(msg.sender?._id || msg.sender) === String(user?.id) ? 'bg-kietBlue text-white' : 'bg-gray-200'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded" />
              <button onClick={handleSend} className="px-6 py-2 bg-kietBlue text-white rounded">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  )
}
