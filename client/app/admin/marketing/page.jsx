'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { resolveMediaUrl } from '@/lib/media';
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

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <aside style={{ width: 240, background: 'var(--dark)', flexShrink: 0, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '0 8px 20px', borderBottom: '1px solid var(--border-dark)', marginBottom: 8 }}>
          <span>👓</span><div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'white' }}>Lens Admin</div>
        </div>
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 6, fontSize: '0.875rem', color: item.href === '/admin/marketing' ? 'var(--primary)' : 'var(--gray-light)', background: item.href === '/admin/marketing' ? 'rgba(0,174,239,0.12)' : 'transparent', fontWeight: 500 }}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Marketing & Promotions</h1>
            <p style={{ color: 'var(--gray-mid)', fontSize: '0.825rem' }}>Manage coupons and homepage banners</p>
          </div>
        </div>

        {/* Coupons Section */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Discount Coupons</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowCouponModal(true)}>+ Create Coupon</button>
          </div>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
              <thead style={{ background: 'var(--off-white)' }}>
                <tr>
                  {['Code', 'Discount', 'Min Order', 'Expiry', 'Active', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--gray-mid)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>No coupons found</td></tr>
                ) : coupons.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--off-white)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>{c.code}</td>
                    <td style={{ padding: '12px 16px' }}>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                    <td style={{ padding: '12px 16px' }}>₹{c.minOrderAmount}</td>
                    <td style={{ padding: '12px 16px' }}>{new Date(c.expiryDate).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>{c.isActive ? '✅' : '❌'}</td>
                    <td style={{ padding: '12px 16px' }}><button className="btn btn-outline btn-sm">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Banners Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Homepage Banners</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowBannerModal(true)}>+ Add Banner</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {banners.map(b => (
              <div key={b._id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ height: 160, background: 'var(--off-white)', position: 'relative' }}>
                  <img src={resolveMediaUrl(b.imageUrl)} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>{b.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-mid)', marginBottom: 12 }}>{b.subtitle}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge badge-${b.isActive ? 'success' : 'dark'}`}>{b.isActive ? 'Active' : 'Hidden'}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => deleteBanner(b._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coupon Modal */}
        {showCouponModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 480 }}>
              <h3 style={{ marginBottom: 20 }}>Create New Coupon</h3>
              <form onSubmit={handleCreateCoupon}>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Coupon Code</label>
                  <input className="form-input" required value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="SAVE20" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={newCoupon.discountType} onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})}>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input className="form-input" type="number" required value={newCoupon.discountValue} onChange={e => setNewCoupon({...newCoupon, discountValue: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                  <div className="form-group">
                    <label className="form-label">Min Order</label>
                    <input className="form-input" type="number" value={newCoupon.minOrderAmount} onChange={e => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input className="form-input" type="date" required value={newCoupon.expiryDate} onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCouponModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Coupon</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Banner Modal */}
        {showBannerModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 480 }}>
              <h3 style={{ marginBottom: 20 }}>Add New Banner</h3>
              <form onSubmit={handleCreateBanner}>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Title</label>
                  <input className="form-input" required value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} placeholder="New Season Offer" />
                </div>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Subtitle</label>
                  <input className="form-input" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} placeholder="Up to 50% Off" />
                </div>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Image URL</label>
                  <input className="form-input" required value={newBanner.imageUrl} onChange={e => setNewBanner({...newBanner, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                  <div className="form-group">
                    <label className="form-label">Link</label>
                    <input className="form-input" value={newBanner.link} onChange={e => setNewBanner({...newBanner, link: e.target.value})} placeholder="/products" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Position</label>
                    <select className="form-select" value={newBanner.position} onChange={e => setNewBanner({...newBanner, position: e.target.value})}>
                      <option value="hero">Hero Slider</option>
                      <option value="banner_bottom">Bottom Banner</option>
                      <option value="popup">Popup</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowBannerModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Banner</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
