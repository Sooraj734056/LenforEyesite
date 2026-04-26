'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import useCartStore from '@/store/cartStore';
import { resolveMediaUrl } from '@/lib/media';
import styles from './page.module.css';

export default function CartPage() {
  const { items, removeItem, updateQty, getTotal, getCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="section container">Loading cart...</div>;

  const total = getTotal();
  const count = getCount();

  if (items.length === 0) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.emptyIcon}><FiShoppingBag /></div>
            <h1 style={{ marginBottom: '16px' }}>Your Cart is Empty</h1>
            <p style={{ color: 'var(--gray-mid)', marginBottom: '32px' }}>
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.pageTitle}
        >
          Shopping Cart <span>({count} items)</span>
        </motion.h1>

        <div className={styles.cartGrid}>
          {/* Items List */}
          <div className={styles.itemsList}>
            {items.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${styles.cartItem} glass`}
              >
                <div className={styles.itemImage}>
                  <img src={resolveMediaUrl(item.image) || `https://placehold.co/120x90/0A0A0A/00AEEF?text=Frame`} alt={item.productName} />
                </div>
                <div className={styles.itemInfo}>
                  <div>
                    <div className={styles.itemBrand}>{item.brand}</div>
                    <Link href={`/product/${item.productId}`} className={styles.itemName}>
                      {item.productName}
                    </Link>
                    <div className={styles.itemMeta}>
                      <span>Color: <strong>{item.variantColor}</strong></span>
                      {item.lens && <span>Lens: <strong>{item.lens.powerType} ({item.lens.package})</strong></span>}
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.qtyControl}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><FiMinus /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}><FiPlus /></button>
                    </div>
                    <div className={styles.priceInfo}>
                      <div className={styles.currentPrice}>₹{((item.price + (item.lens?.price || 0)) * item.quantity).toLocaleString('en-IN')}</div>
                      <div className={styles.unitPrice}>₹{(item.price + (item.lens?.price || 0)).toLocaleString('en-IN')} each</div>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)} title="Remove item">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className={styles.sidebar}>
            <div className={`${styles.summaryCard} glass`}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={total >= 1000 ? styles.free : ''}>
                  {total >= 1000 ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax (GST)</span>
                <span>Calculated at checkout</span>
              </div>

              <div className={styles.divider} />

              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total Amount</span>
                <span>₹{(total >= 1000 ? total : total + 99).toLocaleString('en-IN')}</span>
              </div>

              <Link href="/checkout" className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}>
                Proceed to Checkout <FiArrowRight />
              </Link>

              <div className={styles.trustBadges}>
                <div className={styles.badge}>
                  <FiShield /> <span>Secure SSL</span>
                </div>
                <div className={styles.badge}>
                  <FiTruck /> <span>Fast Delivery</span>
                </div>
                <div className={styles.badge}>
                  <FiRefreshCw /> <span>Easy Returns</span>
                </div>
              </div>
            </div>

            <Link href="/products" className={styles.continueLink}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
