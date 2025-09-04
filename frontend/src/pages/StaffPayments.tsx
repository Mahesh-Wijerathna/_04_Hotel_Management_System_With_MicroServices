import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

type Payment = { id: number; booking_id: number; amount?: number; status?: string }

export default function StaffPayments() {
  const [payment, setPayment] = React.useState<Payment | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)
  const [paymentId, setPaymentId] = React.useState<string>('')

  const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null
  const auth = token ? { Authorization: `Bearer ${token}` } : {}

  async function getPayment() {
    try {
      setMessage(null)
      const res = await axios.get(`${API}/api/v1/payments/${paymentId}`, { headers: { ...auth } })
      setPayment(res.data)
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Get payment failed')
      setPayment(null)
    }
  }

  async function refundPayment() {
    try {
      setMessage(null)
      await axios.post(`${API}/api/v1/payments/${paymentId}/refund`, {}, { headers: { ...auth } })
      setMessage('Refund initiated')
      setPayment(null)
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Refund failed')
    }
  }

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{color: "#34C759", textAlign: "center"}}>Staff Payments</h2>
      <div style={{display:'flex',gap:12,alignItems:'center', marginBottom: 20}}>
        <input
          placeholder="Payment ID"
          value={paymentId}
          onChange={e=>setPaymentId(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #007AFF",
            borderRadius: "4px",
            fontSize: "16px",
            flex: 1
          }}
        />
        <button
          onClick={getPayment}
          style={{
            padding: "12px 16px",
            background: "#34C759",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >Get Payment</button>
      </div>
      {message && <p style={{
        marginBottom: "16px",
        color: message === 'Refund initiated' ? "#34C759" : "#FF3B30",
        textAlign: "center"
      }}>{message}</p>}
      {payment && (
        <div style={{
          padding: "16px",
          border: "1px solid #E0E0E0",
          borderRadius: "4px",
          background: "#F9F9F9"
        }}>
          <h3 style={{color: "#007AFF"}}>Payment Details</h3>
          <p><strong>ID:</strong> {payment.id}</p>
          <p><strong>Booking ID:</strong> {payment.booking_id}</p>
          <p><strong>Amount:</strong> {payment.amount}</p>
          <p><strong>Status:</strong> {payment.status}</p>
          <button
            onClick={refundPayment}
            style={{
              padding: "10px 14px",
              background: "#FF3B30",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >Refund</button>
        </div>
      )}
    </div>
  )
}
