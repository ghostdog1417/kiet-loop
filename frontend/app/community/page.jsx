"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Community() {
  const [tab, setTab] = useState('lost')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = '/community/lostfound'
        if (tab === 'roommate') endpoint = '/community/roommate'
        if (tab === 'internship') endpoint = '/community/internship'
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`)
        const data = await res.json()
        setPosts(data)
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [tab])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-kietBlue">Community Board</h1>

        <div className="flex gap-2 mb-6">
          {['lost', 'roommate', 'internship'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded font-semibold ${tab === t ? 'bg-kietBlue text-white' : 'bg-white border'}`}>
              {t === 'lost' && 'Lost & Found'}
              {t === 'roommate' && 'Roommate Finder'}
              {t === 'internship' && 'Internship Board'}
            </button>
          ))}
          <Link href={`/community/${tab}/create`} className="ml-auto px-6 py-2 bg-kietBlue text-white rounded">+ Post</Link>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-3">{post.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{post.location}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
