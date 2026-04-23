'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, lens = null, quantity = 1) => {
        const items = get().items;
        const existingIdx = items.findIndex(
          i => i.productId === product._id && i.variantColor === variant?.color && !lens
        );
        if (existingIdx > -1 && !lens) {
          const updated = [...items];
          updated[existingIdx].quantity += quantity;
          set({ items: updated });
        } else {
          set({
            items: [...items, {
              id: `${product._id}-${variant?.color || 'default'}-${Date.now()}`,
              productId: product._id,
              productName: product.name,
              brand: product.brand,
              image: variant?.images?.[0] || '',
              variantColor: variant?.color || 'Default',
              price: product.price,
              quantity,
              lens,
            }]
          });
        }
      },

      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),

      updateQty: (id, quantity) => {
        if (quantity < 1) { get().removeItem(id); return; }
        set({ items: get().items.map(i => i.id === id ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        const items = get().items;
        return items.reduce((acc, item) => {
          const lensPrice = item.lens?.price || 0;
          return acc + (item.price + lensPrice) * item.quantity;
        }, 0);
      },

      getCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: 'lens-cart', version: 1 }
  )
);

export default useCartStore;
