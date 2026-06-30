 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { type Product } from "@/lib/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="flex flex-col bg-[#f2f2f2] cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm overflow-hidden"
    >
      {/* Image Area */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "110%" }}>
        <span className="absolute top-3 left-3 z-10 bg-black text-white text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full font-sans">
          {product.tag}
        </span>

        <Image
          src={product.image || "/images/placeholder.png"}
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
          <p className="text-[13px] text-[#1a1a1a] font-sans">Rs. {product.price.toLocaleString("en-PK")}</p>
        ) : (
          <p className="text-[13px] text-[#999] font-sans">Price unavailable</p>
        )}
      </div>
    </Link>
  );
}

// ─── Category Data ────────────────────────────────────────────────────────────

const CATEGORIES = ["Shop All", "T-Shirt", "Jacket", "Pants", "Sneakers"];

// ─── Shop Section ─────────────────────────────────────────────────────────────

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState("Shop All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res  = await fetch(`${API_URL}/products`);
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered =
    activeCategory === "Shop All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="w-full bg-white px-6 py-10 max-w-[1400px] mx-auto">

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <h2 className="font-display text-[52px] sm:text-[68px] uppercase leading-none tracking-tight text-black">
          SHOP
        </h2>

        {/* Category Pills */}
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
      {loading ? (
        <div className="flex justify-center py-16">
          <p className="font-sans text-[14px] text-[#888]">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex justify-center py-16">
          <p className="font-sans text-[14px] text-[#888]">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}