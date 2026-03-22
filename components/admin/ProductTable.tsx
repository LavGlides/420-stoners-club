"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDeleted: () => void;
}

export default function ProductTable({ products, onEdit, onDeleted }: Props) {
  const supabase = createClient();
  const { success, error: showError } = useToast();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.product) return;

    try {
      const productName = deleteModal.product.name;

      // Delete image from storage first
      if (deleteModal.product.image_path) {
        await supabase.storage
          .from("product-images")
          .remove([deleteModal.product.image_path]);
      }

      await supabase.from("products").delete().eq("id", deleteModal.product.id);
      success(`✓ ${productName} removed from your collection`);
      onDeleted();
    } catch (err) {
      console.error(err);
      showError("Failed to delete product. Please try again.");
    } finally {
      setDeleteModal({ isOpen: false, product: null });
    }
  };

  const toggleSale = async (product: Product) => {
    setLoadingId(product.id);
    try {
      const { error } = await supabase
        .from("products")
        .update({ on_sale: !product.on_sale })
        .eq("id", product.id);

      if (error) throw error;

      success(product.on_sale ? "✓ Sale ended" : "✓ Product on sale");
      onDeleted(); // re-fetch
    } catch (err) {
      console.error(err);
      showError("Failed to update sale status. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40 text-sm tracking-widest uppercase mb-2">
          No products yet
        </p>
        <p className="text-white/20 text-xs">
          Add your first product above to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-[#8A9E7B] text-xs tracking-widest uppercase">
              <th className="pb-3 pr-4">Product</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Sale</th>
              <th className="pb-3 pr-4">Stock</th>
              <th className="pb-3 pr-4">Total Sold</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 pr-4 text-white/80">{p.name}</td>
                <td className="py-3 pr-4 text-white/60">
                  GHS {p.price}
                  {p.on_sale && p.sale_price && (
                    <span className="ml-2 text-[#8A9E7B]">
                      → {p.sale_price}
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => toggleSale(p)}
                    disabled={loadingId === p.id}
                    className={`text-xs px-2 py-1 rounded-sm transition-colors ${
                      loadingId === p.id
                        ? "opacity-50 cursor-not-allowed"
                        : p.on_sale
                          ? "bg-[#3D6B35] text-white hover:bg-[#2d5629]"
                          : "border border-white/20 text-white/40 hover:text-white"
                    }`}
                  >
                    {loadingId === p.id ? "..." : p.on_sale ? "On Sale" : "Off"}
                  </button>
                </td>
                <td className="py-3 pr-4 text-xs text-[#8A9E7B]">
                  {p.total_sales && p.total_sales > 0
                    ? `${p.total_sales} sold`
                    : "-"}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`text-xs ${p.in_stock ? "text-[#8A9E7B]" : "text-red-400"}`}
                  >
                    {p.in_stock ? "In Stock" : "Out"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(p)}
                      className="text-xs text-white/40 hover:text-white/80 underline transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p)}
                      className="text-xs text-red-400/60 hover:text-red-400 underline transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Product?"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, product: null })}
      />
    </>
  );
}
