'use client';
import Link from 'next/link';
import { useState } from 'react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import useWishlistStore from '@/store/wishlistStore';
import { resolveMediaUrl } from '@/lib/media';
import toast from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addingCart, setAddingCart] = useState(false);
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
    setAddingCart(true);
    addItem(product, variant);
    openCart();
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddingCart(false), 400);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.ratings?.average || 0) ? '★' : '☆');

  return (
    <Link href={`/product/${product._id}`} className={styles.card} id={`product-${product._id}`}>
      {/* Image */}
      <div className={styles.imageWrap}>
        <img
          src={resolveMediaUrl(variant?.images?.[0]) || `https://placehold.co/400x300/0A0A0A/00AEEF?text=${encodeURIComponent(product.brand || 'Lens')}`}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />

        {/* Badges */}
        <div className={styles.badges}>
          {discount > 0 && <span className={`${styles.badge} ${styles.badgeDiscount}`}>{discount}% OFF</span>}
          {product.isNewArrival && <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>}
          {product.isBestseller && <span className={`${styles.badge} ${styles.badgeBest}`}>⭐ BESTSELLER</span>}
        </div>

        {/* Wishlist */}
        <button className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`} onClick={handleWishlist} title="Wishlist" id={`wishlist-${product._id}`}>
          <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick Add Overlay */}
        <div className={styles.overlay}>
          <button className={`${styles.quickAdd} ${addingCart ? styles.adding : ''}`} onClick={handleAddToCart} id={`add-cart-${product._id}`}>
            {addingCart ? '✓ Added!' : <><FaShoppingCart /> Add to Cart</>}
          </button>
        </div>
      </div>

      {/* Color Swatches */}
      {product.variants && product.variants.length > 1 && (
        <div className={styles.swatches}>
          {product.variants.slice(0, 5).map((v, i) => (
            <button
              key={i}
              className={`${styles.swatch} ${i === selectedVariant ? styles.swatchActive : ''}`}
              style={{ background: v.colorHex || '#000' }}
              onClick={e => { e.preventDefault(); setSelectedVariant(i); }}
              title={v.color}
              id={`swatch-${product._id}-${i}`}
            />
          ))}
          {product.variants.length > 5 && <span className={styles.moreColors}>+{product.variants.length - 5}</span>}
        </div>
      )}

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.brand}>{product.brand}</div>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.rating}>
          <span className={styles.stars}>{stars.join('')}</span>
          <span className={styles.ratingCount}>({product.ratings?.count || 0})</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
          {product.comparePrice && (
            <span className={styles.comparePrice}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
          )}
          {discount > 0 && <span className={styles.discountTag}>{discount}% off</span>}
        </div>

        <div className={styles.tags}>
          <span className={styles.tag}>{product.frameShape}</span>
          <span className={styles.tag}>{product.frameMaterial}</span>
        </div>
      </div>
    </Link>
  );
}
