import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function CustomerRegister() {
  const [email, setEmail] = React.useState('customer@example.com')
  const [password, setPassword] = React.useState('Passw0rd!123')
  const [fullName, setFullName] = React.useState('Customer User')
  const [message, setMessage] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    try {
      const res = await axios.post(`${API}/api/v1/auth/register`, { email, password, full_name: fullName, role: 'customer' })
      setMessage(res.status === 201 ? 'Customer Registered' : `Status ${res.status}`)
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || 'Register failed')
    }
  }

  return (
    <div style={{
      maxWidth: "400px",
      margin: "0 auto",
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{color: "#34C759", textAlign: "center"}}>Customer Register</h2>
      <form onSubmit={onSubmit} style={{display:'grid',gap:16}}>
        <input
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <input
          placeholder="Full name"
          value={fullName}
          onChange={e=>setFullName(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#34C759",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >Register as Customer</button>
      </form>
      {message && <p style={{
        marginTop: "16px",
        color: message === 'Customer Registered' ? "#34C759" : "#FF3B30",
        textAlign: "center"
      }}>{message}</p>}
    </div>
  )
}
