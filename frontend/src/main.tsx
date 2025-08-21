import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Bookings from './pages/Bookings'
import Payments from './pages/Payments'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <div><h1>Hotel Management</h1><p>Welcome. Use the nav.</p></div> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'services', element: <Services /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'payments', element: <Payments /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
