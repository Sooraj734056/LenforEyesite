export const metadata = { title: 'Privacy Policy | Lens For Eyesight' };
export default function PrivacyPage() {
  return (
    <div className="container-sm" style={{ padding: '48px 24px 80px' }}>
      <h1 style={{ marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--gray-mid)', marginBottom: 40 }}>Last updated: April 2024</p>
      {[
        { title: '1. Information We Collect', content: 'We collect your name, email address, phone number, delivery addresses, prescription information, and payment details when you make a purchase or register on our platform. We also collect browsing data through cookies to improve your experience.' },
        { title: '2. How We Use Your Information', content: 'Your information is used to process orders, verify prescriptions, provide customer support, send order updates, and improve our services. We may send promotional emails with your consent, which you can unsubscribe from at any time.' },
        { title: '3. Prescription Data', content: 'Prescription data (SPH, CYL, AXIS, ADD values) is stored securely and used solely for lens manufacturing. Uploaded prescription photos are stored on encrypted servers and deleted after order completion, unless you save them to your profile.' },
        { title: '4. Data Sharing', content: 'We do not sell your personal data. We share data only with: payment processors (Razorpay), courier services for delivery, lens manufacturing labs (prescription data only), and cloud storage providers (Cloudinary/AWS).' },
        { title: '5. Data Security', content: 'All data is transmitted over HTTPS. Passwords are hashed using bcrypt. Payment data is never stored on our servers — it is handled entirely by Razorpay\'s PCI-compliant infrastructure.' },
        { title: '6. Cookies', content: 'We use essential cookies for authentication and cart persistence. Analytics cookies help us understand usage patterns. You can disable cookies in your browser settings, though some features may not work correctly.' },
        { title: '7. Your Rights', content: 'You have the right to access, correct, or delete your personal data. Contact us at privacy@lensforeyesight.com to exercise these rights. We will respond within 30 days.' },
        { title: '8. Contact', content: 'For privacy concerns, email us at privacy@lensforeyesight.com or write to: Lens For Eyesight, Shop 14, Raja Park Main Road, Jaipur - 302004.' },
      ].map(s => (
        <section key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{s.title}</h2>
          <p style={{ lineHeight: 1.8 }}>{s.content}</p>
        </section>
      ))}
    </div>
  );
}
