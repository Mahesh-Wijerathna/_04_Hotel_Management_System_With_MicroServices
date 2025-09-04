import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

type Service = { id: number; service: string; price: number; currency?: string }

export default function CustomerServices() {
  const [services, setServices] = React.useState<Service[]>([])

  async function load() {
    const res = await axios.get(`${API}/api/v1/services`)
    setServices(res.data || [])
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
      <h2 style={{color: "#34C759", textAlign: "center"}}>Customer Services</h2>
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
