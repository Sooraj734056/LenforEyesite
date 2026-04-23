'use client';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';
import styles from './page.module.css';

export default function AccountPage() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="container section flex-center" style={{ minHeight: '60vh', flexDirection: 'column' }}>
        <div className={styles.emptyIcon} style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h2>Please login to view your account</h2>
        <Link href="/login" className="btn btn-primary" style={{ marginTop: '24px' }}>Login to Account</Link>
      </div>
    );
  }

  const ACTIONS = [
    { title: 'My Orders', desc: 'Track, return, or buy again', icon: '📦', href: '/account/orders' },
    { title: 'Prescriptions', desc: 'Manage eye test results', icon: '📋', href: '/account/prescriptions' },
    { title: 'Wishlist', desc: 'Your favorite products', icon: '❤️', href: '/account/wishlist' },
    { title: 'Home Eye Test', desc: 'Book a slot in Jaipur', icon: '🏠', href: '/contact#appointment', special: 'blue' },
    { title: 'Active Coupons', desc: 'Exclusive offers for you', icon: '🎟️', special: 'pink' },
    { title: 'Settings', desc: 'Security & Preferences', icon: '⚙️', href: '/account/settings' },
  ];

  return (
    <div className={`container ${styles.accountContainer}`}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          <h1>Namaste, {user.name.split(' ')[0]}!</h1>
          <p>Vision check-up due? Your eye health is our priority.</p>
        </div>
        <div className={styles.walletCard}>
          <div className={styles.walletLabel}>Vision Wallet</div>
          <div className={styles.walletAmount}>
            {user.loyaltyPoints || 0}
            <span className={styles.walletPoints}>Points</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className={styles.dashboardGrid}>
        {ACTIONS.map((action, idx) => (
          <Link 
            key={idx} 
            href={action.href || '#'} 
            className={styles.actionCard}
            style={action.special === 'blue' ? { background: 'linear-gradient(135deg, #fff, #f0f7ff)' } : 
                   action.special === 'pink' ? { background: 'linear-gradient(135deg, #fff, #fff0f7)' } : {}}
          >
            <div className={styles.cardIcon}>{action.icon}</div>
            <h4 className={styles.cardTitle}>{action.title}</h4>
            <p className={styles.cardDesc}>{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Profile Info Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.userInfo}>
            <h3>Account Security</h3>
            <p>{user.email}</p>
          </div>
          <div className={styles.profileActions}>
            <button className="btn btn-outline btn-sm">Edit Profile</button>
            <button onClick={logout} className="btn btn-dark btn-sm">🚪 Logout</button>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>Member Since</label>
            <div className={styles.infoValue}>{new Date(user.createdAt || Date.now()).getFullYear()}</div>
          </div>
          <div className={styles.infoItem}>
            <label>Current Status</label>
            <div className={styles.tierBadge}>
              ✨ Gold Member
            </div>
          </div>
          <div className={styles.infoItem}>
            <label>Contact Number</label>
            <div className={styles.infoValue}>{user.phone || 'Not provided'}</div>
          </div>
          <div className={styles.infoItem}>
            <label>Primary Location</label>
            <div className={styles.infoValue}>Jaipur, India</div>
          </div>
        </div>
      </div>
    </div>
  );
}

