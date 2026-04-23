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

export default function AdminOrdersPage() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const STATUS_OPTIONS = ['Payment Received', 'Prescription Verified', 'Lab Processing', 'Quality Check', 'Shipped', 'Delivered', 'Cancelled'];
  const STATUS_COLORS = { 'Payment Received': 'warning', 'Prescription Verified': 'primary', 'Lab Processing': 'primary', 'Quality Check': 'primary', 'Shipped': 'success', 'Delivered': 'success', 'Cancelled': 'error' };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('status', filter);
      if (search) params.set('search', search);
      const { data } = await axios.get(`${API}/orders?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(data.orders || []); setTotal(data.total || 0);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { if (token) fetchOrders(); }, [token, filter, search]);

  const updateStatus = async () => {
    if (!newStatus || !selected) return;
    try {
      await axios.put(`${API}/orders/${selected._id}/status`, { status: newStatus, note: statusNote }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Order status updated!');
      fetchOrders();
      setSelected(null);
    } catch (_) { toast.error('Update failed'); }
  };

  const printJobSheet = (order) => {
    const sheet = `
      <html><head><title>Job Sheet — ${order.orderNumber}</title>
      <style>body{font-family:Arial;padding:32px} h1{color:#00AEEF} table{width:100%;border-collapse:collapse} td,th{border:1px solid #ddd;padding:8px} @media print{.noprint{display:none}}</style>
      </head><body>
      <h1>🔬 Lab Job Sheet</h1>
      <p><strong>Order:</strong> ${order.orderNumber} | <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
      <p><strong>Customer:</strong> ${order.shippingAddress?.fullName} | <strong>Phone:</strong> ${order.shippingAddress?.phone}</p>
      <hr/>
      ${order.items?.map(item => `
        <div style="margin:16px 0;padding:12px;border:1px solid #eee;border-radius:8px">
          <h3>${item.productName}</h3>
          <p>Color: ${item.variant?.color} | Qty: ${item.quantity}</p>
          ${item.lens ? `
            <p><strong>Lens Type:</strong> ${item.lens?.powerType}</p>
            <p><strong>Package:</strong> ${item.lens?.package}</p>
            ${item.lens?.prescription?.rightEye ? `
              <table><tr><th>Eye</th><th>SPH</th><th>CYL</th><th>AXIS</th><th>ADD</th></tr>
              <tr><td>Right</td><td>${item.lens.prescription.rightEye.sph}</td><td>${item.lens.prescription.rightEye.cyl}</td><td>${item.lens.prescription.rightEye.axis}</td><td>${item.lens.prescription.rightEye.add}</td></tr>
              <tr><td>Left</td><td>${item.lens.prescription.leftEye.sph}</td><td>${item.lens.prescription.leftEye.cyl}</td><td>${item.lens.prescription.leftEye.axis}</td><td>${item.lens.prescription.leftEye.add}</td></tr>
              </table><p>PD: ${item.lens.prescription.pd}mm</p>
            ` : item.lens?.prescription?.callForPower ? '<p>⚠️ Call customer for power</p>' : '<p>📷 Prescription photo uploaded</p>'}
          ` : '<p>No lens</p>'}
        </div>
      `).join('')}
      <p style="margin-top:24px"><strong>Notes:</strong> ${order.labNotes || '—'}</p>
      <button class="noprint" onclick="window.print()">🖨️ Print</button>
      </body></html>
    `;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(sheet);
    win.document.close();
  };

  if (!user || user.role !== 'admin') return <div className="flex-center" style={{ minHeight: 500 }}><Link href="/" className="btn btn-primary">Go Home</Link></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <aside style={{ width: 240, background: 'var(--dark)', flexShrink: 0, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '0 8px 20px', borderBottom: '1px solid var(--border-dark)', marginBottom: 8 }}>
          <span style={{ fontSize: '1.25rem' }}>👓</span>
          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'white' }}>Lens Admin</div>
        </div>
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 6, fontSize: '0.875rem', color: item.href === '/admin/orders' ? 'var(--primary)' : 'var(--gray-light)', background: item.href === '/admin/orders' ? 'rgba(0,174,239,0.12)' : 'transparent', fontWeight: 500, transition: 'all 0.2s' }}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Order Management</h1>
            <p style={{ color: 'var(--gray-mid)', fontSize: '0.825rem' }}>{total} total orders</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input className="form-input" placeholder="Search order # or customer..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280, padding: '8px 14px' }} id="order-search" />
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px 14px' }} id="status-filter">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {filter && <button className="btn btn-outline btn-sm" onClick={() => setFilter('')}>Clear</button>}
        </div>

        {/* Orders Table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Prescription', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--gray-mid)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--gray-mid)' }}>Loading orders...</td></tr>
              ) : orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--off-white)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>{order.orderNumber}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{order.user?.name || order.shippingAddress?.fullName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-mid)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{order.items?.length} item(s)</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>₹{order.grandTotal?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}><span className={`badge badge-${STATUS_COLORS[order.status] || 'dark'}`}>{order.status}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    {order.prescriptionVerified ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>✅ Verified</span> : <span style={{ color: 'var(--warning)', fontWeight: 600 }}>⏳ Pending</span>}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--gray-mid)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelected(order); setNewStatus(order.status); }} id={`edit-order-${order._id}`}>Edit</button>
                      <button className="btn btn-dark btn-sm" onClick={() => printJobSheet(order)} id={`job-sheet-${order._id}`}>📄 Job Sheet</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status Update Modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 480 }}>
              <h3 style={{ marginBottom: 4 }}>Update Order {selected.orderNumber}</h3>
              <p style={{ color: 'var(--gray-mid)', fontSize: '0.875rem', marginBottom: 20 }}>Customer: {selected.user?.name}</p>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">New Status</label>
                <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)} id="new-status-select">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Note (optional)</label>
                <input className="form-input" value={statusNote} onChange={e => setStatusNote(e.target.value)} placeholder="Add a note for this status update" />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={updateStatus} id="update-status-btn">Update Status</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
