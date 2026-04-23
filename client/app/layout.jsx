import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

import AdminClassHandler from '@/components/AdminClassHandler';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
  title: {
    default: 'Lens For Eyesight — Premium Eyewear in Jaipur',
    template: '%s | Lens For Eyesight'
  },
  description: 'Shop premium eyeglasses, sunglasses, contact lenses & computer glasses in Jaipur. Expert eye care with home eye test service. Trusted brands like Zeiss, Crizal, Ray-Ban.',
  keywords: ['eyewear Jaipur', 'glasses online', 'contact lenses', 'Zeiss lenses', 'computer glasses', 'Lens For Eyesight', 'eye test Jaipur', 'prescription glasses'],
  openGraph: {
    title: 'Lens For Eyesight — Premium Eyewear',
    description: 'Your vision, our priority. Premium eyewear with free home eye test in Jaipur.',
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AdminClassHandler />

        <Navbar />
        <CartDrawer />
        <main className="page-content">
          {children}
        </main>
        <WhatsAppButton />
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "'Inter', sans-serif",
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
            success: {
              style: { background: '#10B981', color: '#fff' },
              iconTheme: { primary: '#fff', secondary: '#10B981' },
            },
            error: {
              style: { background: '#EF4444', color: '#fff' },
              iconTheme: { primary: '#fff', secondary: '#EF4444' },
            },
          }}
        />
      </body>
    </html>
  );
}
