import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

type User = { id: number; email: string; role: string }

export default function App() {
  const [user, setUser] = React.useState<User | null>(null)
  const navigate = useNavigate()

  async function fetchUser() {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      setUser(null)
      return
    }
    try {
      const res = await axios.get(`${API}/api/v1/auth/verify?token=${token}`)
      setUser(res.data)
    } catch (e) {
      // Token invalid, clear it
      localStorage.removeItem('jwtToken')
      setUser(null)
    }
  }

  function logout() {
    localStorage.removeItem('jwtToken')
    setUser(null)
    window.dispatchEvent(new Event('authChange'))
    navigate('/')
  }

  React.useEffect(() => { fetchUser() }, [])

  React.useEffect(() => {
    const handleAuthChange = () => fetchUser()
    window.addEventListener('authChange', handleAuthChange)
    return () => window.removeEventListener('authChange', handleAuthChange)
  }, [])

  return (
    <div>
      <header style={{
        padding: "16px 20px",
        background: "linear-gradient(90deg, #34C759 0%, #007AFF 100%)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{display:"flex",gap:16}}>
          <Link to="/" style={{color: "white", textDecoration: "none", fontWeight: "bold"}}>Home</Link>
          {!user && <Link to="/login" style={{color: "white", textDecoration: "none"}}>Login</Link>}
          {!user && <Link to="/customer-register" style={{color: "white", textDecoration: "none"}}>Customer Register</Link>}
          {!user && <Link to="/staff-register" style={{color: "white", textDecoration: "none"}}>Staff Register</Link>}
          {user?.role === 'customer' && <Link to="/customer-services" style={{color: "white", textDecoration: "none"}}>Customer Services</Link>}
          {user?.role === 'customer' && <Link to="/bookings" style={{color: "white", textDecoration: "none"}}>My Bookings</Link>}
          {user?.role === 'customer' && <Link to="/customer-payments" style={{color: "white", textDecoration: "none"}}>Customer Payments</Link>}
          {user?.role === 'staff' && <Link to="/staff-services" style={{color: "white", textDecoration: "none"}}>Staff Services</Link>}
          {user?.role === 'staff' && <Link to="/staff-payments" style={{color: "white", textDecoration: "none"}}>Staff Payments</Link>}
        </div>
        {user && (
          <div style={{display:"flex",gap:12, alignItems: 'center'}}>
            <span style={{color: "white"}}>Welcome {user.email} (Role: {user.role})</span>
            <button onClick={logout} style={{
              background: "#FF3B30",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer"
            }}>Logout</button>
          </div>
        )}
      </header>
      <main style={{
        padding: "20px",
        minHeight: "80vh",
        background: "linear-gradient(135deg, #E8F5E8 0%, #E3F2FD 100%)"
      }}>
        <Outlet />
      </main>
    </div>
  )
}
