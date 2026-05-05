"use client"
import Link from 'next/link'
import { useAuthStore } from '../context/authStore'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    clearAuth()
    router.push('/auth/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-kietBlue">KIET Loop</Link>

        {/* Menu */}
        <div className="flex gap-6 items-center">
          <Link href="/marketplace" className="text-gray-700 hover:text-kietBlue">Marketplace</Link>
          <Link href="/services" className="text-gray-700 hover:text-kietBlue">Services</Link>
          <Link href="/community" className="text-gray-700 hover:text-kietBlue">Community</Link>
          <Link href="/events" className="text-gray-700 hover:text-kietBlue">Events</Link>
          <Link href="/chat" className="text-gray-700 hover:text-kietBlue">Chat</Link>

          {user ? (
            <>
              <Link href={`/profile/${user.id || user._id}`} className="text-gray-700 hover:text-kietBlue">Profile</Link>
              <button onClick={handleLogout} className="px-4 py-2 border text-gray-700 rounded hover:border-kietBlue">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-4 py-2 border text-gray-700 rounded hover:border-kietBlue">Login</Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-kietBlue text-white rounded">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
