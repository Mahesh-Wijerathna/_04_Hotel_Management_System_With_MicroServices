import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import StaffRegister from './pages/StaffRegister'
import CustomerRegister from './pages/CustomerRegister'
import StaffServices from './pages/StaffServices'
import CustomerServices from './pages/CustomerServices'
import Bookings from './pages/Bookings'
import StaffPayments from './pages/StaffPayments'
import CustomerPayments from './pages/CustomerPayments'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: (
        <div style={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '20px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>Welcome to Hotel Management</h1>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '40px',
            textAlign: 'center'
          }}>Manage your hotel services, bookings, and payments with ease.</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            width: '100%',
            maxWidth: '800px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h2>Services</h2>
              <p>View and manage hotel services.</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h2>Bookings</h2>
              <p>Create and manage your bookings.</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h2>Payments</h2>
              <p>Handle payments and refunds.</p>
            </div>
          </div>
        </div>
      ) },
      { path: 'login', element: <Login /> },
      { path: 'staff-register', element: <StaffRegister /> },
      { path: 'customer-register', element: <CustomerRegister /> },
      { path: 'staff-services', element: <StaffServices /> },
      { path: 'customer-services', element: <CustomerServices /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'staff-payments', element: <StaffPayments /> },
      { path: 'customer-payments', element: <CustomerPayments /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
