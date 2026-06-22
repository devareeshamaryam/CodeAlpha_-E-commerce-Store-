 // components/CTABar.tsx
// Slim promo strip that sits above the main nav (e.g. "GET 10% OFF").
// Pure server component — no client JS needed for a static message,
// which keeps this part of the page free of any hydration cost.

interface CTABarProps {
  /** One or more promo messages. Multiple messages render side by side
   *  separated by a dot — swap in a marquee/rotator later if you need
   *  motion without changing the component's public API. */
  messages?: string[];
}

const DEFAULT_MESSAGES = ["GET 10% OFF"];

export default function CTABar({ messages = DEFAULT_MESSAGES }: CTABarProps) {
  return (
    <div className="w-full bg-black py-2.5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
        {messages.map((message, i) => (
          <span key={message}>
            {i > 0 && <span className="mx-3 opacity-50">&middot;</span>}
            {message}
          </span>
        ))}
      </p>
    </div>
  );
}