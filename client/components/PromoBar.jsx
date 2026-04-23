'use client';
import { useState, useEffect } from 'react';
import styles from './PromoBar.module.css';

const OFFERS = [
  "🎉 FLAT 60% OFF on all premium frames! Click to shop.",
  "🏠 FREE Home Eye Test across Jaipur. Book your slot now!",
  "🎁 Buy 1 Get 1 FREE on Vincent Chase collections.",
  "💳 Extra 10% OFF on prepayments with LENSWALLET10",
];

export default function PromoBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(s => (s + 1) % OFFERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.bar}>
      <div className={styles.content} style={{ transform: `translateY(-${current * 100}%)` }}>
        {OFFERS.map((offer, i) => (
          <div key={i} className={styles.offer}>{offer}</div>
        ))}
      </div>
    </div>
  );
}
