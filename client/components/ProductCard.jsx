'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import useWishlistStore from '@/store/wishlistStore';
import { resolveMediaUrl } from '@/lib/media';
import toast from 'react-hot-toast';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';
import styles from './ProductCard.module.css';
import QuickView from './QuickView';

export default function ProductCard({ product }) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addingCart, setAddingCart] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product._id);

  const variant = product.variants?.[selectedVariant] || product.variants?.[0];
  const discount = product.discount || (product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    setAddingCart(true);
    addItem(product, variant);
    openCart();
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddingCart(false), 800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product, user);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.ratings?.average || 0) ? '★' : '☆');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.cardWrapper}>
        <Link href={`/product/${product._id}`} className={styles.card} id={`product-${product._id}`}>
          {/* Image Section */}
          <div className={styles.imageWrap}>
            <motion.img
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              src={resolveMediaUrl(variant?.images?.[0]) || `https://placehold.co/400x300/0A0A0A/00AEEF?text=${encodeURIComponent(product.brand || 'Lens')}`}
              alt={product.name}
              className={styles.image}
              loading="lazy"
            />

            {/* Floating Badges */}
            <div className={styles.badges}>
              {discount > 0 && <span className={`${styles.badge} ${styles.badgeDiscount}`}>{discount}% OFF</span>}
              {product.isNewArrival && <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>}
            </div>

            {/* Quick Actions */}
            <div className={styles.actions}>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${styles.actionBtn} ${isWishlisted ? styles.wishlisted : ''}`} 
                onClick={handleWishlist} 
                title="Wishlist"
              >
                <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={styles.actionBtn} 
                onClick={handleQuickView} 
                title="Quick View"
              >
                <FiEye size={18} />
              </motion.button>
            </div>

            {/* Hover Overlay */}
            <div className={styles.overlay}>
              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`${styles.quickAdd} ${addingCart ? styles.adding : ''} glass`} 
                onClick={handleAddToCart}
              >
                {addingCart ? '✓ Added' : <><FiShoppingBag /> Add to Cart</>}
              </motion.button>
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            <div className={styles.brandRow}>
              <span className={styles.brand}>{product.brand}</span>
              <div className={styles.rating}>
                <span className={styles.stars}>{stars.join('')}</span>
              </div>
            </div>
            
            <h3 className={styles.name}>{product.name}</h3>

            {/* Color Swatches */}
            {product.variants && product.variants.length > 1 && (
              <div className={styles.swatches}>
                {product.variants.slice(0, 4).map((v, i) => (
                  <button
                    key={i}
                    className={`${styles.swatch} ${i === selectedVariant ? styles.swatchActive : ''}`}
                    style={{ background: v.colorHex || '#000' }}
                    onClick={e => { e.preventDefault(); setSelectedVariant(i); }}
                    title={v.color}
                  />
                ))}
                {product.variants.length > 4 && <span className={styles.moreColors}>+{product.variants.length - 4}</span>}
              </div>
            )}

            <div className={styles.footer}>
              <div className={styles.priceRow}>
                <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
                {product.comparePrice && (
                  <span className={styles.comparePrice}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              <div className={styles.tags}>
                <span className={styles.tag}>{product.frameShape}</span>
              </div>
            </div>
          </div>
        </Link>
        <QuickView 
          product={product} 
          isOpen={isQuickViewOpen} 
          onClose={() => setIsQuickViewOpen(false)} 
        />
      </div>
    </motion.div>
  );
}
