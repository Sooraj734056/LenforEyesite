'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

import styles from './page.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  { name: 'Men', icon: '👓', color: '#0057A8', href: '/products?gender=Men' },
  { name: 'Women', icon: '💎', color: '#E91E8C', href: '/products?gender=Women' },
  { name: 'Kids', icon: '⭐', color: '#FF9800', href: '/products?category=Kids' },
  { name: 'Computer Glasses', icon: '💻', color: '#00AEEF', href: '/products?category=Computer+Glasses' },
  { name: 'Reading Glasses', icon: '📚', color: '#4CAF50', href: '/products?category=Reading+Glasses' },
  { name: 'Contact Lenses', icon: '👁️', color: '#9C27B0', href: '/products?category=Contact+Lenses' },
];

const HERO_SLIDES = [
  {
    title: 'See the World in Perfect Clarity',
    subtitle: 'Up to 60% off on Premium Eyewear • Free Home Eye Test in Jaipur',
    cta: 'Shop Now', ctaLink: '/products',
    cta2: 'Book Free Eye Test', cta2Link: '/contact#appointment',
    bgImage: '/img/img4.jpg',
    badge: '🎉 60% OFF Today',
  },
  {
    title: 'Zeiss & Crizal Premium Lenses',
    subtitle: 'World-class optical lenses fitted by certified experts in Jaipur',
    cta: 'Explore Brands', ctaLink: '/products?brand=Zeiss',
    cta2: 'Learn More', cta2Link: '/about',
    bgImage: '/img/img6.jpg',
    badge: '🏆 Premium Quality',
  },
  {
    title: 'Free Home Eye Test — Jaipur',
    subtitle: 'Certified optometrists visit your home. Book a slot today!',
    cta: 'Book Appointment', ctaLink: '/contact#appointment',
    cta2: 'Call Now', cta2Link: 'tel:+919999999999',
    bgImage: '/img/img7.jpg',
    badge: '🏠 Home Service',
  },
];

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
    }, 5000);
    return () => clearInterval(slideTimer.current);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <>


      {/* ─── HERO SECTION ─── */}
      <section
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.5)), url(${slide.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>{slide.badge}</span>
          <h1 className={styles.heroTitle}>{slide.title}</h1>
          <p className={styles.heroSubtitle}>{slide.subtitle}</p>
          <div className={styles.heroCtas}>
            <Link href={slide.ctaLink} className="btn btn-primary btn-lg">{slide.cta}</Link>
            <Link href={slide.cta2Link} className="btn btn-white btn-lg">{slide.cta2}</Link>
          </div>

          {/* Slide Indicators */}
          <div className={styles.slideIndicators}>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`${styles.indicator} ${i === currentSlide ? styles.indicatorActive : ''}`}
                onClick={() => { setCurrentSlide(i); clearInterval(slideTimer.current); }}
                id={`hero-slide-${i}`}
              />
            ))}
          </div>
        </div>

        {/* Floating Cards */}
        <div className={styles.heroVisual}>
          <div className={styles.heroCard} style={{ animationDelay: '0s' }}>
            <span className={styles.heroCardIcon}>🏅</span>
            <div>
              <div className={styles.heroCardTitle}>Trusted by 10,000+</div>
              <div className={styles.heroCardSub}>Happy customers</div>
            </div>
          </div>
          <div className={styles.heroCard} style={{ animationDelay: '0.5s' }}>
            <span className={styles.heroCardIcon}>👁️</span>
            <div>
              <div className={styles.heroCardTitle}>Expert Eye Tests</div>
              <div className={styles.heroCardSub}>At your home</div>
            </div>
          </div>
          <div className={styles.heroCard} style={{ animationDelay: '1s' }}>
            <span className={styles.heroCardIcon}>🚚</span>
            <div>
              <div className={styles.heroCardTitle}>Free Delivery</div>
              <div className={styles.heroCardSub}>Orders above ₹1000</div>
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className={styles.trustBar}>
        <div className="container">
          <div className={styles.trustItems}>
            {[
              { icon: '🔍', text: 'Free Eye Checkup', sub: 'Expert optometrists' },
              { icon: '🚚', text: 'Free Delivery', sub: 'On orders ₹1000+' },
              { icon: '🔄', text: '15-Day Returns', sub: 'Hassle-free policy' },
              { icon: '🛡️', text: '1-Year Warranty', sub: 'On all frames' },
              { icon: '💳', text: 'Easy EMI', sub: 'No-cost EMI available' },
            ].map((t, i) => (
              <div key={i} className={styles.trustItem}>
                <span className={styles.trustIcon}>{t.icon}</span>
                <div>
                  <div className={styles.trustText}>{t.text}</div>
                  <div className={styles.trustSub}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find the perfect eyewear for everyone</p>
            </div>
            <Link href="/products" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={cat.href} className={styles.categoryCard} id={`cat-${cat.name.toLowerCase().replace(/\s/g, '-')}`}>
                <div className={styles.categoryIcon} style={{ background: `${cat.color}18`, borderColor: `${cat.color}33` }}>
                  <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                </div>
                <span className={styles.categoryName}>{cat.name}</span>
                <div className={styles.categoryArrow} style={{ color: cat.color }}>→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Eyewear</h2>
              <p className="section-subtitle">Handpicked premium frames for you</p>
            </div>
            <Link href="/products?featured=true" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-auto">
              {Array(4).fill(0).map((_, i) => <div key={i} className={`skeleton`} style={{ height: 360 }} />)}
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
          <div className="section-header">
            <div>
              <h2 className="section-title">Premium Brands</h2>
              <p className="section-subtitle">Trusted optical brands we carry</p>
            </div>
          </div>
          <div className={styles.brands}>
            {[
              { name: 'Zeiss', tagline: 'German Precision Optics', color: '#002F6C', href: '/products?brand=Zeiss' },
              { name: 'Crizal', tagline: 'Anti-reflective Excellence', color: '#E4002B', href: '/products?brand=Crizal' },
              { name: 'Ray-Ban', tagline: 'Iconic Since 1937', color: '#000000', href: '/products?brand=Ray-Ban' },
              { name: 'Vogue', tagline: 'Italian Fashion Frames', color: '#8B1A1A', href: '/products?brand=Vogue' },
              { name: 'Fastrack', tagline: 'Bold & Affordable', color: '#FF6B00', href: '/products?brand=Fastrack' },
              { name: 'Vincent Chase', tagline: 'Style Meets Value', color: '#1565C0', href: '/products?brand=Vincent+Chase' },
            ].map(brand => (
              <Link key={brand.name} href={brand.href} className={styles.brandCard} id={`brand-${brand.name.toLowerCase().replace(/\s/g, '-')}`}>
                <div className={styles.brandInitial} style={{ background: brand.color }}>{brand.name[0]}</div>
                <div className={styles.brandName}>{brand.name}</div>
                <div className={styles.brandTagline}>{brand.tagline}</div>
                <div className={styles.brandShop}>Shop →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS + BESTSELLERS ─── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className={styles.twoCol}>
            <div>
              <div className="section-header">
                <div>
                  <h2 className="section-title">New Arrivals</h2>
                  <p className="section-subtitle">Fresh frames, just in</p>
                </div>
                <Link href="/products?newArrival=true" className="btn btn-outline btn-sm">See All</Link>
              </div>
              <div className="grid grid-2">
                {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
            <div>
              <div className="section-header">
                <div>
                  <h2 className="section-title">Bestsellers</h2>
                  <p className="section-subtitle">What customers love</p>
                </div>
                <Link href="/products?bestseller=true" className="btn btn-outline btn-sm">See All</Link>
              </div>
              <div className="grid grid-2">
                {bestsellers.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOME EYE TEST CTA ─── */}
      <section className={styles.eyeTestCta}>
        <div className="container">
          <div className={styles.eyeTestInner}>
            <div className={styles.eyeTestContent}>
              <span className={styles.eyeTestEmoji}>🏠</span>
              <div>
                <h2>Free Home Eye Test in Jaipur</h2>
                <p>Our certified optometrists come to your doorstep. No hospitals, no queues.</p>
                <div className={styles.eyeTestFeatures}>
                  {['✅ Free of charge', '✅ Raja Park & nearby areas', '✅ Get prescription instantly', '✅ Same-day frame selection'].map(f => (
                    <span key={f} className={styles.eyeTestFeature}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.eyeTestAction}>
              <Link href="/contact#appointment" className="btn btn-white btn-lg" id="home-eye-test-cta">
                📅 Book Free Appointment
              </Link>
              <a href="https://wa.me/919999999999?text=Hi, I want to book a home eye test." className={styles.whatsappBtn} target="_blank" rel="noreferrer" id="whatsapp-cta">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LENS PACKAGES INFO ─── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Lens Packages We Offer</h2>
              <p className="section-subtitle">Choose the right lens for your lifestyle</p>
            </div>
          </div>
          <div className="grid grid-4">
            {[
              { name: 'Basic Anti-Glare', icon: '✨', price: 'From ₹499', desc: 'Reduces glare from lights, great for driving and office use.' },
              { name: 'Blue Cut', icon: '💙', price: 'From ₹799', desc: 'Blocks harmful blue light from screens. Perfect for all-day computer users.' },
              { name: 'Photochromic', icon: '☀️', price: 'From ₹1299', desc: 'Turns dark in sunlight, clear indoors. 2-in-1 convenience.' },
              { name: 'Progressive', icon: '🔭', price: 'From ₹2499', desc: 'Multi-focal lenses for presbyopia — see near, far, and in-between.' },
            ].map(lens => (
              <div key={lens.name} className={styles.lensCard} id={`lens-${lens.name.toLowerCase().replace(/\s/g, '-')}`}>
                <div className={styles.lensIcon}>{lens.icon}</div>
                <h3 className={styles.lensName}>{lens.name}</h3>
                <p className={styles.lensDesc}>{lens.desc}</p>
                <div className={styles.lensPrice}>{lens.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="grid grid-3">
            {[
              { name: 'Priya Sharma', location: 'Raja Park, Jaipur', rating: 5, text: 'Amazing experience! The eye test at home was so convenient. Got my progressive lenses fitted perfectly. Highly recommend to everyone in Jaipur!' },
              { name: 'Rahul Gupta', location: 'Vaishali Nagar, Jaipur', rating: 5, text: 'Ordered Ray-Ban sunglasses online. Delivery was fast, packaging excellent. The team helped me choose the right frame shape for my face. 10/10!' },
              { name: 'Sunita Mehta', location: 'C-Scheme, Jaipur', rating: 5, text: 'My daughter needed computer glasses for online classes. Got Blue Cut lenses in just 2 days. She loves them! Great quality at affordable price.' },
            ].map((t, i) => (
              <div key={i} className={styles.testimonial}>
                <div className={styles.testimonialStars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.name[0]}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialLocation}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
