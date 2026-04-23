'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminClassHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      document.body.classList.add('is-admin');
    } else {
      document.body.classList.remove('is-admin');
    }
  }, [pathname]);

  return null;
}
