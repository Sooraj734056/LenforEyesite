'use client';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import { 
  FiGift, FiAward, FiStar, FiShoppingBag, FiInfo,
  FiTrendingUp, FiCheckCircle, FiArrowRight 
} from 'react-icons/fi';
import styles from './page.module.css';
import Link from 'next/link';

export default function LoyaltyRewards() {
  const { user } = useAuthStore();
  
  if (!user) return <div className="flex-center" style={{ minHeight: 400 }}><Link href="/login" className="btn btn-primary">Login to view rewards</Link></div>;

  const points = user.loyaltyPoints || 0;
  const progress = Math.min((points / 5000) * 100, 100);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}><FiAward /> Silver Member</div>
          <h1 className={styles.title}>Your LensPoints</h1>
          <div className={styles.pointDisplay}>
            <span className={styles.pointValue}>{points.toLocaleString()}</span>
            <span className={styles.pointLabel}>PTS</span>
          </div>
          <p className={styles.subtitle}>You're doing great! Keep shopping to unlock Gold membership and exclusive benefits.</p>
        </div>
        <div className={styles.heroGraphic}>
          <div className={styles.circle} />
          <FiStar className={styles.floatingStar} style={{ top: '10%', left: '20%' }} />
          <FiStar className={styles.floatingStar} style={{ bottom: '20%', right: '10%' }} />
        </div>
      </div>

      <div className={styles.grid}>
        {/* Tier Progress */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}><FiTrendingUp /> Tier Progress</h3>
          </div>
          <div className={styles.progressSection}>
            <div className={styles.progressInfo}>
              <span>Silver</span>
              <span>Gold (5,000 pts)</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <p className={styles.progressHint}>{5000 - points > 0 ? `${(5000 - points).toLocaleString()} points to next tier` : 'You have reached Gold tier!'}</p>
          </div>
        </div>

        {/* Perks */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}><FiGift /> Your Exclusive Perks</h3>
          </div>
          <div className={styles.perkList}>
            <div className={styles.perkItem}>
              <FiCheckCircle className={styles.perkIcon} />
              <span>5% points on every purchase</span>
            </div>
            <div className={styles.perkItem}>
              <FiCheckCircle className={styles.perkIcon} />
              <span>Free shipping on all orders</span>
            </div>
            <div className={styles.perkItem} style={{ opacity: 0.5 }}>
              <FiInfo className={styles.perkIcon} />
              <span>Early access to sales (Gold Only)</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.waysToEarn}>
        <h2 className={styles.sectionTitle}>Ways to earn more</h2>
        <div className={styles.earnGrid}>
          <div className={styles.earnCard}>
            <FiShoppingBag className={styles.earnIcon} />
            <h4>Shop & Earn</h4>
            <p>Get 1 point for every ₹20 spent on the store.</p>
            <Link href="/products" className={styles.earnLink}>Shop Now <FiArrowRight /></Link>
          </div>
          <div className={styles.earnCard}>
            <FiStar className={styles.earnIcon} />
            <h4>Write a Review</h4>
            <p>Earn 50 points for every verified product review.</p>
          </div>
          <div className={styles.earnCard}>
            <FiGift className={styles.earnIcon} />
            <h4>Refer a Friend</h4>
            <p>Get 500 points when your friend makes their first purchase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
