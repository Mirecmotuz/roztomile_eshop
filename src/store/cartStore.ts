import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  addItem: (product: Product, selectedVariant?: string) => void;
  removeItem: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, selectedVariant) => {
        const existing = get().items.find(
          (i) => i.product.id === product.id && i.selectedVariant === selectedVariant,
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.product.id === product.id && i.selectedVariant === selectedVariant
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                product,
                quantity: 1,
                ...(selectedVariant ? { selectedVariant } : {}),
              },
            ],
          }));
        }
        set({ isOpen: true });
      },

      removeItem: (productId, selectedVariant) =>
        set((state) => ({
          items: state.items.filter((i) =>
            selectedVariant != null
              ? !(i.product.id === productId && i.selectedVariant === selectedVariant)
              : i.product.id !== productId,
          ),
        })),

      updateQuantity: (productId, quantity, selectedVariant) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedVariant);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            selectedVariant != null
              ? i.product.id === productId && i.selectedVariant === selectedVariant
                ? { ...i, quantity }
                : i
              : i.product.id === productId
                ? { ...i, quantity }
                : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'roztomile-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
