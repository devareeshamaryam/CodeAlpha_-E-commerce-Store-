"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PRODUCTS } from "@/lib/products";
 
export default function AllProductsPage() {
  const allProducts = PRODUCTS;
  const [search, setSearch]   = useState("");
  const [deleted, setDeleted] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string | null>(null);

  const filtered = allProducts.filter(
    (p) =>
      !deleted.includes(p.id) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    setDeleted((d) => [...d, id]);
    setConfirm(null);
  };

  return (
    <div className="p-8 max-w-[1100px]">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#888] mb-1">
            Dashboard / Products
          </p>
          <h1 className="font-sans text-[28px] font-bold text-black leading-none">All Products</h1>
        </div>
        <Link
          href="/dashboard/products/add"
          className="flex items-center gap-2 bg-black text-white font-sans text-[12px] font-semibold uppercase tracking-wider px-5 py-3 rounded-sm hover:bg-[#1a1a1a] transition-colors"
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Products",  value: allProducts.length - deleted.length },
          { label: "Active Listings", value: allProducts.length - deleted.length },
          { label: "Categories",      value: [...new Set(allProducts.map((p) => p.tag))].length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e8e8e8] rounded-sm px-6 py-5">
            <p className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888] mb-1">
              {stat.label}
            </p>
            <p className="font-sans text-[32px] font-bold text-black leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]"
          width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8e8e8] rounded-sm font-sans text-[13px] text-black placeholder-[#bbb] focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e8e8] rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8e8e8]">
              {["Product", "Tag", "Price", "Sizes", ""].map((col) => (
                <th key={col} className="text-left font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#888] px-5 py-3.5">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center font-sans text-[13px] text-[#bbb]">
                  No products found.
                </td>
              </tr>
            )}
            {filtered.map((product, i) => (
              <tr
                key={product.id}
                className={`border-b border-[#f2f2f2] hover:bg-[#fafafa] transition-colors
                  ${i === filtered.length - 1 ? "border-b-0" : ""}`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-[#f2f2f2] rounded-sm flex-shrink-0 overflow-hidden">
                      <Image src={product.image} alt={product.name} fill sizes="48px" className="object-contain p-1.5" />
                    </div>
                    <div>
                      <p className="font-sans text-[13px] font-semibold text-black leading-tight">{product.name}</p>
                      <p className="font-sans text-[11px] text-[#888] mt-0.5">/{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="bg-black text-white font-sans text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                    {product.tag}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-sans text-[13px] font-semibold text-black">
                    Rs. {product.price.toLocaleString("en-PK")}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map((s) => (
                      <span key={s} className="font-sans text-[10px] text-[#555] border border-[#ddd] px-1.5 py-0.5 rounded-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/shop/${product.slug}`} target="_blank"
                      className="text-[#888] hover:text-black transition-colors px-2 py-1.5">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link href={`/dashboard/products/edit/${product.id}`}
                      className="text-[#888] hover:text-black transition-colors px-2 py-1.5">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    {confirm === product.id ? (
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => handleDelete(product.id)}
                          className="font-sans text-[10px] font-semibold text-white bg-red-600 px-2 py-1 rounded-sm hover:bg-red-700 cursor-pointer transition-colors">
                          Confirm
                        </button>
                        <button type="button" onClick={() => setConfirm(null)}
                          className="font-sans text-[10px] text-[#888] hover:text-black px-1 py-1 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setConfirm(product.id)}
                        className="text-[#888] hover:text-red-600 transition-colors px-2 py-1.5 cursor-pointer">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-[11px] text-[#bbb] mt-4">
        Showing {filtered.length} of {allProducts.length - deleted.length} products
      </p>
    </div>
  );
}