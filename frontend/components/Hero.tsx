 // components/Hero.tsx
// Full-bleed, image-only hero carousel. No headline/eyebrow/CTA text and no
// arrow controls — slides advance automatically on a fast interval and keep
// playing even on hover/focus, with dot indicators for manual navigation.
// Client component for the slide state and autoplay. Only the active
// slide's image is mounted at a time, so the browser never downloads more
// than one hero image at once.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface HeroSlide {
  id: string;
  image: string;
  imageAlt: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  { id: "slide-1", image: "/hello1.jpeg", imageAlt: "" },
  { id: "slide-2", image: "/hello2.jpeg", imageAlt: "" },
  { id: "slide-3", image: "/hello1.jpeg", imageAlt: "" },
  { id: "slide-4", image: "/hello1.jpegs", imageAlt: "" },
];

// Fast autoplay — slides change every 1.8s.
const AUTOPLAY_MS = 1800;

interface HeroProps {
  slides?: HeroSlide[];
  autoplay?: boolean;
  autoplayMs?: number;
}

export default function Hero({
  slides = DEFAULT_SLIDES,
  autoplay = true,
  autoplayMs = AUTOPLAY_MS,
}: HeroProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length],
  );

  // Autoplay — keeps running on hover/focus; only reduced-motion users
  // (or autoplay={false}) skip it.
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, autoplayMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, autoplayMs, slides.length]);

  const slide = slides[index];

  return (
    <section
      className="relative isolate flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-stone-900"
      aria-roledescription="carousel"
      aria-label="Featured releases"
    >
      {/* Background art — only the active slide is mounted */}
      <div className="absolute inset-0">
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.imageAlt}
          fill
          priority
          sizes="100vw"
          className="animate-fade-in object-cover"
        />
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="relative z-10 flex w-full items-center justify-center gap-2 pb-6">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}