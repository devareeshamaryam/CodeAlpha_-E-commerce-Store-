"use client";

import Header from "@/components/Header";
import Image from "next/image";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductDetail {
  name: string;
  price: number; // price in PKR
  image: string;
  madeToOrderNote?: string;
  description: string[];
  disclaimer?: string;
  sizes: string[];
}

// ─── Sample Data (swap this for a real product fetched by slug/id) ───────────

const PRODUCT: ProductDetail = {
  name: "Baby Money “I’M A BOSS” T-Shirt (Blue)",
  price: 11200,
  image: "/images/baby-money-boss-tee-blue.png",
  madeToOrderNote:
    "This product is MADE TO ORDER. Please allow up to 2 weeks for production and shipping.",
  description: [
    "Made to order",
    "Screen-printed graphics",
    "PRO CLUB Heavyweight T-Shirt",
  ],
  disclaimer:
    "Please note: product images are digital mockups. Actual products may vary in color, brand, style and/or production materials due to reasons beyond our control.",
  sizes: ["Small", "Medium", "Large", "X-Large", "2X-Large"],
};

// ─── Product Detail Page ──────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[1]); // default: Medium
  const [quantity, setQuantity] = useState(1);

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => q + 1);

  return (
    <div className="w-full bg-white min-h-screen">
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── Product Image ── */}
          <div
            className="relative w-full bg-[#f2f2f2] overflow-hidden rounded-sm"
            style={{ paddingBottom: "100%" }}
          >
            <Image
              src={PRODUCT.image}
              alt={PRODUCT.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10"
              priority
            />
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-6 lg:pt-4">

            {/* Title + Price */}
            <div>
              <h1 className="font-sans text-[32px] sm:text-[38px] font-bold leading-tight text-black">
                {PRODUCT.name}
              </h1>
              <p className="font-sans text-[20px] text-black mt-3">
                Rs. {PRODUCT.price.toLocaleString("en-PK")}
              </p>
            </div>

            {/* Made to order note */}
            {PRODUCT.madeToOrderNote && (
              <p className="font-sans text-[14px] font-semibold text-black">
                {PRODUCT.madeToOrderNote}
              </p>
            )}

            {/* Description */}
            <div>
              <p className="font-sans text-[14px] font-semibold text-black mb-2">
                PRODUCT DESCRIPTION:
              </p>
              <ul className="font-sans text-[14px] text-black list-disc list-inside space-y-1">
                {PRODUCT.description.map((line, i) => (
                  <li key={line} className={i === 0 ? "italic font-semibold" : ""}>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            {PRODUCT.disclaimer && (
              <p className="font-sans text-[13px] text-[#555] leading-relaxed">
                {PRODUCT.disclaimer}
              </p>
            )}

            {/* Size Selector */}
            <div>
              <p className="font-sans text-[15px] font-semibold text-black mb-3">Size</p>
              <div className="flex flex-wrap gap-3">
                {PRODUCT.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`font-sans text-[14px] font-medium px-5 py-2.5 rounded-sm border transition-colors duration-150 cursor-pointer
                      ${selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-[#ccc] hover:border-black"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center border border-[#ccc] rounded-sm">
                <button
                  type="button"
                  onClick={decrement}
                  aria-label="Decrease quantity"
                  className="w-11 h-12 flex items-center justify-center text-lg font-sans cursor-pointer hover:bg-[#f2f2f2] transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-sans text-[15px]">{quantity}</span>
                <button
                  type="button"
                  onClick={increment}
                  aria-label="Increase quantity"
                  className="w-11 h-12 flex items-center justify-center text-lg font-sans cursor-pointer hover:bg-[#f2f2f2] transition-colors"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="flex-1 h-12 bg-black text-white font-sans text-[14px] font-semibold uppercase tracking-wide px-6 flex items-center justify-between cursor-pointer hover:bg-[#1a1a1a] transition-colors rounded-sm"
              >
                <span>Add to Cart</span>
                <span>Rs. {(PRODUCT.price * quantity).toLocaleString("en-PK")}</span>
              </button>
            </div>

            {/* Selected size hint (optional, quietly confirms the choice) */}
            <p className="font-sans text-[12px] text-[#888]">
              Selected size: {selectedSize}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}