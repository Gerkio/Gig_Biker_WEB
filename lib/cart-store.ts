"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./types";
import { track } from "./track";

export interface CartItem {
  id: string; // `${productId}__${variant}`
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  variant?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  /** Controla la apertura del panel lateral (Sheet). */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variant?: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  // Selectores derivados
  totalItems: () => number;
  subtotal: () => number;
}

const lineId = (productId: string, variant?: string) =>
  `${productId}__${variant ?? "default"}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, variant, quantity = 1) => {
        const id = lineId(product._id, variant);
        const items = [...get().items];
        const existing = items.find((i) => i.id === id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({
            id,
            productId: product._id,
            slug: product.slug,
            title: product.title,
            image: product.image,
            price: product.price,
            variant,
            quantity,
          });
        }
        set({ items, isOpen: true });
        track({ type: "add_to_cart", slug: product.slug, title: product.title });
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
            ),
        }),

      clear: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: "bigbiker-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
