'use client';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import useWishlistStore from '@/store/wishlistStore';

export default function WishlistSync() {
  const { user } = useAuthStore();
  const { setWishlist } = useWishlistStore();

  useEffect(() => {
    // If user is logged in and has a wishlist populated in the user object (from fetchMe)
    if (user && user.wishlist) {
      setWishlist(user.wishlist);
    }
  }, [user, setWishlist]);

  return null;
}
