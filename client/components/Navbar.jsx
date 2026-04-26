'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { resolveMediaUrl } from '@/lib/media';
import toast from 'react-hot-toast';
import { 
  FaGlasses, FaCrown, FaStar, FaLaptop, FaBook, FaEye, FaCalendarAlt, 
  FaHeart, FaUser, FaBox, FaClipboardList, FaUserShield, FaSignOutAlt, FaSearch
} from 'react-icons/fa';
import { FiMenu, FiX, FiShoppingBag, FiSearch, FiUser, FiHeart } from 'react-icons/fi';
import styles from './Navbar.module.css';

const categories = [
  { label: 'Men', href: '/products?gender=Men', icon: <FaGlasses /> },
  { label: 'Women', href: '/products?gender=Women', icon: <FaCrown /> },
  { label: 'Kids', href: '/products?category=Kids', icon: <FaStar /> },
  { label: 'Computer Glasses', href: '/products?category=Computer+Glasses', icon: <FaLaptop /> },
  { label: 'Reading Glasses', href: '/products?category=Reading+Glasses', icon: <FaBook /> },
  { label: 'Contact Lenses', href: '/products?category=Contact+Lenses', icon: <FaEye /> },
  { label: 'Sunglasses', href: '/products?category=Sunglasses', icon: <FaGlasses /> },
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setCategoryMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    clearTimeout(debounceRef.current);
    if (q.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search/suggestions?q=${encodeURIComponent(q)}`);
        const data = await res.json();
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
      setMobileSearchOpen(false);
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
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled + ' glass' : ''}`}>
        <div className={styles.navInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <motion.img 
                whileHover={{ scale: 1.1, rotate: 5 }}
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
              <FiSearch className={styles.searchIcon} />
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
              <AnimatePresence>
                {searchQuery && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    type="button" 
                    className={styles.clearSearch} 
                    onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                  >✕</motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`${styles.suggestions} glass`}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
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
              <button className={`${styles.navBtn} ${categoryMenu ? styles.active : ''}`} id="category-menu-btn">
                Categories
                <motion.svg 
                  animate={{ rotate: categoryMenu ? 180 : 0 }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </motion.svg>
              </button>
              <AnimatePresence>
                {categoryMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className={`${styles.dropdownMenu} glass`}
                  >
                    {categories.map(cat => (
                      <Link key={cat.href} href={cat.href} className={styles.dropdownItem}>
                        <span className={styles.dropIcon}>{cat.icon}</span> {cat.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/contact#appointment" className={`${styles.navBtn} ${styles.appointmentBtn}`}>
              <FaCalendarAlt /> <span>Eye Test</span>
            </Link>

            {/* Wishlist */}
            <button 
              className={styles.mobileSearchBtn} 
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle Search"
            >
              <FiSearch size={22} />
            </button>

            <Link href="/account/wishlist" className={styles.iconBtn} title="Wishlist" id="nav-wishlist">
              <FiHeart size={22} />
            </Link>

            {/* Cart */}
            <button className={styles.iconBtn} onClick={toggleCart} id="nav-cart" title="Cart">
              <FiShoppingBag size={22} />
              {mounted && cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={styles.cartBadge}
                >
                  {cartCount}
                </motion.span>
              )}
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
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className={`${styles.dropdownMenu} glass`} 
                      style={{ right: 0, left: 'auto' }}
                    >
                      <Link href="/account" className={styles.dropdownItem}><FaUser /> My Account</Link>
                      <Link href="/account/rewards" className={styles.dropdownItem}><FaCrown /> Lens Rewards</Link>
                      <Link href="/account/orders" className={styles.dropdownItem}><FaBox /> My Orders</Link>
                      <Link href="/account/prescriptions" className={styles.dropdownItem}><FaClipboardList /> Prescription Vault</Link>
                      <Link href="/account/wishlist" className={styles.dropdownItem}><FaHeart /> My Wishlist</Link>
                      {isAdminUser && <Link href="/admin" className={styles.dropdownItem}><FaUserShield /> Admin Panel</Link>}
                      <hr style={{ margin: '8px 0', opacity: 0.1 }} />
                      <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}><FaSignOutAlt /> Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
        <AnimatePresence>
          {mobileMenuOpen && mounted && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`${styles.mobileMenu} glass`}
            >
              <div className={styles.mobileLinks}>
                <form className={styles.mobileSearch} onSubmit={handleSearchSubmit}>
                  <input
                    type="text" placeholder="Search eyewear..."
                    value={searchQuery} onChange={handleSearch}
                    className="form-input"
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Search</button>
                </form>
                {categories.map(cat => (
                  <Link key={cat.href} href={cat.href} className={styles.mobileLink}>
                    <span className={styles.mobileIcon}>{cat.icon}</span> {cat.label}
                  </Link>
                ))}
                <Link href="/contact#appointment" className={styles.mobileLink}><FaCalendarAlt /> Book Eye Test</Link>
                <Link href="/account/wishlist" className={styles.mobileLink}><FiHeart /> My Wishlist</Link>
                {user ? (
                  <>
                    <Link href="/account" className={styles.mobileLink}><FiUser /> My Account</Link>
                    <Link href="/account/orders" className={styles.mobileLink}><FaBox /> Orders</Link>
                    {isAdminUser && <Link href="/admin" className={styles.mobileLink}><FaUserShield /> Admin</Link>}
                    <button onClick={handleLogout} className={styles.mobileLink}><FaSignOutAlt /> Logout</button>
                  </>
                ) : (
                  <div className={styles.mobileAuth}>
                    <Link href="/login" className="btn btn-primary">Login</Link>
                    <Link href="/register" className="btn btn-outline">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
