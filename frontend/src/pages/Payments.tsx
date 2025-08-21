import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

type Payment = { id: number; booking_id: number; amount?: number; status?: string }

export default function Payments() {
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [message, setMessage] = React.useState<string | null>(null)
  const [bookingId, setBookingId] = React.useState<string>('')

  const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null
  const auth = token ? { Authorization: `Bearer ${token}` } : {}

  async function load() {
    try {
      const res = await axios.get(`${API}/api/v1/payments/me`, { headers: { ...auth } })
      setPayments(res.data || [])
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Load failed (login needed)')
    }
  }

  async function createPayment() {
    try {
      setMessage(null)
      const idem = guid()
      await axios.post(`${API}/api/v1/payments`, { booking_id: Number(bookingId), method: 'card' }, { headers: { ...auth, 'Idempotency-Key': idem } })
      await load()
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Payment failed')
    }
  }

  React.useEffect(() => { load() }, [])

  return (
    <div>
      <h2>My Payments</h2>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input placeholder="Booking ID" value={bookingId} onChange={e=>setBookingId(e.target.value)} />
        <button onClick={createPayment}>Pay</button>
      </div>
      {message && <p>{message}</p>}
      <ul>
        {payments.map(p => (
          <li key={p.id}>
            #{p.id} – booking {p.booking_id} – {p.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
