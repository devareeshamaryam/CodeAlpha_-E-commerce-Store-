 "use client";

import Image from "next/image";

// ─── Footer Component ─────────────────────────────────────────────────────────
// • Ticker bar  → "DEFINING INDEPENDENCE ⊕" infinite scroll (black)
// • Footer body → dark bg, logo + tagline + socials | Company | Shop columns

const TICKER_TEXT = "DEFINING INDEPENDENCE";

const SHOP_LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "T-Shirts",     href: "/shop?cat=t-shirts" },
  { label: "Jackets",      href: "/shop?cat=jackets" },
  { label: "Pants",        href: "/shop?cat=pants" },
  { label: "Sneakers",     href: "/shop?cat=sneakers" },
];

const COMPANY_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "News",       href: "/news" },
  { label: "About",      href: "/about" },
];

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "SoundCloud",
    href: "https://soundcloud.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M1.175 12.225c-.015 0-.029.001-.044.001C.504 12.226 0 12.73 0 13.349c0 .617.504 1.122 1.131 1.122.627 0 1.131-.505 1.131-1.122 0-.051-.004-.101-.01-.15v-5.29c0-.618-.504-1.122-1.131-1.122C.504 6.787 0 7.291 0 7.91c0 .049.004.097.009.144v4.171zm3.228 2.078c0 .617.504 1.122 1.131 1.122.627 0 1.131-.505 1.131-1.122V8.577c0-.618-.504-1.122-1.131-1.122-.627 0-1.131.504-1.131 1.122v5.726zm3.228.777c0 .617.504 1.122 1.131 1.122.627 0 1.131-.505 1.131-1.122V6.935c0-.618-.504-1.122-1.131-1.122-.627 0-1.131.504-1.131 1.122v8.145zm3.229-.365c0 .617.503 1.122 1.13 1.122.628 0 1.132-.505 1.132-1.122V5.535c0-.618-.504-1.122-1.131-1.122-.627 0-1.131.504-1.131 1.122v9.18zm3.228.703c0 .617.504 1.122 1.131 1.122s1.131-.505 1.131-1.122V8.577c0-.618-.504-1.122-1.131-1.122s-1.131.504-1.131 1.122v6.841zm4.359-7.544C17.993 5.613 16.1 3.72 13.745 3.72c-2.355 0-4.248 1.893-4.248 4.247 0 .099.004.197.011.294v6.654c0 .618.504 1.122 1.131 1.122h7.212C20.497 16.037 22.39 14.145 22.39 11.79c0-2.353-1.892-4.247-4.273-4.247-.015 0-.029 0-.044.001z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

// ─── Empire Logo SVG ──────────────────────────────────────────────────────────
function EmpireLogo() {
  return (
    <svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      {/* Outer circle */}
      <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="3" fill="none"/>
      {/* Inner geometric — simplified Empire mark */}
      <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="2" fill="none"/>
      {/* Cross lines */}
      <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="2"/>
      <line x1="20" y1="50" x2="80" y2="50" stroke="white" strokeWidth="2"/>
      {/* Diagonal accents */}
      <line x1="29" y1="29" x2="71" y2="71" stroke="white" strokeWidth="1.5"/>
      <line x1="71" y1="29" x2="29" y2="71" stroke="white" strokeWidth="1.5"/>
      {/* EMPIRE text */}
      <text x="50" y="102" textAnchor="middle" fill="white" fontSize="10" fontFamily="Arial" letterSpacing="3" fontWeight="600">EMPIRE</text>
    </svg>
  );
}

// ─── Ticker Bar ───────────────────────────────────────────────────────────────
function TickerBar() {
  return (
    <div className="w-full bg-black overflow-hidden py-3">
      <div className="flex w-max animate-ticker">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="flex items-center gap-4 pr-10 font-display text-white text-[20px] uppercase tracking-widest whitespace-nowrap"
          >
            {TICKER_TEXT}
            {/* Empire circle mark */}
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
              <line x1="12" y1="4" x2="12" y2="20" stroke="white" strokeWidth="1.5"/>
              <line x1="4" y1="12" x2="20" y2="12" stroke="white" strokeWidth="1.5"/>
              <line x1="6.3" y1="6.3" x2="17.7" y2="17.7" stroke="white" strokeWidth="1"/>
              <line x1="17.7" y1="6.3" x2="6.3" y2="17.7" stroke="white" strokeWidth="1"/>
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="w-full">

      {/* ── Single Ticker Bar ── */}
      <TickerBar />

      {/* Body */}
      <div className="bg-[#111111] text-white px-8 pt-16 pb-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12">

          {/* ── Col 1: Logo + tagline + socials ── */}
          <div className="flex flex-col gap-5">
            <Image src="/download.png" alt="LuminaWear Logo" width={80} height={80} className="object-contain" />
            <p className="font-sans text-[13px] text-neutral-400 tracking-wide">
              100% Independent&nbsp;•&nbsp;Label&nbsp;•&nbsp;Distributor&nbsp;•&nbsp;Publisher
            </p>
            <div className="flex items-center gap-4 mt-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="text-white hover:text-neutral-400 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Company ── */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-neutral-500">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-sans text-[15px] text-white hover:text-neutral-400 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Shop ── */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-neutral-500">
              Shop
            </p>
            <ul className="flex flex-col gap-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-sans text-[15px] text-white hover:text-neutral-400 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="max-w-[1400px] mx-auto mt-14 pt-6 border-t border-neutral-800">
          <p className="font-sans text-[12px] text-neutral-600 text-center">
            © {new Date().getFullYear()} LuminaWear. All rights reserved.
          </p>
        </div>
      </div>

      {/* Ticker animation */}
      <style jsx>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 18s linear infinite;
        }
      `}</style>
    </footer>
  );
}