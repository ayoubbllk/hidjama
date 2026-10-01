import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "أبو عبد الرحمان - كؤوس الحجامة الإسلامية",
  description: "بيع كؤوس الحجامة الإسلامية بالجملة في الجزائر. جودة عالية، مقاسات مختلفة، وتوصيل سريع لجميع الولايات.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${cairo.variable} font-sans bg-neutral-950 text-neutral-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
