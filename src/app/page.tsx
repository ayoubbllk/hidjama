import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import OrderForm from "@/components/OrderForm";
import HowToOrder from "@/components/HowToOrder";
import { TrustBanner, FinalCTA, Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />
      <Hero />
      <TrustBanner />
      <Products />
      <OrderForm />
      <HowToOrder />
      <FinalCTA />
      <Footer />
      
      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800 z-50">
        <a
          href="#order"
          className="w-full flex items-center justify-center gap-2 bg-brand-green text-white px-4 py-3.5 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(5,150,105,0.35)]"
        >
          اطلب الآن
        </a>
      </div>
    </main>
  );
}
