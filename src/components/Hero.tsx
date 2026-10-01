import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-background.webp"
          alt="كؤوس الحجامة"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-neutral-950/95 via-neutral-950/80 to-neutral-950/40"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 text-brand-green-light px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green-light opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green-light"></span>
            </span>
            بيع بالجملة
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            بيع كؤوس الحجامة <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-light to-emerald-200">
              أبوا عبد الرحمان
            </span>
          </h1>
          
          <h2 className="text-xl md:text-2xl font-bold text-neutral-200 mb-6">
            كؤوس حجامة بجودة عالية وأسعار بالجملة
          </h2>
          
          <p className="text-base md:text-lg text-neutral-400 mb-10 max-w-2xl leading-relaxed">
            نوفر لكم مختلف المقاسات، بجودة مناسبة للاستعمال المهني، مع إمكانية الطلب بسهولة والتوصيل إلى جميع ولايات الجزائر.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#order"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-light text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)]"
            >
              اطلب الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <Link
              href="#products"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
            >
              شاهد المنتجات
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm font-medium text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span>جودة مضمونة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span>توصيل 58 ولاية</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
