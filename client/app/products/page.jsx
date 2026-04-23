'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import styles from './page.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const SHAPES = ['Round', 'Square', 'Rectangle', 'Cat-Eye', 'Aviator', 'Wayfarer', 'Oval'];
const MATERIALS = ['Acetate', 'TR90', 'Metal', 'Titanium'];
const WIDTHS = ['Narrow', 'Medium', 'Wide'];
const CATEGORIES = ['Eyeglasses', 'Sunglasses', 'Computer Glasses', 'Reading Glasses', 'Contact Lenses', 'Kids'];
const GENDERS = ['Men', 'Women', 'Kids', 'Unisex'];
const BRANDS = ['Ray-Ban', 'Zeiss', 'Crizal', 'Vogue', 'Fastrack', 'Vincent Chase', 'John Jacobs', 'Lenskart'];

function PLPContent() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    brand: searchParams.getAll('brand') || [],
    frameShape: [],
    frameMaterial: [],
    frameWidth: '',
    minPrice: '',
    maxPrice: '',
    search: searchParams.get('search') || '',
    newArrival: searchParams.get('newArrival') || '',
    bestseller: searchParams.get('bestseller') || '',
    featured: searchParams.get('featured') || '',
  });

  const fetchProducts = async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (Array.isArray(v)) { if (v.length) params.set(k, v.join(',')); }
        else if (v) params.set(k, v);
      });
      params.set('sort', sort);
      params.set('page', pg);
      params.set('limit', 12);
      
      const res = await fetch(`${API}/products?${params}`);
      const data = await res.json();
      if (pg === 1) setProducts(data.products || []);
      else setProducts(prev => [...prev, ...(data.products || [])]);
      setTotal(data.pagination?.total || 0);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { setPage(1); fetchProducts(1); }, [filters, sort]);

  const toggleMulti = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter(x => x !== val)
        : [...f[key], val]
    }));
  };
  
  const setSingle = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val }));

  const clearFilters = () => setFilters({
    category: '', gender: '', brand: [], frameShape: [],
    frameMaterial: [], frameWidth: '', minPrice: '', maxPrice: '',
    search: '', newArrival: '', bestseller: '', featured: ''
  });

  const hasFilters = Object.entries(filters).some(([k, v]) =>
    k !== 'search' && (Array.isArray(v) ? v.length > 0 : v !== '')
  );

  const FilterPanel = () => (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>Filters</h3>
        {hasFilters && <button className={styles.clearBtn} onClick={clearFilters}>Clear All</button>}
      </div>

      {/* Category */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Category</h4>
        {CATEGORIES.map(c => (
          <label key={c} className={styles.checkLabel}>
            <input type="radio" name="category" checked={filters.category === c}
              onChange={() => setSingle('category', c)} className={styles.check} />
            {c}
          </label>
        ))}
      </div>

      {/* Gender */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Gender</h4>
        <div className={styles.pillGroup}>
          {GENDERS.map(g => (
            <button key={g} className={`${styles.pill} ${filters.gender === g ? styles.pillActive : ''}`}
              onClick={() => setSingle('gender', g)}>{g}</button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Brand</h4>
        {BRANDS.map(b => (
          <label key={b} className={styles.checkLabel}>
            <input type="checkbox" checked={filters.brand.includes(b)}
              onChange={() => toggleMulti('brand', b)} className={styles.check} />
            {b}
          </label>
        ))}
      </div>

      {/* Frame Shape */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Frame Shape</h4>
        <div className={styles.pillGroup}>
          {SHAPES.map(s => (
            <button key={s} className={`${styles.pill} ${filters.frameShape.includes(s) ? styles.pillActive : ''}`}
              onClick={() => toggleMulti('frameShape', s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Material</h4>
        <div className={styles.pillGroup}>
          {MATERIALS.map(m => (
            <button key={m} className={`${styles.pill} ${filters.frameMaterial.includes(m) ? styles.pillActive : ''}`}
              onClick={() => toggleMulti('frameMaterial', m)}>{m}</button>
          ))}
        </div>
      </div>

      {/* Frame Width */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Frame Width</h4>
        <div className={styles.pillGroup}>
          {WIDTHS.map(w => (
            <button key={w} className={`${styles.pill} ${filters.frameWidth === w ? styles.pillActive : ''}`}
              onClick={() => setSingle('frameWidth', w)}>{w}</button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Price Range (₹)</h4>
        <div className={styles.priceInputs}>
          <input type="number" placeholder="Min" value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="form-input" style={{ fontSize: '0.85rem', padding: '8px 12px' }} />
          <span>—</span>
          <input type="number" placeholder="Max" value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="form-input" style={{ fontSize: '0.85rem', padding: '8px 12px' }} />
        </div>
        <div className={styles.pricePresets}>
          {[['Under ₹1000', '', '1000'], ['₹1000-2500', '1000', '2500'], ['₹2500-5000', '2500', '5000'], ['₹5000+', '5000', '']].map(([label, min, max]) => (
            <button key={label} className={styles.pricePreset}
              onClick={() => setFilters(f => ({ ...f, minPrice: min, maxPrice: max }))}>{label}</button>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className={styles.plpLayout}>
      {/* Desktop Sidebar */}
      <div className={styles.desktopSidebar}>
        <FilterPanel />
      </div>

      {/* Mobile Filter Button */}
      <button className={styles.mobileFilterBtn} onClick={() => setMobileFilterOpen(true)} id="mobile-filter-btn">
        🔧 Filters {hasFilters && `(${Object.values(filters).flat().filter(Boolean).length})`}
      </button>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className={styles.mobileFilterOverlay}>
          <div className={styles.mobileFilterDrawer}>
            <div className={styles.mobileFilterHeader}>
              <h3>Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className={styles.closeFilter}>✕</button>
            </div>
            <div className={styles.mobileFilterContent}>
              <FilterPanel />
            </div>
            <button className="btn btn-primary" onClick={() => setMobileFilterOpen(false)} style={{ margin: '16px', width: 'calc(100% - 32px)' }}>
              Show {total} Results
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className={styles.productArea}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.resultCount}>
            {loading ? 'Loading...' : `${total.toLocaleString()} products found`}
            {filters.search && <span className={styles.searchQuery}> for "{filters.search}"</span>}
          </div>
          <div className={styles.sortWrap}>
            <label className={styles.sortLabel}>Sort by:</label>
            <select value={sort} onChange={e => setSort(e.target.value)} className={styles.sortSelect} id="sort-select">
              <option value="popular">Popularity</option>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasFilters && (
          <div className={styles.activeFilters}>
            {filters.category && <span className={styles.activeTag}>{filters.category} <button onClick={() => setSingle('category', filters.category)}>✕</button></span>}
            {filters.gender && <span className={styles.activeTag}>{filters.gender} <button onClick={() => setSingle('gender', filters.gender)}>✕</button></span>}
            {filters.brand.map(b => <span key={b} className={styles.activeTag}>{b} <button onClick={() => toggleMulti('brand', b)}>✕</button></span>)}
            {filters.frameShape.map(s => <span key={s} className={styles.activeTag}>{s} <button onClick={() => toggleMulti('frameShape', s)}>✕</button></span>)}
          </div>
        )}

        {/* Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-auto">
            {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 360 }} />)}
          </div>
        ) : products.length === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-auto">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            {products.length < total && (
              <div className={styles.loadMore}>
                <button
                  className="btn btn-outline"
                  onClick={() => { setPage(p => { fetchProducts(p + 1); return p + 1; }); }}
                  disabled={loading}
                  id="load-more-btn"
                >
                  {loading ? 'Loading...' : `Load More (${total - products.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <CartDrawer />
      <div className="container">
        <div className={styles.plpHeader}>
          <h1>Shop Eyewear</h1>
          <p>Discover our curated collection of premium eyewear</p>
        </div>
        <Suspense fallback={<div className="flex-center" style={{ minHeight: 400 }}><div className="spinner" /></div>}>
          <PLPContent />
        </Suspense>
      </div>
    </>
  );
}
