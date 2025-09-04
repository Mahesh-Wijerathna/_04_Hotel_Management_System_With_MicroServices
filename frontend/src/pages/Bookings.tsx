import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

type Booking = { id: number; service_id: number; quantity: number; scheduled_for?: string; status?: string }
type Service = { id: number; service: string; price: number; currency?: string }

export default function Bookings() {
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [services, setServices] = React.useState<Service[]>([])
  const [message, setMessage] = React.useState<string | null>(null)
  const [newBooking, setNewBooking] = React.useState({ service_id: '', quantity: 1, scheduled_for: '' })

  const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null
  const auth = token ? { Authorization: `Bearer ${token}` } : {}

  async function loadBookings() {
    try {
      const res = await axios.get(`${API}/api/v1/bookings/me`, { headers: { ...auth } })
      setBookings(res.data || [])
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Load failed (login needed)')
    }
  }

  async function loadServices() {
    const res = await axios.get(`${API}/api/v1/services`)
    setServices(res.data || [])
  }

  async function createBooking() {
    try {
      setMessage(null)
      const res = await axios.post(`${API}/api/v1/bookings`, {
        service_id: Number(newBooking.service_id),
        quantity: newBooking.quantity,
        scheduled_for: newBooking.scheduled_for || undefined
      }, { headers: { ...auth } })
      setMessage(res.status === 201 ? 'Booking created' : `Status ${res.status}`)
      await loadBookings()
      setNewBooking({ service_id: '', quantity: 1, scheduled_for: '' })
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || 'Create failed')
    }
  }

  async function cancel(id: number) {
    try {
      await axios.patch(`${API}/api/v1/bookings/${id}/cancel`, null, { headers: { ...auth } })
      await loadBookings()
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Cancel failed')
    }
  }

  React.useEffect(() => { loadBookings(); loadServices() }, [])

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

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{color: "#34C759", textAlign: "center"}}>My Bookings</h2>
      <h3 style={{color: "#007AFF"}}>Create Booking</h3>
      <div style={{display:'flex',gap:12,alignItems:'center', marginBottom: 20, flexWrap: "wrap"}}>
        <select
          value={newBooking.service_id}
          onChange={e=>setNewBooking({...newBooking, service_id: e.target.value})}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px",
            flex: 1,
            minWidth: "200px"
          }}
        >
          <option value="">Select Service</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.service} - {s.price} {s.currency || 'USD'}</option>
          ))}
        </select>
        <input
          placeholder="Quantity"
          type="number"
          value={newBooking.quantity}
          onChange={e=>setNewBooking({...newBooking, quantity: Number(e.target.value)})}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px",
            width: "100px"
          }}
        />
        <input
          placeholder="Scheduled For"
          type="datetime-local"
          value={newBooking.scheduled_for}
          onChange={e=>setNewBooking({...newBooking, scheduled_for: e.target.value})}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <button
          onClick={createBooking}
          style={{
            padding: "12px 16px",
            background: "#34C759",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >Create Booking</button>
      </div>
      {message && <p style={{
        marginBottom: "16px",
        color: message === 'Booking created' ? "#34C759" : "#FF3B30",
        textAlign: "center"
      }}>{message}</p>}
      <h3 style={{color: "#007AFF"}}>My Bookings</h3>
      <ul style={{listStyle: "none", padding: 0}}>
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
            <span>#{b.id} – {getServiceName(b.service_id)} – qty {b.quantity} – {formatDate(b.scheduled_for)} – {b.status}</span>
            <button
              style={{
                padding: "8px 12px",
                background: "#FF3B30",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              onClick={() => cancel(b.id)}
            >Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
