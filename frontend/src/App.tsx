import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <header style={{padding:"12px",borderBottom:"1px solid #eee",display:"flex",gap:12}}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/services">Services</Link>
        <Link to="/bookings">My Bookings</Link>
        <Link to="/payments">My Payments</Link>
      </header>
      <main style={{padding:"16px"}}>
        <Outlet />
      </main>
    </div>
  )
}
