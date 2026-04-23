export const metadata = { title: 'How to Read Your Prescription | Lens For Eyesight' };
export default function PrescriptionGuidePage() {
  return (
    <div className="container-sm" style={{ padding: '48px 24px 80px' }}>
      <h1 style={{ marginBottom: 8 }}>How to Read Your Eye Prescription</h1>
      <p style={{ color: 'var(--gray-mid)', marginBottom: 40 }}>A simple guide to understanding your prescription card from your doctor</p>

      {/* Example Prescription Card */}
      <div style={{ background: 'white', border: '2px solid var(--primary)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 40 }}>
        <h2 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--primary)' }}>📋 Sample Prescription Card</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead><tr style={{ background: 'var(--off-white)' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Eye</th>
            <th style={{ padding: '8px 12px' }}>SPH</th>
            <th style={{ padding: '8px 12px' }}>CYL</th>
            <th style={{ padding: '8px 12px' }}>AXIS</th>
            <th style={{ padding: '8px 12px' }}>ADD</th>
          </tr></thead>
          <tbody>
            <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>Right (OD)</td><td style={{ textAlign: 'center', padding: 8 }}>-2.00</td><td style={{ textAlign: 'center', padding: 8 }}>-0.75</td><td style={{ textAlign: 'center', padding: 8 }}>90</td><td style={{ textAlign: 'center', padding: 8 }}>+1.50</td></tr>
            <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>Left (OS)</td><td style={{ textAlign: 'center', padding: 8 }}>-1.75</td><td style={{ textAlign: 'center', padding: 8 }}>-0.50</td><td style={{ textAlign: 'center', padding: 8 }}>85</td><td style={{ textAlign: 'center', padding: 8 }}>+1.50</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--gray-mid)' }}>PD (Pupillary Distance): 64mm</p>
      </div>

      {[
        { term: 'SPH (Sphere)', icon: '🔵', desc: 'The main power of your lens. Negative (-) means short-sighted (myopia). Positive (+) means long-sighted (hyperopia). Higher the number = stronger the prescription.' },
        { term: 'CYL (Cylinder)', icon: '⚪', desc: 'Corrects astigmatism (irregular cornea shape). Usually negative. If blank or "DS", you don\'t have astigmatism.' },
        { term: 'AXIS', icon: '🔄', desc: 'The angle (0–180°) of the cylinder correction. Only relevant if you have a CYL value.' },
        { term: 'ADD (Addition)', icon: '🔭', desc: 'The extra power added for reading (near vision). Usually positive (+). Needed for bifocal or progressive lenses. Age 40+ typically need this.' },
        { term: 'PD (Pupillary Distance)', icon: '📏', desc: 'The distance between your pupils in millimetres. Critical for correct lens alignment. Average adult: 60–68mm. Can be measured by an optometrist or with our app.' },
        { term: 'OD / OS', icon: '👁️', desc: 'OD = Oculus Dexter = Right Eye. OS = Oculus Sinister = Left Eye. OU = Both eyes.' },
      ].map(item => (
        <section key={item.term} style={{ marginBottom: 24, padding: 20, background: 'var(--off-white)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 16 }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{item.term}</h3>
            <p style={{ lineHeight: 1.7, color: 'var(--gray)' }}>{item.desc}</p>
          </div>
        </section>
      ))}

      <div style={{ marginTop: 40, padding: 24, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <h3 style={{ color: 'white', marginBottom: 8 }}>Still confused? Book a Free Eye Test!</h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>Our certified optometrist will explain your prescription in detail — at your home, free of charge.</p>
        <a href="/contact#appointment" style={{ display: 'inline-flex', padding: '12px 28px', background: 'white', color: 'var(--primary)', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none' }}>
          Book Free Eye Test
        </a>
      </div>
    </div>
  );
}
