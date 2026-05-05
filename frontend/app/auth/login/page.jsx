"use client"
import { useState } from 'react'
import { useAuthStore } from '../../../context/authStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)
  const router = useRouter()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault(); setMsg('')
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setAuth(data.token, data.user)
        setMsg('Logged in')
        router.push('/marketplace')
      } else setMsg(data.error || 'login failed')
    } catch (err) { setMsg('network error') }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input name="email" placeholder="KIET email" value={form.email} onChange={handle} className="w-full p-2 border" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handle} className="w-full p-2 border" />
        <button type="submit" className="px-4 py-2 bg-kietBlue text-white">Login</button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <p className="mt-4 text-sm text-gray-600">
        New here? <Link href="/auth/signup" className="text-kietBlue font-semibold">Create account</Link>
      </p>
    </div>
  )
}
