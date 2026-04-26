'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiX, FiShoppingBag, FiArrowRight, FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resolveMediaUrl } from '@/lib/media';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';
import styles from './QuickView.module.css';

export default function QuickView({ product, isOpen, onClose }) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const { addItem, openCart } = useCartStore();
  const { user } = useAuthStore();
  
  if (!product) return null;
  
  const variant = product.variants?.[selectedVariant] || product.variants?.[0];

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      onClose();
      return;
    }
    addItem(product, variant);
    openCart();
    toast.success('Added to cart!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`${styles.modal} glass`}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose}><FiX size={24} /></button>
            
            <div className={styles.grid}>
              {/* Left: Image Gallery */}
              <div className={styles.imageSection}>
                <div className={styles.mainImageWrap}>
                  <img 
                    src={resolveMediaUrl(variant?.images?.[0]) || '/img/placeholder.png'} 
                    alt={product.name} 
                    className={styles.mainImage}
                  />
                </div>
                {product.variants?.length > 1 && (
                  <div className={styles.variantThumbs}>
                    {product.variants.map((v, i) => (
                      <button 
                        key={i} 
                        className={`${styles.thumb} ${i === selectedVariant ? styles.thumbActive : ''}`}
                        onClick={() => setSelectedVariant(i)}
                      >
                        <img src={resolveMediaUrl(v.images?.[0])} alt={v.color} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Info */}
              <div className={styles.infoSection}>
                <div className={styles.header}>
                  <span className={styles.brand}>{product.brand}</span>
                  <h2 className={styles.name}>{product.name}</h2>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
                    {product.comparePrice && (
                      <span className={styles.comparePrice}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                <div className={styles.description}>
                  <p>{product.description || 'Premium quality frames designed for both comfort and style. Perfect for daily wear.'}</p>
                </div>

                <div className={styles.specs}>
                  <div className={styles.spec}><span>Shape:</span> {product.frameShape}</div>
                  <div className={styles.spec}><span>Material:</span> {product.frameMaterial}</div>
                  <div className={styles.spec}><span>Gender:</span> {product.gender}</div>
                </div>

                <div className={styles.actions}>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddToCart}>
                    <FiShoppingBag /> Add to Cart
                  </button>
                  <Link href={`/product/${product._id}`} className="btn btn-outline" style={{ width: '100%' }}>
                    View Full Details <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
