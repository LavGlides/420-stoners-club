"use client";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="flex flex-col">
        {/* Image */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-md bg-[#EEE9DF] mb-3">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8A9E7B] text-xs tracking-widest uppercase">
              No Image
            </div>
          )}

          {/* Sale Badge */}
          {product.on_sale && (
            <span className="absolute top-2 left-2 bg-[#3D6B35] text-white text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm">
              Sale
            </span>
          )}

          {/* Quick Add — appears on hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="absolute bottom-0 left-0 right-0 bg-[#1C2B1A] text-[#FDFCF8] text-sm tracking-[0.25em] uppercase py-3
                       translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 hover:bg-[#3D6B35]
                       transition-all duration-300 font-medium"
          >
            Add to Cart
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-start">
            <p className="text-[#1C2B1A] text-sm font-medium truncate">
              {product.name}
            </p>
            <div className="text-right ml-2">
              {product.on_sale && product.sale_price ? (
                <>
                  <p className="text-[#3D6B35] text-sm font-semibold">
                    {formatCurrency(product.sale_price)}
                  </p>
                  <p className="text-[#B0A898] text-xs line-through">
                    {formatCurrency(product.price)}
                  </p>
                </>
              ) : (
                <p className="text-[#1C2B1A] text-sm font-medium">
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>
          </div>
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-[9px] px-1.5 py-0.5 rounded border border-[#1C2B1A]/10 text-[#666] bg-[#FDFCF8]"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[9px] px-1.5 py-0.5 text-[#666]">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
