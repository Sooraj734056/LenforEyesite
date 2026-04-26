'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiLayout, FiBox, FiShoppingBag, FiCalendar, FiTarget, FiArrowLeft, 
  FiSearch, FiPlus, FiUpload, FiEdit, FiTrash2, FiTag, FiStar, FiZap 
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

const EMPTY_PRODUCT = {
  name: '', brand: 'Vincent Chase', category: 'Eyeglasses', gender: 'Unisex',
  price: '', comparePrice: '', discount: '', frameShape: 'Round',
  frameMaterial: 'TR90', frameWidth: 'Medium', description: '',
  isFeatured: false, isNewArrival: false, isBestseller: false, lensCompatible: true,
  variants: [{ color: 'Black', colorHex: '#000000', stock: 0, sku: '' }],
  features: [''],
};

export default function AdminProductsPage() {
  const { user, token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '?limit=50';
      const { data } = await axios.get(`${API}/products${params}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(data.products || []);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { if (token) fetchProducts(); }, [token, search]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), comparePrice: Number(form.comparePrice) || undefined };
      if (editId) {
        await axios.put(`${API}/products/${editId}`, body, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Product updated!');
      } else {
        const formData = new FormData();
        formData.append('data', JSON.stringify(body));
        await axios.post(`${API}/products`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }
      setShowForm(false); setEditId(null); setForm(EMPTY_PRODUCT);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Product deleted');
      fetchProducts();
    } catch (_) { toast.error('Delete failed'); }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    const formData = new FormData();
    formData.append('csv', csvFile);
    try {
      const { data } = await axios.post(`${API}/products/bulk-upload`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(data.message);
      fetchProducts();
      setCsvFile(null);
    } catch (err) { toast.error('CSV upload failed'); }
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
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${item.href === '/admin/products' ? styles.navActive : ''}`}>
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
            <h1 className={styles.pageTitle}>Products</h1>
            <p className={styles.pageDate}>{products.length} items cataloged</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} style={{ display: 'none' }} id="csv-input" />
            <label htmlFor="csv-input" className="btn btn-outline" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiUpload /> Import CSV
            </label>
            {csvFile && <button className="btn btn-dark" onClick={handleCsvUpload}>Upload {csvFile.name}</button>}
            <button className="btn btn-primary" onClick={() => { setForm(EMPTY_PRODUCT); setEditId(null); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPlus /> Add Product
            </button>
          </div>
        </div>

        <div style={{ padding: '32px 40px' }}>
          <div style={{ position: 'relative', maxWidth: 400, marginBottom: 24 }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              className="form-input" 
              placeholder="Search products by name or brand..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ paddingLeft: 42 }} 
            />
          </div>

          <div className={styles.tableCard} style={{ padding: 0, overflow: 'hidden' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading products...</td></tr>
                ) : products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.frameShape} · {p.frameMaterial}</div>
                    </td>
                    <td>{p.brand}</td>
                    <td><span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 6, fontSize: '0.8rem' }}>{p.category}</span></td>
                    <td className={styles.amount}>
                      ₹{p.price?.toLocaleString('en-IN')}
                      {p.comparePrice && <div style={{ fontSize: '0.7rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 400 }}>₹{p.comparePrice?.toLocaleString('en-IN')}</div>}
                    </td>
                    <td>
                      {p.variants?.map(v => (
                        <div key={v.color} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.colorHex }}></span>
                          <span style={{ color: v.stock <= 5 ? '#e11d48' : '#64748b', fontWeight: v.stock <= 5 ? 700 : 400 }}>{v.color}: {v.stock}</span>
                        </div>
                      ))}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.isFeatured && <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700 }}>FEATURED</span>}
                        {p.isNewArrival && <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700 }}>NEW</span>}
                        {p.isBestseller && <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700 }}>BESTSELLER</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => { setForm({ ...EMPTY_PRODUCT, ...p }); setEditId(p._id); setShowForm(true); }}><FiEdit /></button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleDelete(p._id, p.name)} style={{ color: '#e11d48', borderColor: '#fecdd3' }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: 32, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: 24, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{editId ? 'Edit Product' : 'Add New Product'}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Product Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter product name" />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <select className="form-select" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}>
                    {['Ray-Ban','Zeiss','Crizal','Vogue','Fastrack','Vincent Chase','John Jacobs','Lenskart'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {['Eyeglasses','Sunglasses','Computer Glasses','Reading Glasses','Contact Lenses','Kids'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input className="form-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Compare Price (₹)</label>
                  <input className="form-input" type="number" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 24, padding: '12px 0' }}>
                  {[['isFeatured','Featured', <FiStar/>], ['isNewArrival','New', <FiPlus/>], ['isBestseller','Bestseller', <FiZap/>]].map(([key, label, icon]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                      <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                      {icon} {label}
                    </label>
                  ))}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiTag /> Variants & Stock
                  </div>
                  {form.variants.map((v, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px 1fr auto', gap: 12, marginBottom: 12 }}>
                      <input className="form-input" placeholder="Color" value={v.color} onChange={e => { const vs = [...form.variants]; vs[i].color = e.target.value; setForm(f => ({ ...f, variants: vs })); }} />
                      <input type="color" value={v.colorHex} onChange={e => { const vs = [...form.variants]; vs[i].colorHex = e.target.value; setForm(f => ({ ...f, variants: vs })); }} style={{ height: 42, width: '100%', padding: 2, borderRadius: 8, cursor: 'pointer' }} />
                      <input className="form-input" type="number" placeholder="Stock" value={v.stock} onChange={e => { const vs = [...form.variants]; vs[i].stock = Number(e.target.value); setForm(f => ({ ...f, variants: vs })); }} />
                      <input className="form-input" placeholder="SKU" value={v.sku} onChange={e => { const vs = [...form.variants]; vs[i].sku = e.target.value; setForm(f => ({ ...f, variants: vs })); }} />
                      {form.variants.length > 1 && (
                        <button className="btn btn-outline btn-sm" onClick={() => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))} style={{ color: '#e11d48' }}>×</button>
                      )}
                    </div>
                  ))}
                  <button className="btn btn-outline btn-sm" onClick={() => setForm(f => ({ ...f, variants: [...f.variants, { color: '', colorHex: '#000000', stock: 0, sku: '' }] }))}>+ Add Color Variant</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button className="btn btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1 }}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
                  {saving ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
