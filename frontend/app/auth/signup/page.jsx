"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', rollNumber: '', email: '', password: '' })
  const [msg, setMsg] = useState('')

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) setMsg('Signup created — check your KIET email for OTP (console in dev)')
      else setMsg(data.error || 'signup failed')
    } catch (err) {
      setMsg('network error')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create KIET Loop account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input name="fullName" placeholder="Full name" value={form.fullName} onChange={handle} className="w-full p-2 border" />
        <input name="rollNumber" placeholder="Roll number" value={form.rollNumber} onChange={handle} className="w-full p-2 border" />
        <input name="email" placeholder="KIET email" value={form.email} onChange={handle} className="w-full p-2 border" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handle} className="w-full p-2 border" />
        <button type="submit" className="px-4 py-2 bg-kietBlue text-white">Sign up</button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link href="/auth/login" className="text-kietBlue font-semibold">Login</Link>
      </p>
    </div>
  )
}
