"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../../context/authStore'

export default function Services() {
  const [services, setServices] = useState([])
  const [filters, setFilters] = useState({ skill: '', search: '' })
  const [form, setForm] = useState({ title: '', description: '', hourlyRate: '', skills: '' })
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = new URLSearchParams()
        if (filters.skill) query.append('skill', filters.skill)
        if (filters.search) query.append('q', filters.search)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/services?${query}`)
        const data = await res.json()
        setServices(data.services || [])
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [filters])

  const handleCreateService = async (e) => {
    e.preventDefault()
    setMsg('')
    if (!user?.id) {
      setMsg('Login is required to offer a service.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: user.id,
          title: form.title,
          description: form.description,
          hourlyRate: Number(form.hourlyRate),
          skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean)
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg(data.error || 'Failed to create service')
      } else {
        setForm({ title: '', description: '', hourlyRate: '', skills: '' })
        setServices((prev) => [data, ...prev])
        setMsg('Service created successfully.')
      }
    } catch (error) {
      console.error(error)
      setMsg('Network error while creating service')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-kietBlue">Student Services</h1>
        <p className="text-gray-600 mb-6">Hire talented KIET students for tutoring, design, coding, and more</p>

        <form onSubmit={handleCreateService} className="bg-white rounded-lg shadow p-4 mb-6 space-y-3">
          <h2 className="text-lg font-semibold">Offer Your Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Service title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Hourly rate"
              value={form.hourlyRate}
              onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="px-3 py-2 border rounded md:col-span-2"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border rounded min-h-24"
          />
          <div className="flex items-center gap-3">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-kietBlue text-white rounded disabled:opacity-60">
              {submitting ? 'Publishing...' : 'Publish Service'}
            </button>
            {msg && <span className="text-sm text-gray-600">{msg}</span>}
          </div>
        </form>

        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
          <input type="text" placeholder="Search services..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="flex-1 px-4 py-2 border rounded" />
          <button
            type="button"
            onClick={() => document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-2 bg-kietBlue text-white rounded"
          >
            + Offer Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Link key={service._id} href={`/services/${service._id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-kietBlue font-bold">₹{service.hourlyRate}/hr</span>
                      <span className="text-yellow-500">★ {service.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No services found</p>
            <button
              type="button"
              onClick={() => document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-kietBlue font-bold"
            >
              Offer your first service →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
