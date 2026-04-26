import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      setWishlist: (items) => set({ items }),

      toggleWishlist: async (product, user) => {
        const { items } = get();
        const exists = items.find((p) => p._id === product._id);
        
        // Optimistic UI update
        if (exists) {
          set({ items: items.filter((p) => p._id !== product._id) });
          toast.success('Removed from wishlist');
        } else {
          set({ items: [...items, product] });
          toast.success('Added to wishlist! ❤️');
        }

        // Backend sync if user is logged in
        if (user) {
          try {
            await axios.post(`${API}/auth/wishlist/${product._id}`, {}, { withCredentials: true });
          } catch (err) {
            console.error('Wishlist sync failed', err);
            // Revert if failed? (Optional for now to keep it smooth)
          }
        }
      },
      
      removeItem: async (productId, user) => {
        const { items } = get();
        set({ items: items.filter((p) => p._id !== productId) });
        toast.success('Removed from wishlist');

        if (user) {
          try {
            await axios.post(`${API}/auth/wishlist/${productId}`, {}, { withCredentials: true });
          } catch (_) {}
        }
      },
      
      isInWishlist: (productId) => {
        const { items } = get();
        return !!items.find((p) => p._id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'lens-wishlist',
    }
  )
);

export default useWishlistStore;
