import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Hotel Management',
  description: 'Microservices Frontend'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{padding:"12px",borderBottom:"1px solid #eee",display:"flex",gap:12}}>
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          <a href="/services">Services</a>
          <a href="/bookings">My Bookings</a>
          <a href="/payments">My Payments</a>
        </header>
        <main style={{padding:"16px"}}>{children}</main>
      </body>
    </html>
  );
}
