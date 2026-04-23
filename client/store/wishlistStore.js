import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.find((p) => p._id === product._id);
        
        if (exists) {
          set({ items: items.filter((p) => p._id !== product._id) });
          toast.success('Removed from wishlist');
        } else {
          set({ items: [...items, product] });
          toast.success('Added to wishlist! ❤️');
        }
      },
      
      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter((p) => p._id !== productId) });
        toast.success('Removed from wishlist');
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
