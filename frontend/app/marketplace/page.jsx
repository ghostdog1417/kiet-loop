"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../../context/authStore'

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [filters, setFilters] = useState({ category: '', search: '' })
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: '',
    location: '',
    tags: ''
  })
  const [formMsg, setFormMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams()
        if (filters.category) query.append('category', filters.category)
        if (filters.search) query.append('q', filters.search)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/listings?${query}`)
        const data = await res.json()
        setListings(data.listings || [])
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetchData()
  }, [filters])

  const handleCreateListing = async (e) => {
    e.preventDefault()
    setFormMsg('')
    if (!user?.id) {
      setFormMsg('Login is required to create a listing.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        condition: form.condition,
        location: form.location,
        seller: user.id,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        setFormMsg(data.error || 'Failed to create listing')
      } else {
        setForm({
          title: '',
          description: '',
          category: '',
          price: '',
          condition: '',
          location: '',
          tags: ''
        })
        setFormMsg('Listing posted successfully.')
        setListings((prev) => [data, ...prev])
      }
    } catch (error) {
      console.error(error)
      setFormMsg('Network error while posting listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-kietBlue">KIET Marketplace</h1>

        <form onSubmit={handleCreateListing} className="bg-white rounded-lg shadow p-4 mb-6 space-y-3">
          <h2 className="text-lg font-semibold">Create Listing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="academic">Academic</option>
              <option value="electronics">Electronics</option>
              <option value="hostel">Hostel Essentials</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="mobility">Mobility</option>
            </select>
            <input
              type="text"
              placeholder="Condition (new, good, used)"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="px-3 py-2 border rounded"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border rounded min-h-24"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-kietBlue text-white rounded disabled:opacity-60"
            >
              {submitting ? 'Posting...' : 'Post Listing'}
            </button>
            {formMsg && <span className="text-sm text-gray-600">{formMsg}</span>}
          </div>
        </form>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
          <input type="text" placeholder="Search listings..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="flex-1 px-4 py-2 border rounded" />
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="px-4 py-2 border rounded">
            <option value="">All Categories</option>
            <option value="academic">Academic</option>
            <option value="electronics">Electronics</option>
            <option value="hostel">Hostel Essentials</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
          <button
            type="button"
            onClick={() => document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-2 bg-kietBlue text-white rounded"
          >
            + Post
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <Link key={listing._id} href={`/marketplace/${listing._id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    {listing.images?.[0] ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" /> : <span className="text-gray-400">No image</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
                    <p className="text-kietBlue font-bold text-lg mb-2">₹{listing.price}</p>
                    <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{listing.condition}</span>
                      <span className="text-xs text-gray-500">{listing.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {listings.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No listings found</p>
            <button
              type="button"
              onClick={() => document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-kietBlue font-bold"
            >
              Create the first listing →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
