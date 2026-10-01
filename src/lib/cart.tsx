"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { products } from "@/lib/products";

export const MIN_ORDER_QTY = 50;

type CartContextValue = {
  quantities: Record<string, number>;
  setQuantity: (id: string, qty: number) => void;
  totalItems: number;
  pricedTotal: number;
  hasUnpriced: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const setQuantity = (id: string, qty: number) => {
    const next = Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0;
    setQuantities((prev) => {
      if (next === 0) {
        if (!(id in prev)) return prev;
        const rest = { ...prev };
        delete rest[id];
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const value = useMemo<CartContextValue>(() => {
    const totalItems = products.reduce((sum, product) => sum + (quantities[product.id] ?? 0), 0);
    const pricedTotal = products.reduce(
      (sum, product) => sum + product.price * (quantities[product.id] ?? 0),
      0
    );
    const hasUnpriced = products.some(
      (product) => product.price === 0 && (quantities[product.id] ?? 0) > 0
    );
    return { quantities, setQuantity, totalItems, pricedTotal, hasUnpriced };
  }, [quantities]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within CartProvider");
  }
  return cart;
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString("fr-DZ")} دج`;
}
