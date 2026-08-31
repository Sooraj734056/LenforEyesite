'use client';

export default function TermsOfServicePage() {
  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '1rem' }}>
        Terms of Service
      </h1>
      <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Last Updated: August 2026
      </p>

      <section style={{ marginBottom: '2rem', lineHeight: '1.7', color: '#334155' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.5rem' }}>
          1. Overview
        </h2>
        <p>
          Welcome to Lens For Eyesight. By visiting or shopping at our website, you agree to comply with and be bound by the following terms and conditions.
        </p>
      </section>

      <section style={{ marginBottom: '2rem', lineHeight: '1.7', color: '#334155' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.5rem' }}>
          2. Eyewear & Prescription Verification
        </h2>
        <p>
          Customers providing optical prescriptions are responsible for uploading valid, unexpired prescriptions issued by certified optometrists or ophthalmologists.
        </p>
      </section>

      <section style={{ marginBottom: '2rem', lineHeight: '1.7', color: '#334155' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.5rem' }}>
          3. Store Location & Appointments
        </h2>
        <p>
          Home Eye Tests and appointments booked through our platform apply to specified service zones in Jaipur, Rajasthan.
        </p>
      </section>

      <section style={{ marginBottom: '2rem', lineHeight: '1.7', color: '#334155' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.5rem' }}>
          4. Contact Us
        </h2>
        <p>
          For any questions regarding these terms, please contact us at info@lensforeyesight.com.
        </p>
      </section>
    </div>
  );
}
