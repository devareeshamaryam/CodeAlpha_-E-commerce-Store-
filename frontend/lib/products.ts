 export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  tag: string;
  description: string[];
  madeToOrderNote?: string;
  made_to_order_note?: string;
  disclaimer?: string;
  sizes: string[];
}

export const CATEGORIES = ["T-Shirt", "Jacket", "Pants", "Sneakers"];

export const PRICE_RANGES = [
  { label: "Under Rs. 12,000",         min: 0,     max: 12000 },
  { label: "Rs. 12,000 – Rs. 20,000", min: 12000, max: 20000 },
  { label: "Rs. 20,000 – Rs. 30,000", min: 20000, max: 30000 },
  { label: "Over Rs. 30,000",          min: 30000, max: Infinity },
];

export const SORT_OPTIONS = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest"];