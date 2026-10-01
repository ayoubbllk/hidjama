"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { products, type Product } from "@/lib/products";
import { MIN_ORDER_QTY, formatPrice, useCart } from "@/lib/cart";

export default function Products() {
  return (
    <section id="products" className="py-20 bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-brand-green-light font-bold tracking-wider text-sm mb-2 block">
            منتجاتنا
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            اختر المقاس وأضفه إلى السلة
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            حدّد الكمية من البطاقة. الحد الأدنى للطلب هو {MIN_ORDER_QTY} قطعة في المجموع.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { quantities, setQuantity } = useCart();
  const inCart = quantities[product.id] ?? 0;
  const [draft, setDraft] = useState(inCart > 0 ? String(inCart) : "");
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setDraft(inCart > 0 ? String(inCart) : "");
  }, [inCart]);

  const draftQty = parseInt(draft || "0", 10) || 0;
  const changed = draftQty !== inCart;

  const changeDraft = (next: number) => {
    const safe = Math.max(0, next);
    setDraft(safe === 0 ? "" : String(safe));
    setJustAdded(false);
  };

  const addToCart = () => {
    if (draftQty <= 0) return;
    setQuantity(product.id, draftQty);
    setJustAdded(true);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-brand-green/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(5,150,105,0.1)] flex flex-col">
      <div className="relative h-64 w-full bg-white p-4">
        <Image
          src={product.image}
          alt={`${product.name} ${product.subtitle}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {inCart > 0 && (
          <span className="absolute top-3 start-3 z-10 bg-neutral-950/90 text-amber-300 text-xs font-black px-3 py-1.5 rounded-full border border-amber-400/40">
            في السلة: {inCart}
          </span>
        )}
      </div>

      <div className="bg-amber-400 text-neutral-950 px-5 py-3 flex items-center justify-between gap-3">
        <span className="text-sm font-bold">السعر</span>
        <span className="text-3xl font-black leading-none tracking-tight">
          {product.price > 0 ? formatPrice(product.price) : "حسب الطلب"}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
        <p className="text-neutral-300 font-bold text-lg mb-4">{product.subtitle}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {product.refs.map((ref) => (
            <span
              key={ref}
              className="min-w-8 h-8 px-2 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-300 border border-neutral-700"
            >
              {ref}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-neutral-300">الكمية</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`إنقاص كمية ${product.subtitle}`}
                onClick={() => changeDraft(draftQty - 1)}
                className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center hover:border-amber-400 hover:text-amber-300 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                aria-label={`كمية ${product.name} ${product.subtitle}`}
                className="w-16 h-10 bg-neutral-950 border border-neutral-700 rounded-xl text-center text-white font-black focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value.replace(/[^\d]/g, ""));
                  setJustAdded(false);
                }}
              />
              <button
                type="button"
                aria-label={`زيادة كمية ${product.subtitle}`}
                onClick={() => changeDraft(draftQty + 1)}
                className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center hover:border-amber-400 hover:text-amber-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={draftQty <= 0}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors ${
              draftQty > 0
                ? "bg-brand-green hover:bg-brand-green-light text-white"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {justAdded && !changed ? (
              <>
                <Check className="w-5 h-5" />
                <span>تمت الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {inCart > 0 && changed ? "تحديث السلة" : inCart > 0 ? "في السلة" : "أضف إلى السلة"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
