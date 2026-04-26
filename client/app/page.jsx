'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import {
  FaGlasses, FaGem, FaStar, FaLaptop, FaBook, FaEye, FaMedal, FaTruck,
  FaSearch, FaSyncAlt, FaShieldAlt, FaCreditCard, FaHome, FaMagic,
  FaTv, FaSun, FaBinoculars, FaCalendarAlt, FaCheckCircle
} from 'react-icons/fa';
import { FiArrowRight, FiCheckCircle, FiTruck, FiShield, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { ProductSkeleton } from '@/components/Skeleton';
import styles from './page.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  { name: 'Men', icon: <FaGlasses />, color: '#0057A8', href: '/products?gender=Men' },
  { name: 'Women', icon: <FaGem />, color: '#E91E8C', href: '/products?gender=Women' },
  { name: 'Kids', icon: <FaStar />, color: '#FF9800', href: '/products?category=Kids' },
  { name: 'Computer Glasses', icon: <FaLaptop />, color: '#00AEEF', href: '/products?category=Computer+Glasses' },
  { name: 'Reading Glasses', icon: <FaBook />, color: '#4CAF50', href: '/products?category=Reading+Glasses' },
  { name: 'Contact Lenses', icon: <FaEye />, color: '#9C27B0', href: '/products?category=Contact+Lenses' },
];

