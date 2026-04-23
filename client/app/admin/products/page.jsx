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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <aside style={{ width: 240, background: 'var(--dark)', flexShrink: 0, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '0 8px 20px', borderBottom: '1px solid var(--border-dark)', marginBottom: 8 }}>
          <span>👓</span><div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'white' }}>Lens Admin</div>
        </div>
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 6, fontSize: '0.875rem', color: item.href === '/admin/products' ? 'var(--primary)' : 'var(--gray-light)', background: item.href === '/admin/products' ? 'rgba(0,174,239,0.12)' : 'transparent', fontWeight: 500 }}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Product Management ({products.length})</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} style={{ display: 'none' }} id="csv-input" />
            <label htmlFor="csv-input" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>📥 Import CSV</label>
            {csvFile && <button className="btn btn-dark btn-sm" onClick={handleCsvUpload}>Upload {csvFile.name}</button>}
            <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY_PRODUCT); setEditId(null); setShowForm(true); }} id="add-product-link">+ Add Product</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input className="form-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300, padding: '8px 14px' }} id="product-search" />
        </div>

        {/* Products Table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead style={{ background: 'var(--off-white)' }}>
              <tr>
                {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Flags', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--gray-mid)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-mid)' }}>Loading...</td></tr>
              ) : products.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--off-white)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-mid)' }}>{p.frameShape} · {p.frameMaterial}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{p.brand}</td>
                  <td style={{ padding: '12px 16px' }}>{p.category}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                    ₹{p.price?.toLocaleString('en-IN')}
                    {p.comparePrice && <div style={{ fontSize: '0.7rem', color: 'var(--gray-light)', textDecoration: 'line-through' }}>₹{p.comparePrice?.toLocaleString('en-IN')}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.variants?.map(v => <div key={v.color} style={{ fontSize: '0.72rem', color: v.stock <= 5 ? 'var(--error)' : 'var(--success)' }}>{v.color}: {v.stock}</div>)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.isFeatured && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Featured</span>}
                      {p.isNewArrival && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>New</span>}
                      {p.isBestseller && <span className="badge badge-warning" style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.12)', color: 'var(--warning)' }}>Bestseller</span>}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setForm({ ...EMPTY_PRODUCT, ...p }); setEditId(p._id); setShowForm(true); }} id={`edit-${p._id}`}>Edit</button>
                      <button onClick={() => handleDelete(p._id, p.name)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' }} id={`delete-${p._id}`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: 20 }}>{editId ? 'Edit Product' : 'Add New Product'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full product name" id="prod-name" />
                </div>
                {[['brand', 'Brand', ['Ray-Ban','Zeiss','Crizal','Vogue','Fastrack','Vincent Chase','John Jacobs','Lenskart']],
                  ['category', 'Category', ['Eyeglasses','Sunglasses','Computer Glasses','Reading Glasses','Contact Lenses','Kids']],
                  ['gender', 'Gender', ['Men','Women','Kids','Unisex']],
                  ['frameShape', 'Frame Shape', ['Round','Square','Rectangle','Cat-Eye','Aviator','Wayfarer','Oval']],
                  ['frameMaterial', 'Material', ['Acetate','TR90','Metal','Titanium']],
                  ['frameWidth', 'Width', ['Narrow','Medium','Wide']],
                ].map(([key, label, opts]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <select className="form-select" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} id={`prod-${key}`}>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} id="prod-price" />
                </div>
                <div className="form-group">
                  <label className="form-label">Compare Price (₹)</label>
                  <input className="form-input" type="number" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} placeholder="Original MRP" id="prod-compare" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} id="prod-desc" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1', display: 'flex', gap: 20 }}>
                  {[['isFeatured','Featured'],['isNewArrival','New Arrival'],['isBestseller','Bestseller'],['lensCompatible','Lens Compatible']].map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>
                      <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: 'var(--primary)' }} id={`prod-${key}`} />
                      {label}
                    </label>
                  ))}
                </div>
                {/* Variant */}
                <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 8 }}>Variants</div>
                  {form.variants.map((v, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 1fr', gap: 8, marginBottom: 8 }}>
                      <input className="form-input" value={v.color} placeholder="Color name" onChange={e => { const vs = [...form.variants]; vs[i].color = e.target.value; setForm(f => ({ ...f, variants: vs })); }} />
                      <input type="color" value={v.colorHex} onChange={e => { const vs = [...form.variants]; vs[i].colorHex = e.target.value; setForm(f => ({ ...f, variants: vs })); }} style={{ height: 42, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }} />
                      <input className="form-input" type="number" value={v.stock} placeholder="Stock" onChange={e => { const vs = [...form.variants]; vs[i].stock = Number(e.target.value); setForm(f => ({ ...f, variants: vs })); }} />
                      <input className="form-input" value={v.sku} placeholder="SKU (optional)" onChange={e => { const vs = [...form.variants]; vs[i].sku = e.target.value; setForm(f => ({ ...f, variants: vs })); }} />
                    </div>
                  ))}
                  <button className="btn btn-outline btn-sm" onClick={() => setForm(f => ({ ...f, variants: [...f.variants, { color: '', colorHex: '#000000', stock: 0, sku: '' }] }))}>+ Add Variant</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving} id="save-product-btn">
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
