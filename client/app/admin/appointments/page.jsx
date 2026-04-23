'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Products', href: '/admin/products', icon: '👓' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Marketing', href: '/admin/marketing', icon: '🎯' },
  { label: '← Store', href: '/', icon: '🏪' },
];

export default function AdminAppointmentsPage() {
  const { user, token } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', note: '' });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const { data } = await axios.get(`${API}/appointments/admin${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(data.appointments || []);
    } catch (_) {
      toast.error('Failed to fetch appointments');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token, filter]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/appointments/${selected._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Appointment updated');
      setSelected(null);
      fetchAppointments();
    } catch (_) {
      toast.error('Update failed');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <aside style={{ width: 240, background: 'var(--dark)', flexShrink: 0, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '0 8px 20px', borderBottom: '1px solid var(--border-dark)', marginBottom: 8 }}>
          <span>👓</span><div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'white' }}>Lens Admin</div>
        </div>
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 6, fontSize: '0.875rem', color: item.href === '/admin/appointments' ? 'var(--primary)' : 'var(--gray-light)', background: item.href === '/admin/appointments' ? 'rgba(0,174,239,0.12)' : 'transparent', fontWeight: 500 }}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Eye Test Appointments</h1>
            <p style={{ color: 'var(--gray-mid)', fontSize: '0.825rem' }}>Manage home eye test requests in Jaipur</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px 14px', maxWidth: 200 }}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead style={{ background: 'var(--off-white)' }}>
              <tr>
                {['Customer', 'Phone', 'Address', 'Scheduled For', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--gray-mid)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Loading appointments...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>No appointments found</td></tr>
              ) : appointments.map(appt => (
                <tr key={appt._id} style={{ borderBottom: '1px solid var(--off-white)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{appt.name}</td>
                  <td style={{ padding: '12px 16px' }}>{appt.phone}</td>
                  <td style={{ padding: '12px 16px', maxWidth: 250 }}>{appt.address}, {appt.city}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{new Date(appt.date).toLocaleDateString('en-IN')}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-mid)' }}>{appt.timeSlot}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${appt.status === 'Completed' ? 'success' : appt.status === 'Pending' ? 'warning' : appt.status === 'Cancelled' ? 'error' : 'primary'}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => { setSelected(appt); setUpdateData({ status: appt.status, note: appt.adminNote || '' }); }}>Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 480 }}>
              <h3 style={{ marginBottom: 16 }}>Update Appointment</h3>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Status</label>
                <select className="form-select" value={updateData.status} onChange={e => setUpdateData({ ...updateData, status: e.target.value })}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Admin Note (Internal)</label>
                <textarea className="form-textarea" value={updateData.note} onChange={e => setUpdateData({ ...updateData, note: e.target.value })} rows={3} placeholder="Notes about the visit..." />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
