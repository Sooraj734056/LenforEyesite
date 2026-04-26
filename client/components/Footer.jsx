'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Footer.module.css';

const footerLinks = {
  'Eyewear': [
    { label: 'Eyeglasses', href: '/products?category=Eyeglasses' },
    { label: 'Sunglasses', href: '/products?category=Sunglasses' },
    { label: 'Computer Glasses', href: '/products?category=Computer+Glasses' },
    { label: 'Contact Lenses', href: '/products?category=Contact+Lenses' },
    { label: 'Reading Glasses', href: '/products?category=Reading+Glasses' },
    { label: 'Kids Glasses', href: '/products?category=Kids' },
  ],
  'Brands': [
    { label: 'Ray-Ban', href: '/products?brand=Ray-Ban' },
    { label: 'Zeiss', href: '/products?brand=Zeiss' },
    { label: 'Crizal', href: '/products?brand=Crizal' },
    { label: 'Vogue', href: '/products?brand=Vogue' },
    { label: 'Fastrack', href: '/products?brand=Fastrack' },
    { label: 'Vincent Chase', href: '/products?brand=Vincent+Chase' },
  ],
  'Services': [
    { label: 'Home Eye Test', href: '/contact#appointment' },
    { label: 'Frame Size Guide', href: '/guides/frame-size' },
    { label: 'How to Read Prescription', href: '/guides/prescription' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Refund Policy', href: '/legal/refund' },
  ]
};

import { FiMail, FiPhone, FiMapPin, FiClock, FiInstagram, FiFacebook, FiYoutube, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.logo}>
                <div className={styles.logoIcon}>
                  <img src="/img/logo.png" alt="Logo" width="45" height="45" />
                </div>
                <div className={styles.logoText}>
                  <span className={styles.logoMain}>LENS FOR EYESIGHT</span>
                  <span className={styles.logoSub}>ESTD. 2018 • JAIPUR</span>
                </div>
              </Link>
              <p className={styles.brandDesc}>
                Experience premium eyewear in Jaipur. We combine world-class lens technology with iconic frame styles to give you perfect vision and a stunning look.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialBtn} aria-label="Instagram"><FiInstagram /></a>
                <a href="#" className={styles.socialBtn} aria-label="Facebook"><FiFacebook /></a>
                <a href="#" className={styles.socialBtn} aria-label="WhatsApp"><FaWhatsapp /></a>
                <a href="#" className={styles.socialBtn} aria-label="YouTube"><FiYoutube /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.linksGroup}>
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className={styles.linkCol}>
                  <h4 className={styles.colTitle}>{title}</h4>
                  <ul className={styles.linkList}>
                    {links.map(link => (
                      <li key={link.href}>
                        <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact Info Column */}
            <div className={styles.contactCol}>
              <h4 className={styles.colTitle}>Get In Touch</h4>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><FiMapPin /></div>
                  <p>Shop 14, Raja Park Main Road,<br />Jaipur, Rajasthan - 302004</p>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><FiPhone /></div>
                  <p><a href="tel:+919999999999">+91 99999 99999</a></p>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><FiMail /></div>
                  <p><a href="mailto:info@lensforeyesight.com">info@lensforeyesight.com</a></p>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><FiClock /></div>
                  <p>Mon – Sat: 10:00 AM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <div className={styles.copyright}>
              © {new Date().getFullYear()} <span>Lens For Eyesight</span>. All rights reserved. 
              <br className={styles.mobileBreak} /> Built for Excellence in Jaipur.
            </div>
            <div className={styles.legal}>
              <Link href="/legal/terms">Terms</Link>
              <span className={styles.dot}>•</span>
              <Link href="/legal/privacy">Privacy</Link>
              <span className={styles.dot}>•</span>
              <Link href="/legal/refund">Refunds</Link>
            </div>
            <div className={styles.paymentBadges}>
              <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
              <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
              <img src="https://img.icons8.com/color/48/google-pay.png" alt="GPay" />
              <img src="https://img.icons8.com/color/48/upi.png" alt="UPI" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
