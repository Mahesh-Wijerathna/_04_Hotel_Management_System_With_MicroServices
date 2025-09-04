import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

type Service = { id: number; service: string; price: number; currency?: string }

export default function StaffServices() {
  const [services, setServices] = React.useState<Service[]>([])
  const [message, setMessage] = React.useState<string | null>(null)
  const [newService, setNewService] = React.useState({ name: 'Breakfast', price: 9.99, currency: 'USD' })

  const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null
  const auth = token ? { Authorization: `Bearer ${token}` } : {}

  async function load() {
    const res = await axios.get(`${API}/api/v1/services`)
    setServices(res.data || [])
  }

  async function createService() {
    try {
      setMessage(null)
      const res = await axios.post(`${API}/api/v1/services`, { service: newService.name, price: newService.price, currency: newService.currency }, { headers: { ...auth } })
      setMessage(res.status === 201 ? 'Created' : `Status ${res.status}`)
      await load()
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || 'Create failed')
    }
  }

  React.useEffect(() => { load() }, [])

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{color: "#34C759", textAlign: "center"}}>Staff Services</h2>
      <div style={{display:'flex',gap:12,alignItems:'center', marginBottom: 20}}>
        <input
          placeholder="Name"
          value={newService.name}
          onChange={e=>setNewService({...newService, name: e.target.value})}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px",
            flex: 1
          }}
        />
        <input
          placeholder="Price"
          type="number"
          value={newService.price}
          onChange={e=>setNewService({...newService, price: Number(e.target.value)})}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px",
            width: "100px"
          }}
        />
        <input
          placeholder="Currency"
          value={newService.currency}
          onChange={e=>setNewService({...newService, currency: e.target.value})}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px",
            width: "80px"
          }}
        />
        <button
          onClick={createService}
          style={{
            padding: "12px 16px",
            background: "#34C759",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >Create</button>
      </div>
      {message && <p style={{
        marginBottom: "16px",
        color: message === 'Created' ? "#34C759" : "#FF3B30",
        textAlign: "center"
      }}>{message}</p>}
      <ul style={{listStyle: "none", padding: 0}}>
        {services.map(s => (
          <li key={s.id} style={{
            padding: "12px",
            border: "1px solid #E0E0E0",
            borderRadius: "4px",
            marginBottom: "8px",
            background: "#F9F9F9"
          }}>
            {s.service} - {s.price} {s.currency || 'USD'}
          </li>
        ))}
      </ul>
    </div>
  )
}
