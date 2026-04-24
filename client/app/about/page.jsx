import { FaGlasses, FaSmile, FaCalendarAlt, FaStar } from 'react-icons/fa';
export const metadata = { title: 'About Us | Lens For Eyesight — Jaipur' };

export default function AboutPage() {
  return (
    <div>
      <section style={{ background: 'var(--gradient-hero)', padding: '64px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>Our Story</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Bringing clear vision and premium eyewear to Jaipur since 2018
          </p>
        </div>
      </section>

      <div className="container">
        <section style={{ padding: '64px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: 16 }}>From Raja Park to Every Door in Jaipur</h2>
            <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
              <strong>Lens For Eyesight</strong> was founded in 2018 with a simple mission: make premium eyewear accessible to everyone in Jaipur without the overwhelming experience of traditional optical stores.
            </p>
            <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
              Our flagship store in <strong>Raja Park</strong> has served over <strong>10,000 happy customers</strong> across Jaipur. We carry premium brands like Zeiss, Crizal, Ray-Ban, and Vogue, along with affordable options for every budget.
            </p>
            <p style={{ lineHeight: 1.8 }}>
              In 2022, we launched our <strong>Home Eye Test Service</strong> — bringing certified optometrists to your doorstep, completely free of charge. Because we believe good vision shouldn't require a hospital visit.
            </p>
          </div>
          <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-xl)', padding: 48, textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16, color: 'white' }}><FaGlasses /></div>
            <h3 style={{ color: 'white', marginBottom: 8 }}>Our Mission</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
              To make quality eye care and premium eyewear accessible to every family in Jaipur, backed by expert guidance and honest pricing.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: '0 0 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { num: '10,000+', label: 'Happy Customers', icon: <FaSmile /> },
              { num: '500+', label: 'Frame Styles', icon: <FaGlasses /> },
              { num: '6+', label: 'Years of Experience', icon: <FaCalendarAlt /> },
              { num: '100%', label: 'Customer Satisfaction', icon: <FaStar /> },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8, color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-mid)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section style={{ padding: '0 0 64px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Our Brands</h2>
          <p style={{ textAlign: 'center', color: 'var(--gray-mid)', marginBottom: 40 }}>Authorized dealers for India's most trusted eyewear brands</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {['Zeiss', 'Crizal', 'Ray-Ban', 'Vogue', 'Fastrack', 'Vincent Chase', 'John Jacobs', 'Lenskart'].map(b => (
              <div key={b} style={{ padding: '12px 24px', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem' }}>
                {b}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
