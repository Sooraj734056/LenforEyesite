'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';
import styles from './page.module.css';



export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      router.push('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        {/* Logo */}
        <div className={styles.authLogo}>
          <svg viewBox="0 0 40 40" fill="none" width="48" height="48">
            <circle cx="12" cy="20" r="9" stroke="#00AEEF" strokeWidth="3" fill="none"/>
            <circle cx="28" cy="20" r="9" stroke="#00AEEF" strokeWidth="3" fill="none"/>
            <line x1="21" y1="20" x2="19" y2="20" stroke="#00AEEF" strokeWidth="3"/>
          </svg>
          <div className={styles.authLogoText}>LENS FOR EYESIGHT</div>
        </div>

        <h1 className={styles.authTitle}>Welcome Back</h1>
        <p className={styles.authSub}>Sign in to your account</p>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" placeholder="you@example.com" required
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="form-input" id="login-email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" placeholder="Enter your password" required
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="form-input" id="login-password" />
          </div>

          <div className={styles.forgotWrap}>
            <Link href="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading} id="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.authDivider}>
          <span>Demo Credentials</span>
        </div>
        <div className={styles.demoCards}>
          <div className={styles.demoCard} onClick={() => setForm({ email: 'demo@example.com', password: 'Demo@123' })}>
            <div className={styles.demoLabel}>👤 Customer</div>
            <div className={styles.demoEmail}>demo@example.com</div>
            <div className={styles.demoPass}>Demo@123</div>
          </div>
          <div className={styles.demoCard} onClick={() => setForm({ email: 'admin@lensforeyesight.com', password: 'Admin@123' })}>
            <div className={styles.demoLabel}>⚙️ Admin</div>
            <div className={styles.demoEmail}>admin@lensforeyesight.com</div>
            <div className={styles.demoPass}>Admin@123</div>
          </div>
        </div>

        <p className={styles.authSwitch}>
          Don't have an account? <Link href="/register" className={styles.authLink}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}
