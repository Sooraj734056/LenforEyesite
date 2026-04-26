'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiLayout, FiBox, FiShoppingBag, FiCalendar, FiTarget, FiArrowLeft, 
  FiUser, FiPhone, FiMapPin, FiClock, FiCheckCircle, FiEdit3 
} from 'react-icons/fi';
import styles from '../page.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: <FiLayout /> },
  { label: 'Products', href: '/admin/products', icon: <FiBox /> },
  { label: 'Orders', href: '/admin/orders', icon: <FiShoppingBag /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <FiCalendar /> },
  { label: 'Marketing', href: '/admin/marketing', icon: <FiTarget /> },
  { label: 'Back to Store', href: '/', icon: <FiArrowLeft /> },
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
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandIcon}><FiBox /></div>
          <div>
            <div className={styles.brandName}>LensPanel</div>
            <div className={styles.brandSub}>PRO DASHBOARD</div>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${item.href === '/admin/appointments' ? styles.navActive : ''}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarUser}>
          <div className={styles.userAvatar}>{user.name[0]}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>System Admin</div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Appointments</h1>
            <p className={styles.pageDate}>{appointments.length} eye test requests</p>
          </div>
        </div>

        <div style={{ padding: '32px 40px' }}>
          <div style={{ marginBottom: 24 }}>
            <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 220 }}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className={styles.tableCard} style={{ padding: 0, overflow: 'hidden' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading...</td></tr>
                ) : appointments.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No eye test requests found</td></tr>
                ) : appointments.map(appt => (
                  <tr key={appt._id}>
                    <td>
                      <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><FiUser /> {appt.name}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiPhone /> {appt.phone}</div>
                    </td>
                    <td style={{ maxWidth: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <FiMapPin style={{ marginTop: 3, flexShrink: 0 }} />
                        <span>{appt.address}, {appt.city}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><FiCalendar /> {new Date(appt.date).toLocaleDateString('en-IN')}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}><FiClock /> {appt.timeSlot}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${appt.status === 'Completed' ? 'success' : appt.status === 'Pending' ? 'warning' : appt.status === 'Cancelled' ? 'error' : 'primary'}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelected(appt); setUpdateData({ status: appt.status, note: appt.adminNote || '' }); }}><FiEdit3 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: 4, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Manage Eye Test</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 24 }}>Customer: {selected.name}</p>
              
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Update Status</label>
                <select className="form-select" value={updateData.status} onChange={e => setUpdateData({ ...updateData, status: e.target.value })}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Internal Note</label>
                <textarea 
                  className="form-textarea" 
                  value={updateData.note} 
                  onChange={e => setUpdateData({ ...updateData, note: e.target.value })} 
                  rows={3} 
                  placeholder="Notes about the home visit..." 
                />
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setSelected(null)} style={{ flex: 1 }}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdate} style={{ flex: 2 }}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
