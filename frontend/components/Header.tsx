 // components/Header.tsx
// Transparent nav bar designed to sit on top of the Hero's background art.
// Center logo, left nav links (collapse to a hamburger on small screens),
// right search + cart. Client component only because of the mobile menu
// toggle, live cart count state, and the route-aware text color.

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

// Routes where the header floats on top of a dark/photo hero and needs
// light (white) text. Every other route gets dark (black) text since the
// header sits on a plain/light background there. Add more paths here if
// another page ever gets its own dark hero section.
const HERO_PAGES = ["/"];

// Two logo files: a white version for the hero page, a black version for
// every other page. Drop them in /public with these exact names, or pass
// a `logoSrc` prop to override per page.
const HERO_LOGO_SRC = "/download.png"; // white logo, used on hero pages
const DEFAULT_LOGO_SRC = "/jello.png"; // black logo, used everywhere else

interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  cartCount?: number;
  navLinks?: NavLink[];
}

export default function Header({
  logoSrc,
  logoAlt = "Empire",
  cartCount = 0,
  navLinks = NAV_LINKS,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHeroPage = HERO_PAGES.includes(pathname);
  const textColor = isHeroPage ? "text-white" : "text-black";
  const resolvedLogoSrc = logoSrc ?? (isHeroPage ? HERO_LOGO_SRC : DEFAULT_LOGO_SRC);

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
          <button
            type="button"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
          >
            <BagIcon />
            <span>{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className={`space-y-1 px-6 py-4 backdrop-blur-sm lg:hidden ${
            isHeroPage
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