import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function Login() {
  const [email, setEmail] = React.useState('staff@example.com')
  const [password, setPassword] = React.useState('Passw0rd!123')
  const [message, setMessage] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    try {
      const res = await axios.post(`${API}/api/v1/auth/login`, { email, password })
      const token = res.data?.access_token
      if (token) {
        localStorage.setItem('jwtToken', token)
        setMessage('Logged in')
      } else {
        setMessage('No token returned')
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{display:'grid',gap:8,maxWidth:360}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
