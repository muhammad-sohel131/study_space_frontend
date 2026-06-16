import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  coverImageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.bookId === item.bookId);
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.bookId === item.bookId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (bookId) => set((state) => ({
        items: state.items.filter(i => i.bookId !== bookId)
      })),
      updateQuantity: (bookId, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.bookId === bookId ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