const HERO_SLIDES = [
  {
    title: 'See the World in Perfect Clarity',
    subtitle: 'Up to 60% off on Premium Eyewear • Free Home Eye Test in Jaipur',
    cta: 'Shop Now', ctaLink: '/products',
    cta2: 'Book Eye Test', cta2Link: '/contact#appointment',
    bgImage: '/img/banners/hero1.png',
    badge: 'SPECIAL 60% OFF TODAY',
  },
  {
    title: 'Zeiss & Crizal Premium Lenses',
    subtitle: 'World-class optical lenses fitted by certified experts in Jaipur',
    cta: 'Explore Brands', ctaLink: '/products?brand=Zeiss',
    cta2: 'Learn More', cta2Link: '/about',
    bgImage: '/img/banners/hero2.png',
    badge: 'PREMIUM QUALITY',
  },
  {
    title: 'Free Home Eye Test — Jaipur',
    subtitle: 'Certified optometrists visit your home. Book a slot today!',
    cta: 'Book Appointment', ctaLink: '/contact#appointment',
    cta2: 'Call Now', cta2Link: 'tel:+919772066955',
    bgImage: '/img/banners/hero3.png',
    badge: 'HOME SERVICE',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const slideTimer = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/products?featured=true&limit=8`).then(r => r.json()),
      fetch(`${API}/products?newArrival=true&limit=4`).then(r => r.json()),
      fetch(`${API}/products?bestseller=true&limit=4`).then(r => r.json()),
    ]).then(([feat, newArr, best]) => {
      setFeaturedProducts(feat.products || []);
      setNewArrivals(newArr.products || []);
      setBestsellers(best.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    slideTimer.current = setInterval(() => {
      setCurrentSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideTimer.current);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className={styles.mainWrapper}>
      {/* ─── HERO SECTION ─── */}
      <section className={styles.heroWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={styles.hero}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${slide.bgImage})`,
            }}
          >
            <div className={styles.heroContent}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={styles.heroBadge}
              >
                {slide.badge}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={styles.heroTitle}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={styles.heroSubtitle}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={styles.heroCtas}
              >
                <Link href={slide.ctaLink} className="btn btn-primary btn-lg">{slide.cta}</Link>
                <Link href={slide.cta2Link} className="btn btn-white btn-lg glass">{slide.cta2}</Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className={styles.slideIndicators}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${i === currentSlide ? styles.indicatorActive : ''}`}
              onClick={() => { setCurrentSlide(i); clearInterval(slideTimer.current); }}
            />
          ))}
        </div>

        {/* Floating Feature Cards */}
        <div className={styles.heroVisual}>
          {[
            { icon: <FaMedal />, title: '10k+ Trusted', sub: 'Happy Customers' },
            { icon: <FaEye />, title: 'Home Test', sub: 'Expert Optometrists' },
            { icon: <FaTruck />, title: 'Free Delivery', sub: 'On orders ₹1000+' }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (i * 0.2), duration: 0.8 }}
              className={`${styles.heroCard} glass`}
            >
              <span className={styles.heroCardIcon}>{card.icon}</span>
              <div>
                <div className={styles.heroCardTitle}>{card.title}</div>
                <div className={styles.heroCardSub}>{card.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className={styles.trustBar}>
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.trustItems}
          >
            {[
              { icon: <FiSearch />, text: 'Free Eye Checkup', sub: 'At Your Home' },
              { icon: <FiTruck />, text: 'Free Delivery', sub: 'Orders ₹1000+' },
              { icon: <FiRefreshCw />, text: '15-Day Returns', sub: 'No Questions Asked' },
              { icon: <FiShield />, text: '1-Year Warranty', sub: 'Genuine Products' },
              { icon: <FaCreditCard />, text: 'Easy EMI', sub: 'No-cost EMI' },
            ].map((t, i) => (
              <motion.div key={i} variants={itemVariants} className={styles.trustItem}>
                <span className={styles.trustIcon}>{t.icon}</span>
                <div>
                  <div className={styles.trustText}>{t.text}</div>
                  <div className={styles.trustSub}>{t.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FLASH SALE BANNER ─── */}
      <section className={styles.flashSale}>
        <div className="container">
          <div className={`${styles.flashContent} glass`}>
            <div className={styles.flashLeft}>
              <div className={styles.flashBadge}>⚡ FLASH SALE</div>
              <h2 className={styles.flashTitle}>Mid-Season Eyewear Blowout</h2>
              <p>Get up to 70% off on selected Ray-Ban & Vogue frames. Limited time only!</p>
              <div className={styles.couponCode}>
                Use Code: <strong>FLASH70</strong>
              </div>
            </div>
            <div className={styles.flashRight}>
              <div className={styles.timerGrid}>
                {[
                  { v: '02', l: 'HOURS' },
                  { v: '45', l: 'MINS' },
                  { v: '18', l: 'SECS' }
                ].map(t => (
                  <div key={t.l} className={styles.timerItem}>
                    <div className={styles.timerVal}>{t.v}</div>
                    <div className={styles.timerLabel}>{t.l}</div>
                  </div>
                ))}
              </div>
              <Link href="/products?discount=70" className="btn btn-white">Shop Sale</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find the perfect eyewear for everyone</p>
            </div>
            <Link href="/products" className="btn btn-outline btn-sm">View All <FiArrowRight /></Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.categoryGrid}
          >
            {CATEGORIES.map(cat => (
              <motion.div key={cat.name} variants={itemVariants}>
                <Link href={cat.href} className={`${styles.categoryCard} glass`} id={`cat-${cat.name.toLowerCase().replace(/\s/g, '-')}`}>
                  <div className={styles.categoryIcon} style={{ background: `${cat.color}18`, borderColor: `${cat.color}33` }}>
                    <span style={{ fontSize: '1.8rem', color: cat.color, display: 'flex', alignItems: 'center' }}>{cat.icon}</span>
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <div className={styles.categoryArrow} style={{ color: cat.color }}>→</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <div>
              <h2 className="section-title">Featured Eyewear</h2>
              <p className="section-subtitle">Handpicked premium frames for you</p>
            </div>
            <Link href="/products?featured=true" className="btn btn-outline btn-sm">View All <FiArrowRight /></Link>
          </motion.div>
          {loading ? (
            <div className="grid grid-auto">
              {Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-auto">
              {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── BRAND SPOTLIGHTS ─── */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <div style={{ textAlign: 'center', width: '100%' }}>
              <h2 className="section-title">Our Premium Brands</h2>
              <p className="section-subtitle">World-class quality you can trust</p>
            </div>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.brands}
          >
            {[
              { name: 'Zeiss', tagline: 'German Precision', color: '#002F6C', href: '/products?brand=Zeiss' },
              { name: 'Crizal', tagline: 'Anti-Reflective', color: '#E4002B', href: '/products?brand=Crizal' },
              { name: 'Ray-Ban', tagline: 'Iconic Style', color: '#000000', href: '/products?brand=Ray-Ban' },
              { name: 'Vogue', tagline: 'Italian Fashion', color: '#8B1A1A', href: '/products?brand=Vogue' },
              { name: 'Fastrack', tagline: 'Bold & Young', color: '#FF6B00', href: '/products?brand=Fastrack' },
              { name: 'Vincent Chase', tagline: 'Modern Classics', color: '#1565C0', href: '/products?brand=Vincent+Chase' },
            ].map(brand => (
              <motion.div key={brand.name} variants={itemVariants}>
                <Link href={brand.href} className={`${styles.brandCard} glass`} id={`brand-${brand.name.toLowerCase().replace(/\s/g, '-')}`}>
                  <div className={styles.brandInitial} style={{ background: brand.color }}>{brand.name[0]}</div>
                  <div className={styles.brandName}>{brand.name}</div>
                  <div className={styles.brandTagline}>{brand.tagline}</div>
                  <div className={styles.brandShop}>Shop <FiArrowRight /></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOME EYE TEST CTA ─── */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.eyeTestInner}
          >
            <div className={styles.eyeTestContent}>
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={styles.eyeTestEmoji}
              >
                <FaHome />
              </motion.span>
              <div>
                <h2>Free Home Eye Test in Jaipur</h2>
                <p>Our certified optometrists come to your doorstep with 100+ frames to try.</p>
                <div className={styles.eyeTestFeatures}>
                  {[
                    <><FiCheckCircle /> Certified Optometrists</>,
                    <><FiCheckCircle /> 100+ Frames to Try</>,
                    <><FiCheckCircle /> Instant Prescription</>,
                    <><FiCheckCircle /> No Visiting Charges</>
                  ].map((f, i) => (
                    <span key={i} className={styles.eyeTestFeature}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.eyeTestAction}>
              <Link href="/contact#appointment" className="btn btn-primary btn-lg" id="home-eye-test-cta">
                <FaCalendarAlt /> Book Appointment
              </Link>
              <a href="https://wa.me/919772066955?text=Hi, I want to book a home eye test." className={`${styles.whatsappBtn} glass`} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
            style={{ justifyContent: 'center', textAlign: 'center' }}
          >
            <h2 className="section-title">What Our Customers Say</h2>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-3"
          >
            {[
              { name: 'Priya Sharma', location: 'Raja Park, Jaipur', rating: 5, text: 'Amazing experience! The eye test at home was so convenient. Got my progressive lenses fitted perfectly.' },
              { name: 'Rahul Gupta', location: 'Vaishali Nagar, Jaipur', rating: 5, text: 'Ordered Ray-Ban sunglasses. Delivery was fast, packaging excellent. The team helped me choose the right shape.' },
              { name: 'Sunita Mehta', location: 'C-Scheme, Jaipur', rating: 5, text: 'My daughter needed computer glasses. Got Blue Cut lenses in just 2 days. Great quality at affordable price.' },
            ].map((t, i) => (
              <motion.div key={i} variants={itemVariants} className={`${styles.testimonial} glass`}>
                <div className={styles.testimonialStars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.name[0]}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialLocation}>{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
