"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function Profile() {
  const params = useParams()
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState({ bio: '', skills: '', availability: '' })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/users/${params.id}`)
        const data = await res.json()
        setUser(data.user)
        setReviews(data.reviews || [])
        setForm({ bio: data.user?.bio || '', skills: data.user?.skills?.join(', ') || '', availability: data.user?.availability || '' })
      } catch (e) { console.error(e) }
    }
    if (params.id) fetchProfile()
  }, [params.id])

  const handleSave = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, skills: form.skills.split(',').map(s => s.trim()) })
      })
      setIsEdit(false)
    } catch (e) { console.error(e) }
  }

  if (!user) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-6 mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <p className="text-gray-600 mb-2">{user.department} - Year {user.year}</p>
              <div className="flex gap-4 text-sm">
                <span>⭐ {user.rating}/5.0</span>
                <span>📋 {user.listingsCount} listings</span>
                <span>✓ {user.roles.join(', ')}</span>
              </div>
            </div>
          </div>

          {isEdit ? (
            <div className="space-y-4">
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" className="w-full px-4 py-2 border rounded" />
              <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills (comma separated)" className="w-full px-4 py-2 border rounded" />
              <input type="text" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} placeholder="Availability" className="w-full px-4 py-2 border rounded" />
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-6 py-2 bg-kietBlue text-white rounded">Save</button>
                <button onClick={() => setIsEdit(false)} className="px-6 py-2 border rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-4">{user.bio}</p>
              {user.skills?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-kietBlue px-3 py-1 rounded-full text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => setIsEdit(true)} className="px-6 py-2 border rounded">Edit Profile</button>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{review.reviewer?.fullName}</h3>
                  <span className="text-yellow-500">★ {review.rating}/5</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
