'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiLayout, FiBox, FiShoppingBag, FiCalendar, FiTarget, FiArrowLeft, 
  FiSearch, FiPrinter, FiEdit3, FiCheckCircle, FiClock, FiChevronRight 
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
  const STATUS_COLORS = { 
    'Payment Received': 'warning', 
    'Prescription Verified': 'primary', 
    'Lab Processing': 'primary', 
    'Quality Check': 'primary', 
    'Shipped': 'success', 
    'Delivered': 'success', 
    'Cancelled': 'error' 
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('status', filter);
      if (search) params.set('search', search);
      const { data } = await axios.get(`${API}/orders?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(data.orders || []); 
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    }
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

  const exportOrders = () => {
    if (orders.length === 0) return toast.error('No orders to export');
    
    const headers = ['Order Number', 'Customer Name', 'Email', 'Items', 'Total', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.user?.name || o.shippingAddress?.fullName,
      o.user?.email || 'N/A',
      o.items?.length,
      o.grandTotal,
      o.status,
      new Date(o.createdAt).toLocaleDateString('en-IN')
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_report_${new Date().toISOString().split('T')[0]}.csv`);
    
    // Safety check for document.body
    if (document.body) {
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 100);
    }
    toast.success('Report downloaded!');
  };

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
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${item.href === '/admin/orders' ? styles.navActive : ''}`}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div>
              <h1 className={styles.pageTitle}>Orders</h1>
              <p className={styles.pageDate}>{total} total orders found</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={exportOrders} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPrinter /> Download Report (CSV)
            </button>
          </div>
        </div>

        <div style={{ padding: '32px 40px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
              <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                className="form-input" 
                placeholder="Search order or customer..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ paddingLeft: 42 }} 
              />
            </div>
            <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 220 }}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {filter && <button className="btn btn-outline btn-sm" onClick={() => setFilter('')}>Clear</button>}
          </div>

          {/* Orders Table */}
          <div className={styles.tableCard} style={{ padding: 0, overflow: 'hidden' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Prescription</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id}>
                    <td className={styles.orderLink}>{order.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.user?.name || order.shippingAddress?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.user?.email || order.shippingAddress?.phone}</div>
                    </td>
                    <td>{order.items?.length} items</td>
                    <td className={styles.amount}>₹{order.grandTotal?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge badge-${STATUS_COLORS[order.status] || 'dark'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.prescriptionVerified ? 
                        <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><FiCheckCircle /> Verified</span> : 
                        <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><FiClock /> Pending</span>
                      }
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => { setSelected(order); setNewStatus(order.status); }} title="Update Status"><FiEdit3 /></button>
                        <button className="btn btn-dark btn-sm" onClick={() => printJobSheet(order)} title="Print Job Sheet"><FiPrinter /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Update Modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: 4, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Update Order</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 24 }}>Order ID: {selected.orderNumber}</p>
              
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">New Status</label>
                <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Note (optional)</label>
                <input 
                  className="form-input" 
                  value={statusNote} 
                  onChange={e => setStatusNote(e.target.value)} 
                  placeholder="Add a note for this status update" 
                />
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setSelected(null)} style={{ flex: 1 }}>Cancel</button>
                <button className="btn btn-primary" onClick={updateStatus} style={{ flex: 2 }}>Update Status</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
