import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  setPromo: (code: string, discount: number) => void;
  clearPromo: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,

      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);
        if (existing) {
          set({ items: items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )});
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),

      updateQuantity: (productId, qty) => {
        if (qty <= 0) { get().removeItem(productId); return; }
        set({ items: get().items.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i
        )});
      },

      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),

      setPromo: (code, discount) => set({ promoCode: code, discount }),
      clearPromo: () => set({ promoCode: null, discount: 0 }),

      getSubtotal: () => get().items.reduce((sum, i) => {
        const price = i.product.on_sale && i.product.sale_price
          ? i.product.sale_price
          : i.product.price;
        return sum + price * i.quantity;
      }, 0),

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, subtotal - get().discount);
      },
    }),
    { name: 'stoners-cart' }
  )
);
