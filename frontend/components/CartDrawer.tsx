 // components/CartDrawer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, removeItem, updateQty } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e0e0e0]">
          <p className="font-sans text-[16px] font-semibold text-black">
            {count} item{count !== 1 ? "s" : ""} in cart
          </p>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-[24px] leading-none text-black hover:opacity-60 transition-opacity cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="font-sans text-[15px] text-[#aaa]">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 items-start">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 shrink-0 bg-[#f2f2f2] rounded-sm overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col gap-1">
                  <p className="font-sans text-[13px] text-black font-medium leading-snug line-clamp-2">
                    {item.name}
                  </p>
                  <p className="font-sans text-[12px] text-[#888]">Size: {item.size}</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center border border-[#ccc] rounded-sm">
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm cursor-pointer hover:bg-[#f2f2f2] transition-colors"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-7 text-center font-sans text-[13px]">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm cursor-pointer hover:bg-[#f2f2f2] transition-colors"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price + Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="font-sans text-[13px] font-semibold text-black">
                    Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                  </p>
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    aria-label="Remove item"
                    className="text-[18px] text-[#aaa] hover:text-black transition-colors cursor-pointer leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-[#e0e0e0] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="font-sans text-[15px] font-semibold text-black">Subtotal</p>
              <p className="font-sans text-[15px] font-semibold text-black">
                Rs. {subtotal.toLocaleString("en-PK")}
              </p>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full h-12 bg-black text-white font-sans text-[14px] font-semibold uppercase tracking-wide flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors rounded-sm"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}