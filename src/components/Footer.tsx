import { ShieldCheck, Truck, MessageCircle, PackageOpen } from "lucide-react";

export function TrustBanner() {
  return (
    <div className="bg-brand-green-dark/20 border-y border-brand-green/20 py-6 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4 text-center">
          <div className="flex items-center gap-3">
            <PackageOpen className="w-6 h-6 text-brand-green-light" />
            <span className="text-white font-bold text-lg">بيع بالجملة</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-green"></div>
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-brand-green-light" />
            <span className="text-white font-bold text-lg">توصيل إلى جميع ولايات الجزائر</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-green"></div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-brand-green-light" />
            <span className="text-white font-bold text-lg">طلب سريع ومباشر</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-green"></div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-green-light" />
            <span className="text-white font-bold text-lg">خدمة العملاء</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-green/5 pointer-events-none"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">جاهز لطلب كؤوس الحجامة؟</h2>
        <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
          اختر المقاس المناسب وأرسل طلبك الآن
        </p>
        <a
          href="#order"
          className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-light text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all transform hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(5,150,105,0.6)]"
        >
          اطلب الآن
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col items-start group mb-6">
              <span className="text-2xl font-bold text-white group-hover:text-brand-green-light transition-colors">
                أبو عبد الرحمان
              </span>
              <span className="text-sm text-neutral-400 font-medium">
                كؤوس الحجامة الإسلامية
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              نوفر لكم كؤوس الحجامة الإسلامية بجودة عالية وأسعار مناسبة، مع خدمة توصيل سريعة لكامل الولايات.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">روابط سريعة</h4>
            <ul className="space-y-4">
              <li>
                <a href="#home" className="text-neutral-400 hover:text-brand-green-light transition-colors">الرئيسية</a>
              </li>
              <li>
                <a href="#products" className="text-neutral-400 hover:text-brand-green-light transition-colors">المنتجات</a>
              </li>
              <li>
                <a href="#how-to-order" className="text-neutral-400 hover:text-brand-green-light transition-colors">طريقة الطلب</a>
              </li>
              <li>
                <a href="#why-us" className="text-neutral-400 hover:text-brand-green-light transition-colors">من نحن</a>
              </li>
              <li>
                <a href="#footer" className="text-neutral-400 hover:text-brand-green-light transition-colors">تواصل معنا</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">تواصل معنا</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-brand-green-light" />
                </div>
                <div>
                  <p className="text-white font-bold">تأكيد الطلب</p>
                  <p className="text-neutral-400 text-sm">نتواصل معك بعد إرسال الطلب</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-brand-green-light" />
                </div>
                <div>
                  <p className="text-white font-bold">جميع ولايات الجزائر</p>
                  <p className="text-neutral-400 text-sm">التوصيل متوفر في جميع الولايات</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} جميع الحقوق محفوظة - أبو عبد الرحمان | كؤوس الحجامة الإسلامية
          </p>
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <span>معا من أجل صحة أفضل</span>
            <span className="text-brand-green">♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
