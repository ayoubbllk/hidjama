"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, ShieldCheck, Truck, Package, Loader2 } from "lucide-react";
import Image from "next/image";
import { products } from "@/lib/products";

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    wilaya: "",
  });
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setQuantity = (id: string, value: string) => {
    const cleaned = value.replace(/[^\d]/g, "");
    setQuantities((prev) => ({ ...prev, [id]: cleaned }));
  };

  const qtyOf = (id: string) => {
    const n = parseInt(quantities[id] || "0", 10);
    return Number.isFinite(n) ? n : 0;
  };

  const totalItems = products.reduce((sum, p) => sum + qtyOf(p.id), 0);
  const pricedTotal = products.reduce((sum, p) => sum + p.price * qtyOf(p.id), 0);
  const hasUnpriced = products.some((p) => p.price === 0 && qtyOf(p.id) > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalItems === 0) {
      alert("الرجاء إدخال كمية لمنتج واحد على الأقل");
      return;
    }

    setIsSubmitting(true);

    const selected = products.filter((p) => qtyOf(p.id) > 0);
    const orderDetails = selected
      .map((p) => {
        const lineTotal = p.price > 0 ? `${p.price * qtyOf(p.id)} دج` : "حسب الطلب";
        return `- ${p.name} (${p.subtitle}): ${qtyOf(p.id)} (المجموع: ${lineTotal})`;
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
          lines: selected.map((p) => ({
            label: `${p.name} — ${p.subtitle}`,
            qty: qtyOf(p.id),
            price: p.price,
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
      <div className="absolute inset-0 bg-[url('/hero-background.png')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-1/2 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white mb-2">تأكيد طلبك</h2>
              <p className="text-neutral-400">املأ المعلومات وسنقوم بالتواصل معك في أقرب وقت</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="pt-4">
                <label className="block text-sm font-bold text-neutral-300 mb-1">اختر المنتجات والكميات *</label>
                <p className="text-xs text-neutral-500 mb-4">اكتب الكمية المطلوبة لكل منتج. اترك الحقل فارغاً إذا لم ترد المنتج.</p>
                <div className="space-y-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                        qtyOf(p.id) > 0
                          ? "bg-brand-green/10 border-brand-green"
                          : "bg-neutral-900 border-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-white font-bold text-sm truncate">{p.name}</h4>
                          <p className="text-neutral-400 text-xs">{p.subtitle}</p>
                          <p className="text-brand-green-light text-xs font-bold">
                            {p.price > 0 ? `${p.price} دج` : "حسب الطلب"}
                          </p>
                        </div>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        aria-label={`كمية ${p.name}`}
                        className="w-20 shrink-0 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-center text-white font-bold focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                        value={quantities[p.id] ?? ""}
                        onChange={(e) => setQuantity(p.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 mt-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-neutral-400">إجمالي الكمية:</span>
                  <span className="text-white font-bold">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-neutral-400">مصاريف التوصيل:</span>
                  <span className="text-brand-green-light text-sm font-bold">يتم تحديدها حسب الولاية</span>
                </div>
                <div className="h-px bg-neutral-800 my-4"></div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-lg font-bold text-white">المجموع الكلي:</span>
                  <span className="text-2xl md:text-3xl font-black text-brand-green-light text-left">
                    {pricedTotal} دج{hasUnpriced ? " + حسب الطلب" : ""}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={totalItems === 0 || isSubmitting}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all transform mt-6 ${
                  totalItems > 0
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

              <p className="text-center text-xs text-neutral-500 mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                معلوماتك محمية وآمنة
              </p>
            </form>
          </div>

          <div id="why-us" className="w-full lg:w-1/2 pt-10 lg:pt-20">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-10">لماذا تختارنا ؟</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                <p className="text-neutral-400 text-sm leading-relaxed">اطلب مباشرة دون إنشاء حساب.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
