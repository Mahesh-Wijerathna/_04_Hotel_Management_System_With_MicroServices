"use client";
import React from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [email, setEmail] = React.useState('staff@example.com');
  const [password, setPassword] = React.useState('Passw0rd!123');
  const [fullName, setFullName] = React.useState('Staff User');
  const [role, setRole] = React.useState<'customer'|'staff'>('staff');
  const [message, setMessage] = React.useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await axios.post(`${API}/api/v1/auth/register`, { email, password, full_name: fullName, role });
      setMessage(res.status === 201 ? 'Registered' : `Status ${res.status}`);
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || 'Register failed (maybe already exists)');
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{display:'grid',gap:8,maxWidth:360}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
