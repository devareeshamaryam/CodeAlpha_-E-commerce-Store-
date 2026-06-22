// app/products/[slug]/page.tsx
// Dynamic product detail route, e.g. /products/classic-logo-tee-black
// Pulls the product from the shared lib/products data using the slug from
// the URL, so it always matches whatever card was clicked on the Shop page.

"use client";

import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getProductBySlug } from "@/lib/products";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const product = getProductBySlug(params.slug);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // ── Product not found ──
  if (!product) {
    return (
      <div className="w-full bg-white min-h-screen">
        <Header />
        <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
          <p className="font-display text-[32px] uppercase text-[#ccc]">Product not found</p>
          <p className="font-sans text-[13px] text-[#aaa] mt-2">
            This item may have been removed or the link is incorrect.
          </p>
          <Link
            href="/shop"
            className="inline-block mt-6 font-sans text-[13px] font-semibold text-black underline"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => q + 1);
  const activeSize = selectedSize ?? product.sizes[0];

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
              src={product.image}
              alt={product.name}
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
                {product.name}
              </h1>
              <p className="font-sans text-[20px] text-black mt-3">
                Rs. {product.price.toLocaleString("en-PK")}
              </p>
            </div>

            {/* Made to order note */}
            {product.madeToOrderNote && (
              <p className="font-sans text-[14px] font-semibold text-black">
                {product.madeToOrderNote}
              </p>
            )}

            {/* Description */}
            <div>
              <p className="font-sans text-[14px] font-semibold text-black mb-2">
                PRODUCT DESCRIPTION:
              </p>
              <ul className="font-sans text-[14px] text-black list-disc list-inside space-y-1">
                {product.description.map((line, i) => (
                  <li key={line} className={i === 0 ? "italic font-semibold" : ""}>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            {product.disclaimer && (
              <p className="font-sans text-[13px] text-[#555] leading-relaxed">
                {product.disclaimer}
              </p>
            )}

            {/* Size Selector */}
            <div>
              <p className="font-sans text-[15px] font-semibold text-black mb-3">Size</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`font-sans text-[14px] font-medium px-5 py-2.5 rounded-sm border transition-colors duration-150 cursor-pointer
                      ${activeSize === size
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
                <span>Rs. {(product.price * quantity).toLocaleString("en-PK")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}