 import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  alt?: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

// ─── Product Card Component ──────────────────────────────────────────────────

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      className="flex flex-col bg-white cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-black hover:shadow-md transition-shadow duration-200"
      onClick={() => onClick?.(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(product)}
    >
      {/* Image Area */}
      <div className="relative w-full bg-[#f0f0f0] overflow-hidden" style={{ paddingBottom: "105%" }}>
        <Image
          src={product.image}
          alt={product.alt ?? product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info Area */}
      <div className="px-1 pt-2 pb-4 flex flex-col gap-1">
        <p className="text-[13px] text-[#1a1a1a] leading-snug font-normal line-clamp-2">
          {product.name}
        </p>
        <p className="text-[13px] text-[#1a1a1a] font-normal">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

// ─── Demo Products ───────────────────────────────────────────────────────────

const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Young Dolph - King of Memphis (10 Yr Anniversary - Gold Crown Vinyl: D2C ...",
    price: 40.0,
    image: "/images/vinyl-gold.png",
  },
  {
    id: "2",
    name: "Young Dolph - King of Memphis (10 Yr Anniversary - Royalty Blue & Gold ...",
    price: 30.0,
    image: "/images/vinyl-blue-gold.png",
  },
  {
    id: "3",
    name: "EMPIRE x New Era 9FORTY Red Snapback",
    price: 45.0,
    image: "/images/snapback-red.png",
  },
  {
    id: "4",
    name: "EMPIRE 1M Hoodie",
    price: 80.0,
    image: "/images/hoodie-black.png",
  },
  {
    id: "5",
    name: "EMPIRE 1M Tee",
    price: 40.0,
    image: "/images/tee-black.png",
  },
];

// ─── Product Grid (Demo) ─────────────────────────────────────────────────────

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-6 py-8 bg-white max-w-[1400px] mx-auto">
      {DEMO_PRODUCTS.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onClick={(prod) => console.log("clicked", prod.name)}
        />
      ))}
    </div>
  );
}