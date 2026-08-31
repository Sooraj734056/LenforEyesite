'use client';
import Link from 'next/link';

export default function FrameSizeGuidePage() {
  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '1rem' }}>
        Frame Size Guide 👓
      </h1>
      <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
        Finding the right frame size ensures maximum comfort, aesthetic balance, and optimal lens alignment for your vision.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0284C7', marginBottom: '0.5rem' }}>Small / Narrow</h3>
          <p style={{ fontSize: '0.95rem', color: '#334155' }}>Lens Width: <strong>48mm - 51mm</strong></p>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.5rem' }}>Ideal for narrower face shapes and petite features.</p>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #0284C7' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0284C7', marginBottom: '0.5rem' }}>Medium (Standard)</h3>
          <p style={{ fontSize: '0.95rem', color: '#334155' }}>Lens Width: <strong>52mm - 55mm</strong></p>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.5rem' }}>Fits approximately 80% of adults perfectly.</p>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0284C7', marginBottom: '0.5rem' }}>Large / Wide</h3>
          <p style={{ fontSize: '0.95rem', color: '#334155' }}>Lens Width: <strong>56mm+</strong></p>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.5rem' }}>Designed for broader faces or oversized frame styles.</p>
        </div>
      </div>

      <div style={{ background: '#F0F9FF', borderLeft: '4px solid #0284C7', padding: '1.5rem', borderRadius: '4px', marginBottom: '2.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0369A1', marginBottom: '0.5rem' }}>💡 How to check your current frame size:</h4>
        <p style={{ fontSize: '0.95rem', color: '#0C4A6E', lineHeight: '1.6' }}>
          Look at the inside of your current eyeglass temple arm. You will see numbers printed like <strong>52-18-140</strong> (Lens Width - Bridge Width - Temple Length).
        </p>
      </div>

      <Link href="/products" className="btn btn-primary">
        Browse Collection
      </Link>
    </div>
  );
}
