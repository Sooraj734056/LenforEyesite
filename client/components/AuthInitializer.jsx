'use client';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export default function AuthInitializer() {
  const { fetchMe, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  return null;
}
