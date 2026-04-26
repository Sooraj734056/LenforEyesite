import ContactForm from '@/components/ContactForm';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaCalendarAlt } from 'react-icons/fa';
import styles from './page.module.css';

export const metadata = {
  title: 'Contact Us & Book Eye Test | Lens For Eyesight',
  description: 'Contact Lens For Eyesight in Raja Park, Jaipur. Book a free home eye test, WhatsApp us, or visit our store.'
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We're here to help. Visit us, call us, or book a free home eye test in Jaipur.</p>
        </div>
      </section>

      <div className="container">
        {/* Info Cards */}
        <section className={styles.infoGrid}>
          {[
            { icon: <FaMapMarkerAlt />, title: 'Visit Our Store', details: ['Shop 14, Raja Park Main Road', 'Jaipur - 302004, Rajasthan', 'Near Kesariya Restaurant'] },
            { icon: <FaPhoneAlt />, title: 'Call / WhatsApp', details: ['+91 9772066955', '+91 88888 88888', 'Available 10 AM – 8 PM'] },
            { icon: <FaEnvelope />, title: 'Email Us', details: ['info@lensforeyesight.com', 'orders@lensforeyesight.com', 'Reply within 24 hours'] },
            { icon: <FaClock />, title: 'Store Hours', details: ['Mon – Sat: 10:00 AM – 8:00 PM', 'Sunday: 11:00 AM – 6:00 PM', 'Holidays: Check WhatsApp'] },
          ].map(card => (
            <div key={card.title} className={styles.infoCard}>
              <div className={styles.cardIcon}>{card.icon}</div>
              <h3>{card.title}</h3>
              {card.details.map(d => <p key={d}>{d}</p>)}
            </div>
          ))}
        </section>

        {/* Appointment Booking + Map */}
        <section className="section" id="appointment" style={{ paddingTop: '40px' }}>
          <div className={styles.contactGrid}>
            {/* Booking Form */}
            <div className={styles.bookingCard}>
              <h2><FaCalendarAlt /> Book Free Home Eye Test</h2>
              <p>Our certified optometrist will visit your home in Jaipur. 100% free of charge!</p>
              <ContactForm />
            </div>

            {/* Map */}
            <div className={styles.mapWrap}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzQ0LjYiTiA3NcKwNDcnMTQuMyJF!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lens For Eyesight Location"
                className={styles.map}
              />
              <div className={styles.mapOverlay}>
                <div className={styles.mapInfo}>
                  <strong><FaMapMarkerAlt /> Lens For Eyesight</strong>
                  <span>Raja Park, Jaipur</span>
                  <a href="https://maps.google.com/?q=Raja+Park+Jaipur" target="_blank" rel="noreferrer" className={styles.mapLink}>
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section className={styles.whatsappSection}>
          <a href="https://wa.me/919772066955?text=Hi! I want to know more about Lens For Eyesight." className={styles.whatsappBtn} target="_blank" rel="noreferrer" id="whatsapp-contact">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <div>
              <div className={styles.waBtnTitle}>Chat on WhatsApp</div>
              <div className={styles.waBtnSub}>Typically replies within minutes</div>
            </div>
          </a>
        </section>
      </div>
    </div>
  );
}
