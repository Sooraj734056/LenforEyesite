'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { resolveMediaUrl } from '@/lib/media';
import toast from 'react-hot-toast';
import styles from './Navbar.module.css';

const categories = [
  { label: 'Men', href: '/products?gender=Men', icon: '👓' },
  { label: 'Women', href: '/products?gender=Women', icon: '👑' },
  { label: 'Kids', href: '/products?category=Kids', icon: '🌟' },
  { label: 'Computer Glasses', href: '/products?category=Computer+Glasses', icon: '💻' },
  { label: 'Reading Glasses', href: '/products?category=Reading+Glasses', icon: '📚' },
  { label: 'Contact Lenses', href: '/products?category=Contact+Lenses', icon: '👁️' },
  { label: 'Sunglasses', href: '/products?category=Sunglasses', icon: '🕶️' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getCount, isOpen, toggleCart, openCart } = useCartStore();
  const { user, logout, isAdmin } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryMenu, setCategoryMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const menuTimerRef = useRef(null);
  const userTimerRef = useRef(null);

  const searchRef = useRef();
  const debounceRef = useRef();
  const cartCount = getCount();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    clearTimeout(debounceRef.current);
    if (q.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search/suggestions?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        // The server route might need to select 'price' too, but let's see if it does
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (_) {}
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const isAdminUser = user?.role === 'admin';

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <img 
                src="/img/logo.png" 
                alt="Lens For Eyesight" 
                width="45" 
                height="45"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>LENS</span>
              <span className={styles.logoSub}>FOR EYESIGHT</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form className={`${styles.searchBar} ${mobileSearchOpen ? styles.mobileOpen : ''}`} onSubmit={handleSearchSubmit} ref={searchRef}>
            <div className={styles.searchInputWrap}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search frames, brands, shapes..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className={styles.searchInput}
                id="nav-search"
              />
              {searchQuery && (
                <button type="button" className={styles.clearSearch} onClick={() => { setSearchQuery(''); setSuggestions([]); }}>✕</button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map(s => (
                  <Link 
                    key={s._id} 
                    href={`/product/${s.slug || s._id}`} 
                    className={styles.suggestionItem}
                    onClick={() => { setShowSuggestions(false); setMobileSearchOpen(false); }}
                  >
                    <div className={styles.suggestionLeft}>
                      <img 
                        src={resolveMediaUrl(s.variants?.[0]?.images?.[0]) || '/img/placeholder.png'} 
                        alt={s.name} 
                      />
                      <div className={styles.suggestionInfo}>
                        <span className={styles.suggestionName}>{s.name}</span>
                        <span className={styles.suggestionBrand}>{s.brand}</span>
                      </div>
                    </div>
                    <span className={styles.suggestionPrice}>₹{s.price || '...'}</span>
                  </Link>
                ))}
                <button 
                  className={styles.seeAllSearch}
                  onClick={() => router.push(`/products?search=${encodeURIComponent(searchQuery)}`)}
                >
                  See all results for "{searchQuery}"
                </button>
              </div>
            )}
          </form>

          {/* Nav Actions */}
          <div className={styles.navActions}>
            {/* Categories Dropdown */}
            <div 
              className={styles.dropdown} 
              onMouseEnter={() => {
                clearTimeout(menuTimerRef.current);
                setCategoryMenu(true);
              }} 
              onMouseLeave={() => {
                menuTimerRef.current = setTimeout(() => setCategoryMenu(false), 200);
              }}
            >
              <button className={styles.navBtn} id="category-menu-btn">
                Categories
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {categoryMenu && (
                <div className={styles.dropdownMenu}>
                  {categories.map(cat => (
                    <Link key={cat.href} href={cat.href} className={styles.dropdownItem}>
                      <span>{cat.icon}</span> {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/contact#appointment" className={`${styles.navBtn} ${styles.appointmentBtn}`}>
              📅 Eye Test
            </Link>

            {/* Wishlist */}
            <button 
              className={styles.mobileSearchBtn} 
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            <Link href="/account/wishlist" className={styles.iconBtn} title="Wishlist" id="nav-wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </Link>

            {/* Cart */}
            <button className={styles.iconBtn} onClick={toggleCart} id="nav-cart" title="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {mounted && cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>

            {/* User Menu */}
            {mounted && user ? (
              <div 
                className={styles.dropdown} 
                onMouseEnter={() => {
                  clearTimeout(userTimerRef.current);
                  setUserMenuOpen(true);
                }} 
                onMouseLeave={() => {
                  userTimerRef.current = setTimeout(() => setUserMenuOpen(false), 200);
                }}
              >
                <button className={styles.userBtn} id="user-menu-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <div className={styles.userAvatar}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className={styles.dropdownMenu} style={{ right: 0, left: 'auto' }}>
                    <Link href="/account" className={styles.dropdownItem}>👤 My Account</Link>
                    <Link href="/account/orders" className={styles.dropdownItem}>📦 My Orders</Link>
                    <Link href="/account/prescriptions" className={styles.dropdownItem}>📋 Prescriptions</Link>
                    {isAdminUser && <Link href="/admin" className={styles.dropdownItem}>⚙️ Admin Panel</Link>}
                    <hr style={{ margin: '4px 0', borderColor: '#eee' }} />
                    <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary btn-sm" id="nav-login">Login</Link>
            )}

            {/* Mobile Hamburger */}
            <button className={styles.hamburger} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} id="mobile-menu-btn">
              <span className={`${styles.ham} ${mobileMenuOpen ? styles.hamOpen : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && mounted && (
          <div className={styles.mobileMenu}>
            <form className={styles.mobileSearch} onSubmit={handleSearchSubmit}>
              <input
                type="text" placeholder="Search eyewear..."
                value={searchQuery} onChange={handleSearch}
                className="form-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">Go</button>
            </form>
            <div className={styles.mobileLinks}>
              {categories.map(cat => (
                <Link key={cat.href} href={cat.href} className={styles.mobileLink}>
                  {cat.icon} {cat.label}
                </Link>
              ))}
              <Link href="/contact#appointment" className={styles.mobileLink}>📅 Book Eye Test</Link>
              <Link href="/account/wishlist" className={styles.mobileLink}>❤️ My Wishlist</Link>
              {user ? (
                <>
                  <Link href="/account" className={styles.mobileLink}>👤 My Account</Link>
                  <Link href="/account/orders" className={styles.mobileLink}>📦 Orders</Link>
                  {isAdminUser && <Link href="/admin" className={styles.mobileLink}>⚙️ Admin</Link>}
                  <button onClick={handleLogout} className={styles.mobileLink}>🚪 Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.mobileLink}>Login</Link>
                  <Link href="/register" className={styles.mobileLink}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
