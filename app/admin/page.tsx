"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product, PromoCode } from "@/types";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";
import PromoTable from "@/components/admin/PromoTable";
import BannerSettingsConfig from "@/components/admin/BannerSettings";
import { ToastProvider } from "@/components/Toast";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [tab, setTab] = useState<"products" | "promos">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const supabase = createClient();

  const fetchProducts = async () => {
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("position");

    // Get total sales from materialized view
    const { data: salesData } = await supabase
      .from("product_total_sales")
      .select("id, total_sales");

    const salesMap = new Map(
      salesData?.map((s) => [s.id, s.total_sales]) || [],
    );

    setProducts(
      (productsData ?? []).map((prod) => ({
        ...prod,
        total_sales: salesMap.get(prod.id) || 0,
      })),
    );
  };

  const fetchPromos = async () => {
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setPromos(data ?? []);
  };

  useEffect(() => {
    fetchProducts();
    fetchPromos();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin-login";
  };

  return (
    <ToastProvider>
      <main className="min-h-screen bg-[#0D1A0C] text-[#FDFCF8]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="420 Stoners Club" className="w-10 h-10" />
            <span className="text-sm tracking-widest uppercase text-[#8A9E7B]">
              Admin · 420 SC
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            {(["products", "promos"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs tracking-widest uppercase px-4 py-2 rounded-sm transition-colors ${
                  tab === t
                    ? "bg-[#3D6B35] text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "products" && (
            <>
              <BannerSettingsConfig />
              <ProductForm
                product={editingProduct}
                onSaved={() => {
                  setEditingProduct(null);
                  fetchProducts();
                }}
                onCancel={() => setEditingProduct(null)}
              />
              <ProductTable
                products={products}
                onEdit={setEditingProduct}
                onDeleted={fetchProducts}
              />
            </>
          )}

          {tab === "promos" && (
            <PromoTable promos={promos} onSaved={fetchPromos} />
          )}
        </div>
      </main>
    </ToastProvider>
  );
}
