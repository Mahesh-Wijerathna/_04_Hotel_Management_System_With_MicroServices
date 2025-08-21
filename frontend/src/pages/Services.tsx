import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

type Service = { id: number; service: string; price: number; currency?: string }

export default function Services() {
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
    <div>
      <h2>Services</h2>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <input placeholder="Name" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} />
        <input placeholder="Price" type="number" value={newService.price} onChange={e=>setNewService({...newService, price: Number(e.target.value)})} />
        <input placeholder="Currency" value={newService.currency} onChange={e=>setNewService({...newService, currency: e.target.value})} />
        <button onClick={createService}>Create</button>
      </div>
      {message && <p>{message}</p>}
      <ul>
        {services.map(s => (
          <li key={s.id}>{s.service} - {s.price} {s.currency || 'USD'}</li>
        ))}
      </ul>
    </div>
  )
}
