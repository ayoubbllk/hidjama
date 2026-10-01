export type Product = {
  id: string;
  name: string;
  subtitle: string;
  refs: string[];
  price: number;
  image: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "كؤوس الحجامة الإسلامية",
    subtitle: "قياس 1",
    refs: ["1"],
    price: 220,
    image: "/produit-1.jfif",
  },
  {
    id: "p2",
    name: "كؤوس الحجامة الإسلامية",
    subtitle: "قياس 1-2-3",
    refs: ["1", "2", "3"],
    price: 200,
    image: "/produit-1-2-3.jfif",
  },
  {
    id: "p3",
    name: "كؤوس الحجامة الإسلامية",
    subtitle: "قياس 4-5-6",
    refs: ["4", "5", "6"],
    price: 180,
    image: "/taille 4-5-6.jfif",
  },
  {
    id: "p4",
    name: "كؤوس الحجامة الإسلامية",
    subtitle: "قياس 5-6",
    refs: ["5", "6"],
    price: 170,
    image: "/taille 6-5.jfif",
  },
  {
    id: "p5",
    name: "كؤوس الحجامة الإسلامية",
    subtitle: "قياس 1-2-3-4-5-6",
    refs: ["1", "2", "3", "4", "5", "6"],
    price: 190,
    image: "/produit-1-2-3-4-5-6.jfif",
  },
  {
    id: "p6",
    name: "شفرات جراحية",
    subtitle: "مقاس 11 — علبة 100",
    refs: ["11"],
    price: 105,
    image: "/lame-11.jfif",
  },
  {
    id: "p7",
    name: "قفازات لاتكس",
    subtitle: "مقاس S — علبة 100",
    refs: ["S"],
    price: 1400,
    image: "/gants-latex.jfif",
  },
];
