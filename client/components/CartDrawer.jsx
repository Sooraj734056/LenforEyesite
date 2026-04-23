'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import { resolveMediaUrl } from '@/lib/media';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, getTotal, getCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const total = getTotal();
  const count = getCount();

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className={styles.backdrop} onClick={closeCart} />}

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Your Cart</h3>
            <span className={styles.count}>{count} item{count !== 1 ? 's' : ''}</span>
          </div>
          <button className={styles.closeBtn} onClick={closeCart} id="cart-close">✕</button>
        </div>

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🛒</div>
              <h4>Your cart is empty</h4>
              <p>Add some eyewear to get started!</p>
              <button className="btn btn-primary" onClick={closeCart}>Continue Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.item} id={`cart-item-${item.id}`}>
                <div className={styles.itemImage}>
                  <img src={resolveMediaUrl(item.image) || `https://placehold.co/80x60/0A0A0A/00AEEF?text=Frame`} alt={item.productName} />
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemBrand}>{item.brand}</div>
                  <div className={styles.itemName}>{item.productName}</div>
                  <div className={styles.itemColor}>Color: {item.variantColor}</div>
                  {item.lens && (
                    <div className={styles.lensInfo}>
                      <span>+ Lens: {item.lens.powerType}</span>
                      <span className={styles.lensPackage}>{item.lens.package}</span>
                    </div>
                  )}
                  <div className={styles.itemBottom}>
                    <div className={styles.qtyControl}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} id={`qty-dec-${item.id}`}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} id={`qty-inc-${item.id}`}>+</button>
                    </div>
                    <div className={styles.itemPrice}>
                      ₹{((item.price + (item.lens?.price || 0)) * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)} title="Remove" id={`remove-${item.id}`}>🗑️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal ({count} items)</span>
              <span className={styles.totalAmount}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.shipping}>
              {total >= 1000
                ? <span className={styles.freeShip}>🎉 Free shipping applied!</span>
                : <span>Add ₹{(1000 - total).toLocaleString('en-IN')} more for free shipping</span>
              }
            </div>
            <Link href="/checkout" className="btn btn-primary" onClick={closeCart} id="proceed-checkout" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Checkout →
            </Link>
            <Link href="/cart" className="btn btn-outline btn-sm" onClick={closeCart} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
