"use client"
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [tab, setTab] = useState('analytics')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/admin/analytics')
        const data = await res.json()
        setStats(data)
      } catch (e) { console.error(e) }
    }
    const fetchReports = async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/admin/reports')
        const data = await res.json()
        setReports(Array.isArray(data) ? data : [])
      } catch (e) { console.error(e) }
    }
    fetchAnalytics()
    if (tab === 'reports') fetchReports()
  }, [tab])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('analytics')} className={`px-4 py-2 ${tab === 'analytics' ? 'bg-kietBlue text-white' : 'border'}`}>Analytics</button>
        <button onClick={() => setTab('reports')} className={`px-4 py-2 ${tab === 'reports' ? 'bg-kietBlue text-white' : 'border'}`}>Reports</button>
      </div>

      {tab === 'analytics' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <p className="text-gray-600">Daily Active Users</p>
            <p className="text-2xl font-bold">{stats?.dau || 0}</p>
          </div>
          <div className="border p-4 rounded">
            <p className="text-gray-600">Monthly Active Users</p>
            <p className="text-2xl font-bold">{stats?.mau || 0}</p>
          </div>
          <div className="border p-4 rounded">
            <p className="text-gray-600">Revenue</p>
            <p className="text-2xl font-bold">₹{stats?.revenue || 0}</p>
          </div>
          <div className="border p-4 rounded">
            <p className="text-gray-600">Listings Created</p>
            <p className="text-2xl font-bold">{stats?.listingsCreated || 0}</p>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Open Reports</h2>
          <div className="space-y-3">
            {reports.length === 0 && <p className="text-gray-500">No reports</p>}
            {reports.map((r) => (
              <div key={r._id} className="border p-3 rounded">
                <p><strong>{r.reason}</strong> - by {r.reportedBy?.fullName || 'Unknown'}</p>
                <p className="text-sm text-gray-600">{r.description}</p>
                <p className="text-xs text-gray-400">Status: {r.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
