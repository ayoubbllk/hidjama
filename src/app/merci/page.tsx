"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trackMetaEvent } from "@/lib/meta-pixel";

type SavedOrder = {
  name: string;
  wilaya: string;
  lines: { id?: string; label: string; qty: number; price: number }[];
  pricedTotal: number;
  hasUnpriced: boolean;
};

export default function MerciPage() {
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("hidjama-order");
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as SavedOrder;
      setOrder(saved);
      if (sessionStorage.getItem("hidjama-purchase-tracked") === "1") return;
      const numItems = saved.lines.reduce((sum, line) => sum + line.qty, 0);
      const tracked = trackMetaEvent("Purchase", {
        value: saved.pricedTotal,
        currency: "DZD",
        content_type: "product",
        content_ids: saved.lines.map((line) => line.id || line.label),
        contents: saved.lines.map((line) => ({
          id: line.id || line.label,
          quantity: line.qty,
          item_price: line.price,
        })),
        num_items: numItems,
      });
      if (tracked) sessionStorage.setItem("hidjama-purchase-tracked", "1");
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-brand-green/15 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-brand-green-light" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">شكراً لك</h1>
          <p className="text-neutral-400 text-lg leading-relaxed mb-8">
            تم استلام طلبك بنجاح. سنتواصل معك قريباً لتأكيد الطلب وتحديد مصاريف التوصيل.
          </p>

          {order && (
            <div className="text-right bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-8">
              <p className="text-white font-bold mb-1">{order.name}</p>
              <p className="text-neutral-400 text-sm mb-4">{order.wilaya}</p>
              <ul className="space-y-2 mb-4">
                {order.lines.map((line) => (
                  <li key={line.label} className="flex justify-between gap-3 text-sm">
                    <span className="text-neutral-300">{line.label}</span>
                    <span className="text-white font-bold shrink-0">× {line.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-neutral-800 pt-3 flex justify-between items-center">
                <span className="text-neutral-400">المجموع</span>
                <span className="text-brand-green-light font-black">
                  {order.pricedTotal} دج{order.hasUnpriced ? " + حسب الطلب" : ""}
                </span>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-green-light text-white px-8 py-3.5 rounded-xl font-bold transition-colors"
          >
            العودة إلى الرئيسية
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
