'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', address: '', date: '', timeSlot: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const TIME_SLOTS = [
    '10:00 AM – 11:00 AM', 
    '11:00 AM – 12:00 PM', 
    '12:00 PM – 1:00 PM', 
    '2:00 PM – 3:00 PM', 
    '3:00 PM – 4:00 PM', 
    '4:00 PM – 5:00 PM', 
    '5:00 PM – 6:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, city: 'Jaipur' })
      });
      setSubmitted(true);
    } catch (_) {
      console.error("Booking failed");
    }
    setLoading(false);
  };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
      <h3>Appointment Booked!</h3>
      <p style={{ color: 'var(--gray-mid)', marginTop: 8 }}>We'll confirm your slot via WhatsApp within 2 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
      <div className="form-group">
        <label className="form-label">Your Name *</label>
        <input className="form-input" required placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} id="appt-name" />
      </div>
      <div className="form-group">
        <label className="form-label">Phone Number *</label>
        <input className="form-input" required placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} id="appt-phone" />
      </div>
      <div className="form-group">
        <label className="form-label">Home Address *</label>
        <textarea className="form-textarea" required placeholder="Full address with landmark" style={{ minHeight: 80 }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} id="appt-address" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Preferred Date *</label>
          <input type="date" className="form-input" required min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} id="appt-date" />
        </div>
        <div className="form-group">
          <label className="form-label">Time Slot *</label>
          <select className="form-select" required value={form.timeSlot} onChange={e => setForm(f => ({ ...f, timeSlot: e.target.value }))} id="appt-slot">
            <option value="">Select time</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading} id="book-appt-btn">
        {loading ? 'Booking...' : '📅 Book Free Appointment'}
      </button>
    </form>
  );
}
