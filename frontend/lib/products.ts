// lib/products.ts
// Single source of truth for product data. Both the Shop listing page and
// the /products/[slug] detail page import from here so prices, names, and
// images never drift out of sync between the two.

export interface Product {
  id: string;
  slug: string; // used in the URL: /products/<slug>
  name: string;
  price: number; // price in PKR
  image: string;
  category: string;
  tag: string;
  description: string[];
  madeToOrderNote?: string;
  disclaimer?: string;
  sizes: string[];
}

// ─── Filter Options (Shop page) ────────────────────────────────────────────────

export const CATEGORIES = ["T-Shirt", "Jacket", "Pants", "Sneakers"];

export const PRICE_RANGES = [
  { label: "Under Rs. 12,000",         min: 0,     max: 12000 },
  { label: "Rs. 12,000 – Rs. 20,000", min: 12000, max: 20000 },
  { label: "Rs. 20,000 – Rs. 30,000", min: 20000, max: 30000 },
  { label: "Over Rs. 30,000",          min: 30000, max: Infinity },
];

export const SORT_OPTIONS = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest"];

// ─── Shared copy blocks (reused across products of the same category) ────────

const MADE_TO_ORDER_NOTE =
  "This product is MADE TO ORDER. Please allow up to 2 weeks for production and shipping.";

const MOCKUP_DISCLAIMER =
  "Please note: product images are digital mockups. Actual products may vary in color, brand, style and/or production materials due to reasons beyond our control.";

const APPAREL_SIZES = ["Small", "Medium", "Large", "X-Large", "2X-Large"];
const SNEAKER_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

const DESCRIPTIONS: Record<string, string[]> = {
  "T-Shirt": ["Made to order", "Screen-printed graphics", "PRO CLUB Heavyweight T-Shirt"],
  "Jacket":  ["Made to order", "Premium tailored fit", "Durable all-season shell"],
  "Pants":   ["Made to order", "Reinforced stitching", "Relaxed everyday fit"],
  "Sneakers": ["Limited release", "Premium leather and canvas upper", "Cushioned comfort sole"],
};

// ─── Products ───────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: "1", slug: "classic-logo-tee-black",
    name: "Classic Logo Tee (Black)", price: 11200, image: "/images/tee-black.png",
    category: "T-Shirt", tag: "T-SHIRT",
    description: DESCRIPTIONS["T-Shirt"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "2", slug: "classic-logo-tee-white",
    name: "Classic Logo Tee (White)", price: 11200, image: "/images/tee-white.png",
    category: "T-Shirt", tag: "T-SHIRT",
    description: DESCRIPTIONS["T-Shirt"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "3", slug: "graphic-print-tee-red",
    name: "Graphic Print Tee (Red)", price: 9800, image: "/images/tee-red.png",
    category: "T-Shirt", tag: "T-SHIRT",
    description: DESCRIPTIONS["T-Shirt"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "4", slug: "oversized-drop-tee-grey",
    name: "Oversized Drop Tee (Grey)", price: 12600, image: "/images/tee-grey.png",
    category: "T-Shirt", tag: "T-SHIRT",
    description: DESCRIPTIONS["T-Shirt"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "5", slug: "limited-collab-tee-artist-series",
    name: "Limited Collab Tee - Artist Series", price: 15400, image: "/images/collab-tee.png",
    category: "T-Shirt", tag: "T-SHIRT",
    description: DESCRIPTIONS["T-Shirt"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "6", slug: "empire-1m-tee",
    name: "EMPIRE 1M Tee", price: 11200, image: "/images/tee-1m.png",
    category: "T-Shirt", tag: "T-SHIRT",
    description: DESCRIPTIONS["T-Shirt"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "7", slug: "varsity-bomber-jacket-black",
    name: "Varsity Bomber Jacket (Black)", price: 33600, image: "/images/jacket-varsity.png",
    category: "Jacket", tag: "JACKET",
    description: DESCRIPTIONS["Jacket"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "8", slug: "windbreaker-shell-jacket",
    name: "Windbreaker Shell Jacket", price: 26600, image: "/images/jacket-wind.png",
    category: "Jacket", tag: "JACKET",
    description: DESCRIPTIONS["Jacket"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "9", slug: "cargo-pants-black",
    name: "Cargo Pants (Black)", price: 21000, image: "/images/pants-cargo.png",
    category: "Pants", tag: "PANTS",
    description: DESCRIPTIONS["Pants"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "10", slug: "slim-joggers-grey",
    name: "Slim Joggers (Grey)", price: 16800, image: "/images/pants-jogger.png",
    category: "Pants", tag: "PANTS",
    description: DESCRIPTIONS["Pants"], madeToOrderNote: MADE_TO_ORDER_NOTE,
    disclaimer: MOCKUP_DISCLAIMER, sizes: APPAREL_SIZES,
  },
  {
    id: "11", slug: "low-top-canvas-sneaker-white",
    name: "Low Top Canvas Sneaker (White)", price: 25200, image: "/images/sneaker-low.png",
    category: "Sneakers", tag: "SNEAKERS",
    description: DESCRIPTIONS["Sneakers"], madeToOrderNote: undefined,
    disclaimer: MOCKUP_DISCLAIMER, sizes: SNEAKER_SIZES,
  },
  {
    id: "12", slug: "retro-basketball-high-red",
    name: "Retro Basketball High (Red)", price: 36400, image: "/images/sneaker-retro.png",
    category: "Sneakers", tag: "SNEAKERS",
    description: DESCRIPTIONS["Sneakers"], madeToOrderNote: undefined,
    disclaimer: MOCKUP_DISCLAIMER, sizes: SNEAKER_SIZES,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}