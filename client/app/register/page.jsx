'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    const result = await register(form.name, form.email, form.phone, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to Lens For Eyesight 🎉');
      router.push('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard} style={{ maxWidth: 520 }}>
        <div className={styles.authLogo}>
          <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
            <circle cx="12" cy="20" r="9" stroke="#00AEEF" strokeWidth="3" fill="none"/>
            <circle cx="28" cy="20" r="9" stroke="#00AEEF" strokeWidth="3" fill="none"/>
            <line x1="21" y1="20" x2="19" y2="20" stroke="#00AEEF" strokeWidth="3"/>
          </svg>
          <div className={styles.authLogoText}>LENS FOR EYESIGHT</div>
        </div>
        <h1 className={styles.authTitle}>Create Account</h1>
        <p className={styles.authSub}>Join thousands of satisfied customers</p>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" placeholder="Your full name" required
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="form-input" id="reg-name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" placeholder="you@example.com" required
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="form-input" id="reg-email" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" placeholder="+91 XXXXX XXXXX"
              value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="form-input" id="reg-phone" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" placeholder="Min. 6 characters" required minLength="6"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="form-input" id="reg-password" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" placeholder="Re-enter password" required
              value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              className="form-input" id="reg-confirm" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading} id="register-submit">
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>
        <p className={styles.authSwitch}>
          Already have an account? <Link href="/login" className={styles.authLink}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
