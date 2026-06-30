 // components/Header.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home",    href: "/"        },
  { label: "Shop",    href: "/shop"    },
  { label: "Contact", href: "/contact" },
];

const HERO_PAGES       = ["/"];
const HERO_LOGO_SRC    = "/download.png"; // white logo, used on hero pages
const DEFAULT_LOGO_SRC = "/jello.png";    // black logo, used everywhere else

interface HeaderProps {
  logoSrc?:    string;
  logoAlt?:    string;
  navLinks?:   NavLink[];
  forceWhite?: boolean; // opt-in override for dark-background pages (e.g. /contact)
}

export default function Header({
  logoSrc,
  logoAlt    = "Empire",
  navLinks   = NAV_LINKS,
  forceWhite = false,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname   = usePathname();
  const { count, openCart } = useCart();

  const isHeroPage      = HERO_PAGES.includes(pathname);
  const useWhiteStyle    = isHeroPage || forceWhite;
  const textColor        = useWhiteStyle ? "text-white" : "text-black";
  const resolvedLogoSrc  = logoSrc ?? (useWhiteStyle ? HERO_LOGO_SRC : DEFAULT_LOGO_SRC);

  return (
    <header className={`relative z-50 w-full ${textColor}`}>
      <nav className="relative flex items-center justify-between px-6 py-5 sm:px-10 lg:px-14">

        {/* Left: nav links (desktop) */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="-ml-2 p-2 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Center: logo */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label={`${logoAlt} home`}
        >
          <Image
            src={resolvedLogoSrc}
            alt={logoAlt}
            width={200}
            height={200}
            priority
            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
          />
        </Link>

        {/* Right: search + cart */}
        <div className="flex items-center gap-5 sm:gap-6">
          <button
            type="button"
            aria-label="Search"
            className="hidden items-center gap-2 text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-70 sm:flex"
          >
            <SearchIcon />
            <span>Search</span>
          </button>

          {/* Cart — opens the drawer, shows live count */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 cursor-pointer"
          >
            <BagIcon />
            <span>{count}</span>
            {/* Badge — only visible when cart has items */}
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center leading-none">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className={`space-y-1 px-6 py-4 backdrop-blur-sm lg:hidden ${
            useWhiteStyle
              ? "bg-black/90 text-white"
              : "bg-white text-black border-t border-black/10"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}