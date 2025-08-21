"use client";
import React from 'react';
import axios from 'axios';

type Booking = { id: number; service_id: number; quantity: number; scheduled_for?: string; status?: string };

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [message, setMessage] = React.useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  async function load() {
    try {
      const res = await axios.get(`${API}/api/v1/bookings/me`, { headers: { ...auth } });
      setBookings(res.data || []);
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Load failed (login needed)');
    }
  }

  async function cancel(id: number) {
    try {
      await axios.patch(`${API}/api/v1/bookings/${id}/cancel`, null, { headers: { ...auth } });
      await load();
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || 'Cancel failed');
    }
  }

  React.useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      {message && <p>{message}</p>}
      <ul>
        {bookings.map(b => (
          <li key={b.id}>
            #{b.id} – service {b.service_id} – qty {b.quantity} – {b.scheduled_for} – {b.status}
            <button style={{marginLeft:8}} onClick={() => cancel(b.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
