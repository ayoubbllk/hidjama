import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import OrderForm from "@/components/OrderForm";
import HowToOrder from "@/components/HowToOrder";
import StickyOrderBar from "@/components/StickyOrderBar";
import { TrustBanner, FinalCTA, Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 pb-24 md:pb-0">
      <Navbar />
      <Hero />
      <TrustBanner />
      <Products />
      <OrderForm />
      <HowToOrder />
      <FinalCTA />
      <Footer />
      
      <StickyOrderBar />
    </main>
  );
}
