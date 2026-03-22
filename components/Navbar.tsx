"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCF8]/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="420 Stoners Club"
          width={60}
          height={60}
          priority
          style={{ width: "auto", height: "auto" }}
        />
        <span className="text-[#1C2B1A] text-sm tracking-[0.25em] uppercase font-semibold hidden sm:inline">
          420 Stoners Club
        </span>
      </Link>
      <Link href="/cart" className="relative text-[#1C2B1A]">
        <ShoppingBag size={22} />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#3D6B35] text-white text-[10px] rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    </nav>
  );
}
