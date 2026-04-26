'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { resolveMediaUrl } from '@/lib/media';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiLayout, FiBox, FiShoppingBag, FiCalendar, FiTarget, FiArrowLeft, 
  FiPlus, FiTrash2, FiTag, FiImage, FiExternalLink, FiPercent 
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

export default function MarketingPage() {
  const { user, token } = useAuthStore();
  const [banners, setBanners] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountType: 'percentage', discountValue: 0, minOrderAmount: 0, expiryDate: '' });
  
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', imageUrl: '', link: '/products', position: 'hero', isActive: true });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bData, cData] = await Promise.all([
        axios.get(`${API}/banners/admin`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/coupons`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBanners(bData.data.banners || []);
      setCoupons(cData.data.coupons || []);
    } catch (_) {
      toast.error('Failed to fetch marketing data');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/coupons`, newCoupon, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Coupon created');
      setShowCouponModal(false);
      fetchData();
    } catch (_) {
      toast.error('Failed to create coupon');
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/banners`, newBanner, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Banner created');
      setShowBannerModal(false);
      setNewBanner({ title: '', subtitle: '', imageUrl: '', link: '/products', position: 'hero', isActive: true });
      fetchData();
    } catch (_) {
      toast.error('Failed to create banner');
    }
  };

  const deleteBanner = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await axios.delete(`${API}/banners/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Banner deleted');
      fetchData();
    } catch (_) {
      toast.error('Failed to delete banner');
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`${API}/coupons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Coupon deleted');
      fetchData();
    } catch (_) {
      toast.error('Failed to delete coupon');
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
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${item.href === '/admin/marketing' ? styles.navActive : ''}`}>
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
            <h1 className={styles.pageTitle}>Marketing</h1>
            <p className={styles.pageDate}>Manage promotions & visuals</p>
          </div>
        </div>

        <div style={{ padding: '32px 40px' }}>
          {/* Coupons Section */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiTag style={{ color: 'var(--primary)' }} /> Discount Coupons
              </h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowCouponModal(true)}>
                <FiPlus /> Create Coupon
              </button>
            </div>

            <div className={styles.tableCard} style={{ padding: 0, overflow: 'hidden' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No coupons found</td></tr>
                  ) : coupons.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>{c.code}</td>
                      <td>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FiPercent size={14} /> {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                        </div>
                      </td>
                      <td className={styles.amount}>₹{c.minOrderAmount}</td>
                      <td>{new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <span className={`badge badge-${c.isActive ? 'success' : 'dark'}`}>
                          {c.isActive ? 'Active' : 'Expired/Disabled'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => deleteCoupon(c._id)} style={{ color: '#e11d48' }}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Banners Section */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiImage style={{ color: 'var(--primary)' }} /> Homepage Banners
              </h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowBannerModal(true)}>
                <FiPlus /> Add Banner
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {banners.map(b => (
                <div key={b._id} className={styles.tableCard} style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 180, position: 'relative', background: '#f1f5f9' }}>
                    <img 
                      src={resolveMediaUrl(b.imageUrl)} 
                      alt={b.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span className={`badge badge-${b.isActive ? 'success' : 'dark'}`} style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        {b.isActive ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>{b.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>{b.subtitle}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiExternalLink /> {b.link}
                      </span>
                      <button className="btn btn-outline btn-sm" onClick={() => deleteBanner(b._id)} style={{ color: '#e11d48' }}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Coupon Modal */}
        {showCouponModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: 32, width: '100%', maxWidth: 480 }}>
              <h3 style={{ marginBottom: 24, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Create Coupon</h3>
              <form onSubmit={handleCreateCoupon}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Code (Uppercase)</label>
                  <input className="form-input" required value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="SAVE50" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={newCoupon.discountType} onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input className="form-input" type="number" required value={newCoupon.discountValue} onChange={e => setNewCoupon({...newCoupon, discountValue: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div className="form-group">
                    <label className="form-label">Min Order (₹)</label>
                    <input className="form-input" type="number" value={newCoupon.minOrderAmount} onChange={e => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input className="form-input" type="date" required value={newCoupon.expiryDate} onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCouponModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Create Coupon</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Banner Modal */}
        {showBannerModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: 32, width: '100%', maxWidth: 520 }}>
              <h3 style={{ marginBottom: 24, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>New Banner</h3>
              <form onSubmit={handleCreateBanner}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Title</label>
                  <input className="form-input" required value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} placeholder="Mega Sale 2024" />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Subtitle</label>
                  <input className="form-input" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} placeholder="Flat 40% Off on Sunglasses" />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Image URL</label>
                  <input className="form-input" required value={newBanner.imageUrl} onChange={e => setNewBanner({...newBanner, imageUrl: e.target.value})} placeholder="Paste image link here..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div className="form-group">
                    <label className="form-label">Click Link</label>
                    <input className="form-input" value={newBanner.link} onChange={e => setNewBanner({...newBanner, link: e.target.value})} placeholder="/products" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Placement</label>
                    <select className="form-select" value={newBanner.position} onChange={e => setNewBanner({...newBanner, position: e.target.value})}>
                      <option value="hero">Hero Slider (Main)</option>
                      <option value="banner_bottom">Mid Section Banner</option>
                      <option value="popup">Promotion Popup</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowBannerModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Launch Banner</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
