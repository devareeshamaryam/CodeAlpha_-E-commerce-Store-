"use client";

import Link from "next/link";

const STATS = [
  { label: "Total Products", value: "24",            change: "+3 this week",   href: "/dashboard/products" },
  { label: "Total Orders",   value: "128",           change: "+12 today",      href: "/dashboard/orders" },
  { label: "Revenue",        value: "Rs. 5,84,000", change: "+8% this month", href: "#" },
  { label: "Customers",      value: "96",            change: "+5 this week",   href: "/dashboard/customers" },
];

const QUICK_LINKS = [
  {
    title: "Add New Product",
    desc:  "Create a new listing for your store",
    href:  "/dashboard/products/add",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "View All Products",
    desc:  "Manage your existing product listings",
    href:  "/dashboard/products",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
      </svg>
    ),
  },
  {
    title: "View Orders",
    desc:  "Check and manage customer orders",
    href:  "/dashboard/orders",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: "Visit Store",
    desc:  "See your live store as customers see it",
    href:  "/shop",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    ),
  },
];

export default function DashboardHomePage() {
  const now = new Date();
  const timeStr = now.toLocaleDateString("en-PK", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-8 max-w-[1100px]">

      {/* Header */}
      <div className="mb-10">
        <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#888] mb-1">
          {timeStr}
        </p>
        <h1 className="font-sans text-[32px] font-bold text-black leading-none">
          Welcome back 👋
        </h1>
        <p className="font-sans text-[14px] text-[#888] mt-2">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-[#e8e8e8] rounded-sm px-6 py-5 hover:border-black transition-colors group"
          >
            <p className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888] mb-2">
              {stat.label}
            </p>
            <p className="font-sans text-[28px] font-bold text-black leading-none mb-2">
              {stat.value}
            </p>
            <p className="font-sans text-[11px] text-[#888] group-hover:text-black transition-colors">
              {stat.change}
            </p>
          </Link>
        ))}
      </div>

      <div className="border-t border-[#e8e8e8] mb-8" />

      {/* Quick Actions */}
      <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-black mb-4">
        Quick Actions
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-start gap-4 bg-white border border-[#e8e8e8] rounded-sm px-6 py-5 hover:border-black transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-[#f2f2f2] rounded-sm flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <div>
              <p className="font-sans text-[13px] font-semibold text-black">{item.title}</p>
              <p className="font-sans text-[12px] text-[#888] mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}