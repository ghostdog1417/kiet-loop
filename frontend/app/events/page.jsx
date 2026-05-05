"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Events() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/events`)
        const data = await res.json()
        setEvents(data)
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-kietBlue">KIET Events & Clubs</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Events Calendar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event._id} className="border-l-4 border-kietBlue pl-4">
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm">{event.location}</p>
                  <button className="mt-2 text-kietBlue font-semibold text-sm">Register →</button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Clubs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Top Clubs</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border p-3 rounded hover:bg-gray-50">
                  <h3 className="font-bold">Club Name</h3>
                  <p className="text-gray-600 text-sm">500+ members</p>
                  <button className="mt-2 text-kietBlue font-semibold text-sm">Join →</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
