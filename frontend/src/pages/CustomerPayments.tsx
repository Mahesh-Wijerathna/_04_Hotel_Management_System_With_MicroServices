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
type Booking = { id: number; service_id: number; quantity: number; scheduled_for?: string; status?: string }
type Service = { id: number; service: string; price: number; currency?: string }

export default function CustomerPayments() {
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [services, setServices] = React.useState<Service[]>([])
  const [message, setMessage] = React.useState<string | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null
  const auth = token ? { Authorization: `Bearer ${token}` } : {}

  async function loadPayments() {
    try {
      const res = await axios.get(`${API}/api/v1/payments/me`, { headers: { ...auth } })
      setPayments(res.data || [])
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Load payments failed')
    }
  }

  async function loadBookings() {
    try {
      const res = await axios.get(`${API}/api/v1/bookings/me`, { headers: { ...auth } })
      setBookings(res.data || [])
    } catch (e: any) {
      // Ignore
    }
  }

  async function loadServices() {
    const res = await axios.get(`${API}/api/v1/services`)
    setServices(res.data || [])
  }

  async function createPayment(bookingId: number) {
    try {
      setMessage(null)
      const idem = guid()
      await axios.post(`${API}/api/v1/payments`, { booking_id: bookingId, method: 'card' }, { headers: { ...auth, 'Idempotency-Key': idem } })
      setMessage('Payment created')
      await loadPayments()
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Payment failed')
    }
  }

  React.useEffect(() => { loadPayments(); loadBookings(); loadServices() }, [])

  const getServiceName = (id: number) => {
    const service = services.find(s => s.id === id)
    return service ? service.service : `Service ${id}`
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canPay = (bookingId: number) => {
    const payment = payments.find(p => p.booking_id === bookingId)
    return !payment || payment.status === 'refunded' || payment.status === 'failed'
  }

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{color: "#34C759", textAlign: "center"}}>Customer Payments</h2>
      <h3 style={{color: "#007AFF"}}>My Bookings</h3>
      <ul style={{listStyle: "none", padding: 0, marginBottom: 20}}>
        {bookings.map(b => (
          <li key={b.id} style={{
            padding: "12px",
            border: "1px solid #E0E0E0",
            borderRadius: "4px",
            marginBottom: "8px",
            background: "#F9F9F9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>#{b.id} – {getServiceName(b.service_id)} – qty {b.quantity} – {formatDate(b.scheduled_for)}</span>
            {canPay(b.id) && <button
              style={{
                padding: "8px 12px",
                background: "#34C759",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              onClick={() => createPayment(b.id)}
            >Pay</button>}
            {!canPay(b.id) && <span style={{color: "#34C759", fontWeight: "bold"}}>Paid</span>}
          </li>
        ))}
      </ul>
      {message && <p style={{
        marginBottom: "16px",
        color: message === 'Payment created' ? "#34C759" : "#FF3B30",
        textAlign: "center"
      }}>{message}</p>}
      <h3 style={{color: "#007AFF"}}>My Payments</h3>
      <ul style={{listStyle: "none", padding: 0}}>
        {payments.map(p => (
          <li key={p.id} style={{
            padding: "12px",
            border: "1px solid #E0E0E0",
            borderRadius: "4px",
            marginBottom: "8px",
            background: "#F9F9F9"
          }}>
            #{p.id} – booking {p.booking_id} – {p.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
