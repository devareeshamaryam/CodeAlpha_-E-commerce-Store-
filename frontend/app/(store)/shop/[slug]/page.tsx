 "use client";

import CTABar from "@/components/CTABar";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { type Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const [product, setProduct]     = useState<Product | null>(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity]   = useState(1);
  const [added, setAdded]         = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res  = await fetch(`${API_URL}/products/slug/${params.slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProduct(json.data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen">
        <CTABar />
        <Header />
        <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
          <p className="font-sans text-[14px] text-[#888]">Loading...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="w-full bg-white min-h-screen">
        <CTABar />
        <Header />
        <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
          <p className="font-display text-[32px] uppercase text-[#ccc]">Product not found</p>
          <Link href="/shop" className="inline-block mt-6 font-sans text-[13px] font-semibold text-black underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const decrement  = () => setQuantity((q) => Math.max(1, q - 1));
  const increment  = () => setQuantity((q) => q + 1);
  const activeSize = selectedSize ?? product.sizes[0];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id:    product.id,
        slug:  product.slug,
        name:  product.name,
        price: product.price,
        image: product.image,
        size:  activeSize,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <CTABar />
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <Link href="/shop"
          className="inline-flex items-center gap-1 font-sans text-[13px] text-[#888] hover:text-black transition-colors mb-8">
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Product Image */}
          <div className="relative w-full bg-[#f2f2f2] overflow-hidden rounded-sm" style={{ paddingBottom: "100%" }}>
            <Image
              src={product.image || "/images/placeholder.png"}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6 lg:pt-4">
            <div>
              <span className="bg-black text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full font-sans">
                {product.tag}
              </span>
              <h1 className="font-sans text-[32px] sm:text-[38px] font-bold leading-tight text-black mt-4">
                {product.name}
              </h1>
              <p className="font-sans text-[20px] text-black mt-2">
                Rs. {product.price.toLocaleString("en-PK")}
              </p>
            </div>

            {(product.madeToOrderNote || product.made_to_order_note) && (
              <p className="font-sans text-[14px] font-semibold text-black">
                {product.madeToOrderNote || product.made_to_order_note}
              </p>
            )}

            <div>
              <p className="font-sans text-[14px] font-semibold text-black mb-2">PRODUCT DESCRIPTION:</p>
              <ul className="font-sans text-[14px] text-black list-disc list-inside space-y-1">
                {product.description.map((line, i) => (
                  <li key={i} className={i === 0 ? "italic font-semibold" : ""}>{line}</li>
                ))}
              </ul>
            </div>

            {product.disclaimer && (
              <p className="font-sans text-[13px] text-[#555] leading-relaxed">{product.disclaimer}</p>
            )}

            <div>
              <p className="font-sans text-[15px] font-semibold text-black mb-3">Size</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button key={size} type="button" onClick={() => setSelectedSize(size)}
                    className={`font-sans text-[14px] font-medium px-5 py-2.5 rounded-sm border transition-colors cursor-pointer
                      ${activeSize === size ? "bg-black text-white border-black" : "bg-white text-black border-[#ccc] hover:border-black"}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center border border-[#ccc] rounded-sm">
                <button type="button" onClick={decrement}
                  className="w-11 h-12 flex items-center justify-center text-lg cursor-pointer hover:bg-[#f2f2f2] transition-colors">−</button>
                <span className="w-8 text-center font-sans text-[15px]">{quantity}</span>
                <button type="button" onClick={increment}
                  className="w-11 h-12 flex items-center justify-center text-lg cursor-pointer hover:bg-[#f2f2f2] transition-colors">+</button>
              </div>

              <button type="button" onClick={handleAddToCart}
                className={`flex-1 h-12 font-sans text-[14px] font-semibold uppercase tracking-wide px-6 flex items-center justify-between cursor-pointer transition-colors rounded-sm
                  ${added ? "bg-green-600 text-white" : "bg-black text-white hover:bg-[#1a1a1a]"}`}>
                <span>{added ? "Added!" : "Add to Cart"}</span>
                <span>Rs. {(product.price * quantity).toLocaleString("en-PK")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}