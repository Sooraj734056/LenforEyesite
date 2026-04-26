'use client';
import { useEffect } from 'react';
import useWishlistStore from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import styles from './page.module.css';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const { user } = useAuthStore();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBox}>
          <FiHeart className={styles.titleIcon} />
          <h1 className={styles.title}>My Wishlist</h1>
        </div>
        <p className={styles.subtitle}>
          {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </header>

      {items.length > 0 ? (
        <div className="grid grid-4">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyIcon}>❤️</div>
          <h2>Your wishlist is empty</h2>
          <p>Explore our latest collection and save your favorite frames here.</p>
          <Link href="/products" className="btn btn-primary btn-lg">
            Shop Now <FiArrowRight />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
