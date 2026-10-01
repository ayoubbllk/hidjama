"use client";

import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#home" },
    { name: "المنتجات", href: "#products" },
    { name: "طريقة الطلب", href: "#how-to-order" },
    { name: "من نحن", href: "#why-us" },
    { name: "تواصل معنا", href: "#footer" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="#home" className="flex flex-col items-start group">
          <span className="text-xl md:text-2xl font-bold text-white group-hover:text-brand-green-light transition-colors">
            أبو عبد الرحمان
          </span>
          <span className="text-xs md:text-sm text-neutral-400 font-medium">
            كؤوس الحجامة الإسلامية
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link
            href="#order"
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white px-5 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(5,150,105,0.3)]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>اطلب الآن</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            href="#order"
            className="flex items-center justify-center bg-brand-green text-white p-2 rounded-lg"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-neutral-900 border-b border-neutral-800 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-4 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 p-2 rounded-md transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
