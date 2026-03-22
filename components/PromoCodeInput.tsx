"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";

export default function PromoCodeInput() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const { setPromo, clearPromo, getSubtotal, promoCode } = useCartStore();

  const applyPromo = async () => {
    if (!code.trim()) return;
    setStatus("loading");

    const res = await fetch("/api/verify-promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.toUpperCase(),
        subtotal: getSubtotal(),
      }),
    });

    const data = await res.json();

    if (res.ok && data.discount) {
      setPromo(code.toUpperCase(), data.discount);
      setStatus("success");
      setMessage(`✓ ${data.message}`);
    } else {
      clearPromo();
      setStatus("error");
      setMessage(data.error || "Invalid promo code.");
    }
  };

  if (promoCode) {
    return (
      <div className="flex items-center justify-between text-sm py-2">
        <span className="text-[#3D6B35] tracking-wide">
          Code <strong>{promoCode}</strong> applied
        </span>
        <button
          onClick={() => {
            clearPromo();
            setCode("");
            setStatus("idle");
            setMessage("");
          }}
          className="text-xs text-[#B0A898] underline"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="PROMO CODE"
          className="flex-1 border border-[#E8E4DA] bg-transparent text-sm px-3 py-2.5
                     placeholder:text-[#C4BEB2] text-[#1C2B1A] tracking-widest uppercase
                     focus:outline-none focus:border-[#3D6B35] transition-colors rounded-sm"
        />
        <button
          onClick={applyPromo}
          disabled={status === "loading"}
          className="px-4 py-2.5 bg-[#1C2B1A] text-[#FDFCF8] text-sm tracking-[0.25em] uppercase
                     rounded-md hover:bg-[#3D6B35] transition-colors duration-200 font-medium
                     disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Apply"}
        </button>
      </div>
      {message && (
        <p
          className={`text-xs ${status === "success" ? "text-[#3D6B35]" : "text-red-500"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
