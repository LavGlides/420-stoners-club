"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PromoCodeInput from "@/components/PromoCodeInput";
import PaystackButton from "@/components/PaystackButton";
import { useCartStore } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, discount } =
    useCartStore();
  const [email, setEmail] = useState("");

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FDFCF8]">
        <Navbar />
        <div className="pt-24 px-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-[#8A9E7B] hover:text-[#1C2B1A] transition-colors text-sm sm:text-base"
            >
              ← Back
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-[#1C2B1A] tracking-tight">
              Your Bag
            </h1>
            <div className="w-8 sm:w-12"></div> {/* Spacer for centering */}
          </div>
          <div className="text-center">
            <p className="text-[#8A9E7B] text-sm tracking-widest uppercase">
              Your bag is empty
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8]">
      <Navbar />
      <div className="pt-24 px-4 pb-32 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-[#8A9E7B] hover:text-[#1C2B1A] transition-colors text-sm sm:text-base"
          >
            ← Back
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-[#1C2B1A] tracking-tight">
            Your Bag
          </h1>
          <div className="w-8 sm:w-12"></div> {/* Spacer for centering */}
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4">
              <div className="relative w-20 h-24 rounded-sm overflow-hidden bg-[#EEE9DF] shrink-0">
                {product.image_url && (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, 80px"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1C2B1A]">
                  {product.name}
                </p>
                <p className="text-xs text-[#8A9E7B] mt-0.5">
                  {formatCurrency(
                    product.on_sale && product.sale_price
                      ? product.sale_price
                      : product.price,
                  )}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 border border-[#E8E4DA] text-[#1C2B1A] flex items-center justify-center text-sm rounded-sm"
                  >
                    −
                  </button>
                  <span className="text-sm text-[#1C2B1A] w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-7 h-7 border border-[#E8E4DA] text-[#1C2B1A] flex items-center justify-center text-sm rounded-sm"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-xs text-[#B0A898] ml-2 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo */}
        <div className="mb-6">
          <PromoCodeInput />
        </div>

        {/* Totals */}
        <div className="border-t border-[#E8E4DA] pt-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm text-[#8A9E7B]">
            <span>Subtotal</span>
            <span>{formatCurrency(getSubtotal())}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-[#3D6B35]">
              <span>Discount</span>
              <span>−{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-[#1C2B1A]">
            <span>Total</span>
            <span>{formatCurrency(getTotal())}</span>
          </div>
        </div>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-[#E8E4DA] bg-transparent text-sm px-3 py-3 mb-4
                     placeholder:text-[#C4BEB2] text-[#1C2B1A] focus:outline-none
                     focus:border-[#3D6B35] transition-colors rounded-sm"
        />

        {/* Paystack CTA */}
        <PaystackButton email={email} />

        {/* Pay on Delivery option */}
        <p className="text-center text-xs text-[#B0A898] mt-3 tracking-wide">
          Or call to arrange{" "}
          <span className="underline cursor-pointer">Pay on Delivery</span>
        </p>
      </div>
    </main>
  );
}
