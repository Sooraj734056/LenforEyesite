'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from '../login/page.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Password reset link sent if account exists.');
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <svg viewBox="0 0 40 40" fill="none" width="48" height="48">
            <circle cx="12" cy="20" r="9" stroke="#00AEEF" strokeWidth="3" fill="none"/>
            <circle cx="28" cy="20" r="9" stroke="#00AEEF" strokeWidth="3" fill="none"/>
            <line x1="21" y1="20" x2="19" y2="20" stroke="#00AEEF" strokeWidth="3"/>
          </svg>
          <div className={styles.authLogoText}>LENS FOR EYESIGHT</div>
        </div>

        <h1 className={styles.authTitle}>Forgot Password?</h1>
        <p className={styles.authSub}>Enter your email to receive password reset instructions.</p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ color: '#10B981', marginBottom: '1.5rem', fontWeight: '500' }}>
              If an account is associated with {email}, you will receive a reset email shortly.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ width: '100%', display: 'inline-block' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send Reset Link
            </button>
          </form>
        )}

        <p className={styles.authSwitch} style={{ marginTop: '1.5rem' }}>
          Remembered your password? <Link href="/login" className={styles.authLink}>Sign In →</Link>
        </p>
      </div>
    </div>
  );
}
