 "use client";

import CTABar from "@/components/CTABar";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  CATEGORIES,
  PRICE_RANGES,
  SORT_OPTIONS,
  PRODUCTS,
  type Product,
} from "@/lib/products";

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="flex flex-col bg-[#f2f2f2] cursor-pointer group rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "108%" }}>
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <span className="bg-black text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full font-sans">
            {product.tag}
          </span>
        </div>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="px-1 pt-3 pb-5 bg-white flex flex-col gap-1">
        <p className="text-[13px] text-[#1a1a1a] leading-snug font-normal line-clamp-2 font-sans">
          {product.name}
        </p>
        <p className="text-[13px] text-[#1a1a1a] font-sans">
          Rs. {product.price.toLocaleString("en-PK")}
        </p>
      </div>
    </Link>
  );
}

// ─── Expandable Filter Group ──────────────────────────────────────────────────

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-[#e0e0e0] py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between font-sans text-[14px] font-medium text-black"
      >
        {title}
        <span className="text-xl leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

// ─── Shop Page ────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePrices, setActivePrices] = useState<string[]>([]);
  const [sort, setSort] = useState("Relevance");

  const togglePrice = (label: string) => {
    setActivePrices((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activePrices.length > 0) {
      list = list.filter((p) =>
        activePrices.some((label) => {
          const range = PRICE_RANGES.find((r) => r.label === label);
          return range ? p.price >= range.min && p.price < range.max : false;
        })
      );
    }

    if (sort === "Price: Low to High")  list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low")  list.sort((a, b) => b.price - a.price);

    return list;
  }, [activeCategory, activePrices, sort]);

  const activeFiltersCount = activePrices.length;

  return (
    <div className="w-full bg-white min-h-screen">
      <CTABar />
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* ── Page Title ── */}
        <h1 className="font-display text-[64px] sm:text-[80px] uppercase leading-none text-black mb-8">
          Categories
        </h1>

        {/* ── Category Pills + Sort ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`font-sans px-4 py-2 rounded-full border text-[13px] font-medium transition-all duration-150 cursor-pointer
                  ${activeCategory === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-[#ccc] hover:border-black"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + count */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="font-sans text-[13px] text-black border border-[#ccc] rounded-full px-4 py-2 pr-8 appearance-none cursor-pointer focus:outline-none hover:border-black transition-colors bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px]">▼</span>
            </div>
            <span className="font-sans text-[13px] text-[#888] whitespace-nowrap">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ── Body: Sidebar + Grid ── */}
        <div className="flex gap-10 items-start">

          {/* Sidebar */}
          <aside className="w-[220px] shrink-0 hidden lg:block">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-[15px] font-semibold text-black">Filters</span>
              <span className="font-sans text-[12px] text-[#888] border border-[#ccc] rounded-full w-6 h-6 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            </div>

            {/* Category Filter */}
            <FilterGroup title="Category">
              <div className="flex flex-col gap-3">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group/item">
                    <input
                      type="checkbox"
                      checked={activeCategory === cat}
                      onChange={() => setActiveCategory(activeCategory === cat ? null : cat)}
                      className="w-4 h-4 rounded border-[#ccc] accent-black cursor-pointer"
                    />
                    <span className="font-sans text-[13px] text-[#1a1a1a] group-hover/item:text-black">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </FilterGroup>

            {/* Price Filter */}
            <FilterGroup title="Price">
              <div className="flex flex-col gap-3">
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="flex items-center gap-2 cursor-pointer group/item">
                    <input
                      type="checkbox"
                      checked={activePrices.includes(range.label)}
                      onChange={() => togglePrice(range.label)}
                      className="w-4 h-4 rounded border-[#ccc] accent-black cursor-pointer"
                    />
                    <span className="font-sans text-[13px] text-[#1a1a1a] group-hover/item:text-black">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </FilterGroup>

            {/* Clear filters */}
            {(activeCategory || activePrices.length > 0) && (
              <button
                onClick={() => { setActiveCategory(null); setActivePrices([]); }}
                className="font-sans text-[12px] text-[#888] underline hover:text-black transition-colors mt-2"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-display text-[32px] uppercase text-[#ccc]">No products found</p>
                <p className="font-sans text-[13px] text-[#aaa] mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}