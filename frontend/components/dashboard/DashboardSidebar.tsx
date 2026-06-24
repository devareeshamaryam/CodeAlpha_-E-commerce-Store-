"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  {
    label: "Products",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
      </svg>
    ),
    children: [
      { label: "All Products", href: "/dashboard/products" },
      { label: "Add Product",  href: "/dashboard/products/add" },
    ],
  },
  {
    label: "Orders",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    href: "/dashboard/orders",
  },
  {
    label: "Customers",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
    href: "/dashboard/customers",
  },
  {
    label: "Settings",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    href: "/dashboard/settings",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>("Products");
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (children?: { href: string }[]) =>
    children?.some((c) => pathname.startsWith(c.href));

  return (
    <aside
      className={`flex flex-col bg-black text-white min-h-screen transition-all duration-200 flex-shrink-0
        ${collapsed ? "w-[60px]" : "w-[240px]"}`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        {!collapsed && (
          <span className="font-sans text-[13px] font-bold tracking-[0.15em] uppercase">
            Dashboard
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            }
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-4 flex-1">
        {NAV.map((item) => {
          if (item.children) {
            const active = isGroupActive(item.children);
            const open = openGroup === item.label;
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setOpenGroup(open ? null : item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-sans text-[13px] font-medium
                    transition-colors cursor-pointer
                    ${active ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left tracking-wide uppercase text-[11px] font-semibold">
                        {item.label}
                      </span>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2.5}
                        className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
                {!collapsed && open && (
                  <div className="ml-8 mt-0.5 flex flex-col gap-0.5 border-l border-white/10 pl-3 pb-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`font-sans text-[12px] py-1.5 px-2 rounded-sm transition-colors
                          ${isActive(child.href) ? "text-white font-semibold" : "text-white/40 hover:text-white"}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-sans text-[11px] font-semibold
                tracking-wide uppercase transition-colors
                ${isActive(item.href!) ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-white/10">
          <Link
            href="/shop"
            className="flex items-center gap-2 font-sans text-[11px] text-white/30 hover:text-white transition-colors"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Store
          </Link>
        </div>
      )}
    </aside>
  );
}