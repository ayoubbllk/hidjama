import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { products } from "@/lib/products";

export default function Products() {
  return (
    <section id="products" className="py-20 bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-brand-green-light font-bold tracking-wider text-sm mb-2 block">
            منتجاتنا
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            اختر المقاس المناسب لك
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            كؤوس الحجامة الإسلامية بجودة مناسبة للاستعمال المهني
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-brand-green/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(5,150,105,0.1)] flex flex-col"
            >
              <div className="relative h-64 w-full bg-white p-4">
                <Image
                  src={product.image}
                  alt={`${product.name} ${product.subtitle}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-1">
                  {product.name}
                </h3>
                <p className="text-brand-green-light font-bold text-lg mb-4">
                  {product.subtitle}
                </p>

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

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-800">
                  <div className="flex flex-col">
                    <span className="text-neutral-400 text-sm">السعر</span>
                    {product.price > 0 ? (
                      <span className="text-2xl font-black text-white">
                        {product.price} <span className="text-sm font-normal">دج</span>
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-neutral-300">حسب الطلب</span>
                    )}
                  </div>

                  <Link
                    href="#order"
                    className="flex items-center gap-2 bg-brand-green/10 hover:bg-brand-green text-brand-green-light hover:text-white px-4 py-2.5 rounded-xl font-bold transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>أضف إلى الطلب</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
