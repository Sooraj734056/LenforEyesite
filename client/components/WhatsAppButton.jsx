'use client';
import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const phoneNumber = '+919999999999'; // Replace with actual business number
  const message = 'Hello Lens For Eyesight, I have a query about a frame.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

  return mounted ? (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#25D366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: 9999,
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  ) : null;
}
