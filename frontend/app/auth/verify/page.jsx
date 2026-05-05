"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function Verify() {
  const [form, setForm] = useState({ email: '', otp: '' })
  const [msg, setMsg] = useState('')

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) setMsg('Verified! You can now login.')
      else setMsg(data.error || 'verification failed')
    } catch (err) { setMsg('network error') }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Verify KIET email</h2>
      <form onSubmit={submit} className="space-y-3">
        <input name="email" placeholder="KIET email" value={form.email} onChange={handle} className="w-full p-2 border" />
        <input name="otp" placeholder="OTP" value={form.otp} onChange={handle} className="w-full p-2 border" />
        <button type="submit" className="px-4 py-2 bg-kietBlue text-white">Verify</button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <p className="mt-4 text-sm text-gray-600">
        Verified already? <Link href="/auth/login" className="text-kietBlue font-semibold">Go to login</Link>
      </p>
    </div>
  )
}
