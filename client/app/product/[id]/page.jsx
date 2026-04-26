'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { resolveMediaUrl } from '@/lib/media';
import toast from 'react-hot-toast';
import CartDrawer from '@/components/CartDrawer';
import LensConfigurator from '@/components/LensConfigurator';
import ReviewForm from '@/components/ReviewForm';
import RelatedProducts from '@/components/RelatedProducts';
import { 
  FaCheckCircle, FaTimesCircle, FaBinoculars, FaShoppingCart, FaCalendarAlt, 
  FaTruck, FaSyncAlt, FaShieldAlt, FaMicroscope, FaStar, FaStarHalfAlt
} from 'react-icons/fa';
import styles from './page.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLensConfig, setShowLensConfig] = useState(false);
  const [lensConfig, setLensConfig] = useState(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex-center" style={{ minHeight: 500 }}>
      <div className="spinner" />
    </div>
  );

  if (!product) return (
    <div className="flex-center" style={{ minHeight: 500, flexDirection: 'column', gap: 16 }}>
      <h2>Product not found</h2>
      <Link href="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  );

  const variant = product.variants?.[selectedVariant];
  const images = variant?.images?.length > 0
    ? variant.images.map(resolveMediaUrl)
    : [`https://placehold.co/600x450/0A0A0A/00AEEF?text=${encodeURIComponent(product.name)}`];

  const discount = product.discount || (product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    if (product.lensCompatible) {
      setShowLensConfig(true);
    } else {
      addItem(product, variant);
      openCart();
      toast.success('Added to cart!');
    }
  };

  const handleLensComplete = (lens) => {
    setLensConfig(lens);
    setShowLensConfig(false);
    addItem(product, variant, lens);
    openCart();
    toast.success('Frame + Lens added to cart!');
  };

  const handleSkipLens = () => {
    setShowLensConfig(false);
    addItem(product, variant, null);
    openCart();
    toast.success('Frame added to cart (no lens)');
  };

  const handleReviewAdded = (reviews, ratings) => {
    setProduct(prev => ({ ...prev, reviews, ratings }));
  };

  const totalPrice = product.price + (lensConfig?.price || 0);

  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < Math.round(product.ratings?.average || 0) ? '#F59E0B' : '#D1D5DB' }}>★</span>
  ));

  return (
    <>
      <CartDrawer />

      {/* Lens Configurator Modal */}
      {showLensConfig && (
        <LensConfigurator
          product={product}
          onComplete={handleLensComplete}
          onSkip={handleSkipLens}
          onClose={() => setShowLensConfig(false)}
        />
      )}

      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/products">Products</Link>
          <span>›</span>
          <Link href={`/products?category=${product.category}`}>{product.category}</Link>
          <span>›</span>
          <span className={styles.breadActive}>{product.name}</span>
        </nav>

        <div className={styles.pdpGrid}>
          {/* ─── LEFT: Image Gallery ─── */}
          <div className={styles.gallerySection}>
            {/* Thumbnails */}
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button key={i} className={`${styles.thumb} ${i === selectedImage ? styles.thumbActive : ''}`}
                  onClick={() => setSelectedImage(i)} id={`thumb-${i}`}>
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div
              className={styles.mainImage}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className={styles.mainImg}
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? 'scale(1.5)' : 'scale(1)'
                }}
              />
              {/* Badges */}
              <div className={styles.imgBadges}>
                {discount > 0 && <span className="badge badge-error">{discount}% OFF</span>}
                {product.isNewArrival && <span className="badge badge-success">NEW</span>}
              </div>
              <div className={styles.zoomHint}>{isZooming ? '🔍 Zooming' : '🔍 Hover to zoom'}</div>
            </div>
          </div>

          {/* ─── RIGHT: Product Info ─── */}
          <div className={styles.infoSection}>
            <div className={styles.brandBadge}>{product.brand}</div>
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <div className={styles.stars}>{stars}</div>
              <span className={styles.ratingNum}>{product.ratings?.average || 0}</span>
              <span className={styles.ratingCount}>({product.ratings?.count || 0} reviews)</span>
              <span className={styles.sold}>{product.soldCount} sold</span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.comparePrice && (
                <span className={styles.comparePrice}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
              )}
              {discount > 0 && (
                <span className={styles.discountBadge}>{discount}% off</span>
              )}
            </div>
            {lensConfig && (
              <div className={styles.lensAdded}>
                <FaCheckCircle /> Lens added: {lensConfig.powerType} — {lensConfig.package} (+₹{lensConfig.price})
                <br/>
                <strong>Total: ₹{totalPrice.toLocaleString('en-IN')}</strong>
              </div>
            )}

            {/* Color Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className={styles.variantSection}>
                <div className={styles.variantLabel}>
                  Color: <strong>{variant?.color}</strong>
                  {variant?.stock <= 5 && variant?.stock > 0 && (
                    <span className={styles.lowStock}>Only {variant.stock} left!</span>
                  )}
                </div>
                <div className={styles.swatchGroup}>
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      className={`${styles.swatch} ${i === selectedVariant ? styles.swatchActive : ''}`}
                      style={{ background: v.colorHex || '#000' }}
                      onClick={() => { setSelectedVariant(i); setSelectedImage(0); }}
                      title={`${v.color} — ${v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}`}
                      id={`color-swatch-${i}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {variant?.stock === 0 ? (
              <div className={styles.outOfStock}><FaTimesCircle /> Out of Stock</div>
            ) : (
              <div className={styles.inStock}><FaCheckCircle /> In Stock ({variant?.stock || 'Available'})</div>
            )}

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              <button
                className={`btn btn-primary btn-lg ${styles.addCartBtn}`}
                onClick={handleAddToCart}
                disabled={variant?.stock === 0}
                id="add-to-cart-btn"
              >
                {product.lensCompatible ? <><FaBinoculars /> Choose Lenses & Add</> : <><FaShoppingCart /> Add to Cart</>}
              </button>
              <Link href="/contact#appointment" className={`btn btn-outline btn-lg ${styles.tryStoreBtn}`}>
                <FaCalendarAlt /> Try in Store
              </Link>
            </div>



            {/* Service Badges */}
            <div className={styles.services}>
              <div className={styles.serviceBadge}><FaTruck /> Free Delivery above ₹1000</div>
              <div className={styles.serviceBadge}><FaSyncAlt /> 15-Day Return</div>
              <div className={styles.serviceBadge}><FaShieldAlt /> 1-Year Warranty</div>
              <div className={styles.serviceBadge}><FaMicroscope /> Genuine Product</div>
            </div>

            {/* Product Specs */}
            <div className={styles.specGrid}>
              {[
                { k: 'Shape', v: product.frameShape },
                { k: 'Material', v: product.frameMaterial },
                { k: 'Width', v: product.frameWidth },
                { k: 'Gender', v: product.gender },
                { k: 'Category', v: product.category },
              ].map(item => (
                <div key={item.k} className={styles.spec}>
                  <span className={styles.specKey}>{item.k}</span>
                  <span className={styles.specVal}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── TABS: Description, Features, Reviews ─── */}
        <div className={styles.tabs}>
          <div className={styles.tabNavs}>
            {['description', 'features', 'reviews'].map(t => (
              <button key={t} className={`${styles.tabNav} ${tab === t ? styles.tabNavActive : ''}`}
                onClick={() => setTab(t)} id={`tab-${t}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'reviews' && ` (${product.ratings?.count || 0})`}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {tab === 'description' && (
              <div className={styles.description}>
                <p>{product.description || 'Premium quality eyewear crafted for comfort and style.'}</p>
              </div>
            )}
            {tab === 'features' && (
              <ul className={styles.features}>
                {product.features?.length > 0
                  ? product.features.map((f, i) => <li key={i} className={styles.feature}><FaCheckCircle /> {f}</li>)
                  : <li className={styles.feature}>No specific features listed</li>
                }
              </ul>
            )}
            {tab === 'reviews' && (
              <div className={styles.reviews}>
                {product.reviews?.length === 0 ? (
                  <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
                ) : (
                  product.reviews?.map((r, i) => (
                    <div key={i} className={styles.review}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAvatar}>{r.name?.[0] || 'U'}</div>
                        <div>
                          <div className={styles.reviewName}>{r.name}</div>
                          <div className={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                        </div>
                        <div className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>
                      <p className={styles.reviewText}>{r.comment}</p>
                    </div>
                  ))
                )}
                <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts category={product.category} excludeId={product._id} />
      </div>
    </>
  );
}
