"use client"
import { useState } from 'react'

export default function PaymentModal({ isOpen, onClose, type, amount }) {
  const [paymentId, setPaymentId] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleCreateOrder = async () => {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type })
      })
      const data = await res.json()
      if (res.ok) {
        setOrderId(data.orderId)
        setMsg('Order created. In production, Razorpay modal would open here.')
      } else setMsg(data.error || 'failed')
    } catch (e) { setMsg('network error') }
    setLoading(false)
  }

  const handleVerifyPayment = async () => {
    setLoading(true)
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/payments/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, orderId, signature: '' })
      })
      const data = await res.json()
      if (res.ok) {
        setMsg('Payment successful!')
        setTimeout(() => onClose(), 2000)
      } else setMsg(data.error || 'verification failed')
    } catch (e) { setMsg('network error') }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{type} - ₹{amount}</h2>
        {!orderId ? (
          <>
            <p className="text-sm text-gray-600 mb-4">Click below to create payment order</p>
            <button onClick={handleCreateOrder} disabled={loading} className="w-full px-4 py-2 bg-kietBlue text-white rounded">
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm mb-3">Order ID: {orderId}</p>
            <input type="text" placeholder="Payment ID (from Razorpay)" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} className="w-full p-2 border mb-3" />
            <button onClick={handleVerifyPayment} disabled={loading} className="w-full px-4 py-2 bg-green-600 text-white rounded">
              {loading ? 'Verifying...' : 'Verify Payment'}
            </button>
          </>
        )}
        {msg && <p className="mt-3 text-sm text-gray-600">{msg}</p>}
        <button onClick={onClose} className="w-full mt-3 px-4 py-2 border">Close</button>
      </div>
    </div>
  )
}
