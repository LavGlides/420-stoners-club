"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { Product } from "@/types";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    // Create a modified product with selected size in the name for cart differentiation
    const cartProduct = {
      ...product,
      name:
        product.sizes && product.sizes.length > 0
          ? `${product.name} (${selectedSize})`
          : product.name,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartProduct);
    }

    alert(`Added ${quantity} ${cartProduct.name} to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="text-[#1C2B1A] text-sm font-medium mb-3">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded border transition-colors ${
                  selectedSize === size
                    ? "bg-[#1C2B1A] border-[#1C2B1A] text-white"
                    : "border-[#1C2B1A]/20 text-[#1C2B1A] bg-white hover:bg-[#1C2B1A] hover:text-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-[#1C2B1A] text-sm font-medium mb-3">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded border border-[#1C2B1A]/20 flex items-center justify-center hover:bg-[#1C2B1A] hover:text-white transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center text-[#1C2B1A] font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded border border-[#1C2B1A]/20 flex items-center justify-center hover:bg-[#1C2B1A] hover:text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <span
          className={`text-sm font-medium ${
            product.in_stock ? "text-[#3D6B35]" : "text-red-600"
          }`}
        >
          {product.in_stock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!product.in_stock}
        className="w-full bg-[#1C2B1A] text-[#FDFCF8] text-sm tracking-[0.25em] uppercase
                   py-4 rounded-md hover:bg-[#3D6B35] transition-colors duration-200
                   font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.in_stock
          ? `Add to Cart - ${quantity} item${quantity > 1 ? "s" : ""}`
          : "Out of Stock"}
      </button>
    </div>
  );
}
