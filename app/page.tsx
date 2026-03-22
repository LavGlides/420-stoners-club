import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("position", { ascending: true })
    .limit(5);

  return (
    <main className="min-h-screen bg-[#FDFCF8]">
      <Navbar />
      <HeroSection />

      {/* Products Grid */}
      <section id="collection" className="px-4 py-16 max-w-7xl mx-auto">
        <h2
          className="text-xs tracking-[0.3em] uppercase text-[#8A9E7B] mb-10 text-center"
          style={{ fontFamily: "var(--font-body)" }}
        >
          The Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-[#8A9E7B] text-sm tracking-widest uppercase mb-4">
                Coming Soon
              </p>
              <p className="text-[#B0A898] text-xs max-w-md mx-auto leading-relaxed">
                New drops are on the way. Check back soon for limited releases
                and premium streetwear.
              </p>
              <a
                href="#"
                className="inline-block mt-6 text-xs tracking-widest uppercase text-[#1C2B1A] border border-[#1C2B1A] px-6 py-3 hover:bg-[#1C2B1A] hover:text-[#FDFCF8] transition-colors"
              >
                Notify Me
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-xs tracking-widest text-[#8A9E7B] uppercase border-t border-[#E8E4DA]">
        © {new Date().getFullYear()} 420 Stoners Club · Est. in the Cloud.
        0244556677
        <br />
        <span className="text-[#8A9E7B] tracking-widest uppercase">
          Built with ❤️ by
          <a
            href="https://aducharlest.com/#contact"
          >
            CivicstackGh
          </a>
        </span>
      </footer>
    </main>
  );
}
