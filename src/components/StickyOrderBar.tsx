"use client";

import { ShoppingBag } from "lucide-react";
import { MIN_ORDER_QTY, useCart } from "@/lib/cart";

export default function StickyOrderBar() {
  const { totalItems } = useCart();
  const ready = totalItems >= MIN_ORDER_QTY;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 z-50">
      <a
        href="#order"
        className="w-full flex items-center justify-center gap-2 bg-brand-green text-white px-4 py-3.5 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(5,150,105,0.35)]"
      >
        <ShoppingBag className="w-5 h-5" />
        {totalItems === 0
          ? "اطلب الآن"
          : ready
            ? `إتمام الطلب (${totalItems})`
            : `السلة ${totalItems} / ${MIN_ORDER_QTY}`}
      </a>
    </div>
  );
}
