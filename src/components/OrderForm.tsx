"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, ShieldCheck, Truck, Package, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { products } from "@/lib/products";
import { MIN_ORDER_QTY, formatPrice, useCart } from "@/lib/cart";

const wilayas = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
  "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
  "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة",
  "وهران", "البيض", "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تسمسيلت", "الوادي", "خنشلة",
  "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية", "غليزان", "تيميمون", "برج باجي مختار",
  "أولاد جلال", "بني عباس", "إن صالح", "إن قزام", "تقرت", "جانت", "المغير", "المنيعة"
];

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyROmMgNfPLWgG_g4P9CVDX0mFcENcEabnkw9WnhOcOpCx7aTFUwD_c7L52A6PxAUoi/exec";

export default function OrderForm() {
  const router = useRouter();
  const { quantities, setQuantity, totalItems, pricedTotal, hasUnpriced } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    wilaya: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qtyError, setQtyError] = useState("");

  const selected = products.filter((product) => (quantities[product.id] ?? 0) > 0);
  const remaining = Math.max(0, MIN_ORDER_QTY - totalItems);
  const canSubmit = totalItems >= MIN_ORDER_QTY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setQtyError(
        totalItems === 0
          ? "أضف منتجات إلى السلة من البطاقات أعلاه."
          : `الحد الأدنى للطلب هو ${MIN_ORDER_QTY} قطعة في المجموع. لديك حالياً ${totalItems}.`
      );
      return;
    }

    setQtyError("");
    setIsSubmitting(true);

    const orderDetails = selected
      .map((product) => {
        const qty = quantities[product.id] ?? 0;
        const lineTotal = product.price > 0 ? formatPrice(product.price * qty) : "حسب الطلب";
        return `- ${product.name} (${product.subtitle}): ${qty} (المجموع: ${lineTotal})`;
      })
      .join("\n");

    const payload = {
      name: formData.name,
      phone: formData.phone,
      wilaya: formData.wilaya,
      orderDetails,
      totalItems,
      totalPrice: hasUnpriced ? `${pricedTotal} + حسب الطلب` : pricedTotal,
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      sessionStorage.setItem(
        "hidjama-order",
        JSON.stringify({
          name: formData.name,
          wilaya: formData.wilaya,
          lines: selected.map((product) => ({
            label: `${product.name} — ${product.subtitle}`,
            qty: quantities[product.id] ?? 0,
            price: product.price,
          })),
          pricedTotal,
          hasUnpriced,
        })
      );

      router.push("/merci");
    } catch {
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-20 bg-neutral-900 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3">ملخص طلبك</h2>
          <p className="text-neutral-400 text-lg">
            راجع المنتجات والسعر، عدّل الكميات إن لزم، ثم أدخل معلوماتك. الحد الأدنى {MIN_ORDER_QTY} قطعة.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            {selected.length === 0 ? (
              <div className="text-center py-10">
                <Package className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                <p className="text-white font-bold text-lg mb-2">السلة فارغة</p>
                <p className="text-neutral-400 mb-6">أضف المنتجات من البطاقات أعلاه.</p>
                <a
                  href="#products"
                  className="inline-flex items-center justify-center bg-brand-green text-white px-6 py-3 rounded-xl font-bold"
                >
                  شاهد المنتجات
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {selected.map((product) => {
                  const qty = quantities[product.id] ?? 0;
                  const lineTotal = product.price * qty;
                  return (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-white font-bold text-sm truncate">{product.name}</h3>
                          <p className="text-neutral-400 text-xs">{product.subtitle}</p>
                          <p className="text-amber-300 font-black text-sm mt-1">
                            {product.price > 0 ? formatPrice(product.price) : "حسب الطلب"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`إنقاص ${product.subtitle}`}
                            onClick={() => setQuantity(product.id, qty - 1)}
                            className="w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-700 text-white flex items-center justify-center hover:border-amber-400"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            aria-label={`كمية ${product.name}`}
                            className="w-16 h-9 bg-neutral-950 border border-neutral-700 rounded-lg text-center text-white font-black focus:outline-none focus:border-amber-400"
                            value={String(qty)}
                            onChange={(event) => {
                              const next = parseInt(event.target.value.replace(/[^\d]/g, "") || "0", 10);
                              setQuantity(product.id, Number.isFinite(next) ? next : 0);
                            }}
                          />
                          <button
                            type="button"
                            aria-label={`زيادة ${product.subtitle}`}
                            onClick={() => setQuantity(product.id, qty + 1)}
                            className="w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-700 text-white flex items-center justify-center hover:border-amber-400"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-left min-w-24">
                          <p className="text-amber-300 font-black">
                            {product.price > 0 ? formatPrice(lineTotal) : "حسب الطلب"}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`حذف ${product.subtitle}`}
                          onClick={() => setQuantity(product.id, 0)}
                          className="w-9 h-9 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 mt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-300 font-bold">الكمية الإجمالية</span>
                <span className={`font-black text-lg ${canSubmit ? "text-amber-300" : "text-white"}`}>
                  {totalItems} / {MIN_ORDER_QTY}
                </span>
              </div>
              <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${canSubmit ? "bg-amber-400" : "bg-amber-400/70"}`}
                  style={{ width: `${Math.min(100, (totalItems / MIN_ORDER_QTY) * 100)}%` }}
                />
              </div>
              <p className={`text-sm font-bold mb-4 ${canSubmit ? "text-amber-300" : "text-neutral-400"}`}>
                {canSubmit
                  ? "الكمية كافية لتأكيد الطلب"
                  : `أضف ${remaining} قطعة أخرى. المجموع يجب أن يكون ${MIN_ORDER_QTY} أو أكثر.`}
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">مصاريف التوصيل</span>
                <span className="text-neutral-200 text-sm font-bold">تُحدد حسب الولاية</span>
              </div>
              <div className="h-px bg-neutral-800 my-4" />
              <div className="flex justify-between items-center gap-4">
                <span className="text-lg font-bold text-white">المجموع</span>
                <span className="text-3xl md:text-4xl font-black text-amber-300">
                  {formatPrice(pricedTotal)}
                  {hasUnpriced ? " + حسب الطلب" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-white mb-2">معلومات التوصيل</h3>
              <p className="text-neutral-400">املأ المعلومات وسنقوم بالتواصل معك في أقرب وقت</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك الكامل"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  placeholder="أدخل رقم الهاتف (05xxxxxxxx)"
                  dir="ltr"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-right"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">الولاية *</label>
                <select
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all appearance-none"
                  value={formData.wilaya}
                  onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                >
                  <option value="" disabled>
                    اختر ولايتك
                  </option>
                  {wilayas.map((w, i) => (
                    <option key={w} value={w}>
                      {i + 1} - {w}
                    </option>
                  ))}
                </select>
              </div>

              {qtyError && (
                <p className="text-amber-300 text-sm font-bold bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3">
                  {qtyError}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all transform ${
                  canSubmit
                    ? "bg-brand-green hover:bg-brand-green-light text-white hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)]"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>جاري تسجيل الطلب...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>تأكيد الطلب</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                معلوماتك محمية وآمنة
              </p>
            </div>
          </div>
        </form>

        <div id="why-us" className="pt-16">
          <h3 className="text-3xl md:text-4xl font-black text-white mb-10">لماذا تختارنا ؟</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neutral-950/50 p-6 rounded-2xl border border-neutral-800/50">
              <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-brand-green-light" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">أسعار الجملة</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">أسعار مناسبة للتجار والمهنيين.</p>
            </div>
            <div className="bg-neutral-950/50 p-6 rounded-2xl border border-neutral-800/50">
              <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-brand-green-light" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">جودة مضمونة</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">منتجات مناسبة للاستعمال المهني.</p>
            </div>
            <div className="bg-neutral-950/50 p-6 rounded-2xl border border-neutral-800/50">
              <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-brand-green-light" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">توصيل سريع</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">التوصيل متوفر إلى جميع ولايات الجزائر.</p>
            </div>
            <div className="bg-neutral-950/50 p-6 rounded-2xl border border-neutral-800/50">
              <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-brand-green-light" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">طلب سهل</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">أضف إلى السلة مباشرة دون إنشاء حساب.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
