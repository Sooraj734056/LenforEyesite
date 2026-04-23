export const metadata = { title: 'Refund & Cancellation Policy | Lens For Eyesight' };
export default function RefundPage() {
  return (
    <div className="container-sm" style={{ padding: '48px 24px 80px' }}>
      <h1 style={{ marginBottom: 8 }}>Refund & Cancellation Policy</h1>
      <p style={{ color: 'var(--gray-mid)', marginBottom: 40 }}>Last updated: April 2024</p>
      {[
        { title: '🔄 Returns (15-Day Policy)', content: 'Unused frames in original condition can be returned within 15 days of delivery. Items must be in original packaging with all accessories. Used or customized lenses cannot be returned unless defective.' },
        { title: '✅ Eligible for Return', content: 'Defective frames, wrong product delivered, damaged during shipping. Frames that don\'t fit (exchange only). Frames without prescription lenses.' },
        { title: '❌ Not Eligible for Return', content: 'Frames with custom prescription lenses (once made). Contact lenses (opened). Frames damaged by customer. Products purchased during special discount sales.' },
        { title: '💰 Refund Process', content: 'Approved refunds are processed within 5-7 business days to your original payment method. UPI/Wallet refunds process in 24-48 hours. Bank transfers take 5-7 days.' },
        { title: '🚫 Order Cancellation', content: 'Orders can be cancelled within 2 hours of placement. Once the prescription is verified and sent to the lab, cancellation is not possible. Contact us immediately at +91 99999 99999 to cancel.' },
        { title: '🔁 Exchange Policy', content: 'Frames can be exchanged for a different size, color, or style within 15 days. Differences in price will be charged or refunded accordingly. Exchange shipping is free.' },
        { title: '📞 How to Initiate', content: 'To initiate a return or exchange, WhatsApp us at +91 99999 99999 or email returns@lensforeyesight.com with your order number and reason. We\'ll arrange a pickup.' },
      ].map(s => (
        <section key={s.title} style={{ marginBottom: 28, padding: 20, background: 'var(--off-white)', borderRadius: 'var(--radius-md)' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 8 }}>{s.title}</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--gray)' }}>{s.content}</p>
        </section>
      ))}
    </div>
  );
}
