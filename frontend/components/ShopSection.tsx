 "use client";

import Image from "next/image";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  tag: string;
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col bg-[#f2f2f2] cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm overflow-hidden">
      {/* Image Area */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "110%" }}>
        {/* Category Tag */}
        <span className="absolute top-3 left-3 z-10 bg-black text-white text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full font-sans">
          {product.tag}
        </span>

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="px-1 pt-3 pb-5 bg-white flex flex-col gap-1">
        <p className="text-[13px] text-[#1a1a1a] leading-snug font-normal line-clamp-2 font-sans">
          {product.name}
        </p>
        {product.price > 0 ? (
          <p className="text-[13px] text-[#1a1a1a] font-sans">${product.price.toFixed(2)}</p>
        ) : (
          <p className="text-[13px] text-[#999] font-sans">Price unavailable</p>
        )}
      </div>
    </div>
  );
}

// ─── Category Data ────────────────────────────────────────────────────────────

const CATEGORIES = ["Trending", "T-Shirts", "Jackets", "Pants", "Sneakers", "Shop All"];

const PRODUCTS: Product[] = [
  // T-Shirts
  { id: "1",  name: "Classic Logo Tee (Black)",         price: 40,  image: "/images/tee-black.png",       category: "T-Shirts", tag: "T-SHIRT"  },
  { id: "2",  name: "Classic Logo Tee (White)",         price: 40,  image: "/images/tee-white.png",       category: "T-Shirts", tag: "T-SHIRT"  },
  { id: "3",  name: "Graphic Print Tee (Red)",          price: 35,  image: "/images/tee-red.png",         category: "T-Shirts", tag: "T-SHIRT"  },
  { id: "4",  name: "Oversized Drop Tee (Grey)",        price: 45,  image: "/images/tee-grey.png",        category: "T-Shirts", tag: "T-SHIRT"  },
  { id: "5",  name: "Limited Edition Collab Tee",       price: 55,  image: "/images/tee-collab.png",      category: "T-Shirts", tag: "T-SHIRT"  },
  // Jackets
  { id: "6",  name: "Varsity Bomber Jacket (Black)",    price: 120, image: "/images/jacket-varsity.png",  category: "Jackets",  tag: "JACKET"   },
  { id: "7",  name: "Windbreaker Shell Jacket",         price: 95,  image: "/images/jacket-wind.png",     category: "Jackets",  tag: "JACKET"   },
  { id: "8",  name: "Denim Trucker Jacket",             price: 110, image: "/images/jacket-denim.png",    category: "Jackets",  tag: "JACKET"   },
  { id: "9",  name: "Puffer Jacket (Olive)",            price: 140, image: "/images/jacket-puffer.png",   category: "Jackets",  tag: "JACKET"   },
  { id: "10", name: "Coach Jacket (Navy)",              price: 100, image: "/images/jacket-coach.png",    category: "Jackets",  tag: "JACKET"   },
  // Pants
  { id: "11", name: "Cargo Pants (Black)",              price: 75,  image: "/images/pants-cargo.png",     category: "Pants",    tag: "PANTS"    },
  { id: "12", name: "Slim Joggers (Grey)",              price: 60,  image: "/images/pants-jogger.png",    category: "Pants",    tag: "PANTS"    },
  { id: "13", name: "Relaxed Chinos (Tan)",             price: 70,  image: "/images/pants-chino.png",     category: "Pants",    tag: "PANTS"    },
  { id: "14", name: "Wide Leg Denim (Washed)",          price: 85,  image: "/images/pants-denim.png",     category: "Pants",    tag: "PANTS"    },
  { id: "15", name: "Track Pants (Black/White)",        price: 65,  image: "/images/pants-track.png",     category: "Pants",    tag: "PANTS"    },
  // Sneakers
  { id: "16", name: "Low Top Canvas Sneaker (White)",   price: 90,  image: "/images/sneaker-low.png",     category: "Sneakers", tag: "SNEAKERS" },
  { id: "17", name: "High Top Leather Sneaker",         price: 120, image: "/images/sneaker-high.png",    category: "Sneakers", tag: "SNEAKERS" },
  { id: "18", name: "Chunky Sole Runner (Black)",       price: 110, image: "/images/sneaker-chunky.png",  category: "Sneakers", tag: "SNEAKERS" },
  { id: "19", name: "Slip-On Skate Shoe (Grey)",        price: 80,  image: "/images/sneaker-slip.png",    category: "Sneakers", tag: "SNEAKERS" },
  { id: "20", name: "Retro Basketball High (Red)",      price: 130, image: "/images/sneaker-retro.png",   category: "Sneakers", tag: "SNEAKERS" },
];

// ─── Shop Section ─────────────────────────────────────────────────────────────

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState("Trending");

  const filtered =
    activeCategory === "Trending" || activeCategory === "Shop All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="w-full bg-white px-6 py-10 max-w-[1400px] mx-auto">

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        {/* "SHOP" — Anton (display font) */}
        <h2 className="font-display text-[52px] sm:text-[68px] uppercase leading-none tracking-tight text-black">
          SHOP
        </h2>

        {/* Category Pills — Inter (sans font) */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans px-4 py-2 rounded-full border text-[13px] font-medium transition-all duration-150 cursor-pointer
                ${
                  activeCategory === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-[#ccc] hover:border-black"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid — single row, 5 cards */}
      <div className="grid grid-cols-5 gap-4">
        {filtered.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}