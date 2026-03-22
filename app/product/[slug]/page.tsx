import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import ProductActions from "@/components/ProductActions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | 420 Stoners Club`,
    description: product.description || `Premium streetwear: ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description || `Premium streetwear: ${product.name}`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#EEE9DF]">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8A9E7B] text-lg tracking-widest uppercase">
                No Image
              </div>
            )}

            {/* Sale Badge */}
            {product.on_sale && (
              <span className="absolute top-4 left-4 bg-[#3D6B35] text-white text-sm tracking-widest uppercase px-3 py-1.5 rounded-sm">
                Sale
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-[#1C2B1A] text-3xl md:text-4xl font-black mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                {product.on_sale && product.sale_price ? (
                  <div className="flex items-center gap-3">
                    <p className="text-[#3D6B35] text-3xl font-bold">
                      {formatCurrency(product.sale_price)}
                    </p>
                    <p className="text-[#B0A898] text-xl line-through">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                ) : (
                  <p className="text-[#1C2B1A] text-3xl font-bold">
                    {formatCurrency(product.price)}
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="text-[#1C2B1A] text-lg font-semibold mb-3">
                    Description
                  </h3>
                  <p className="text-[#666] leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Actions */}
              <ProductActions product={product} />
            </div>

            {/* Additional Info */}
            <div className="border-t border-[#E8E4DA] pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm text-[#666]">
                <div>
                  <p className="font-medium text-[#1C2B1A]">Free Shipping</p>
                  <p>On orders over GHS 200</p>
                </div>
                <div>
                  <p className="font-medium text-[#1C2B1A]">Returns</p>
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-12 text-xs tracking-widest text-[#8A9E7B] uppercase border-t border-[#E8E4DA] mt-16">
        © {new Date().getFullYear()} 420 Stoners Club · Est. in the Cloud.
        0244556677
        <br />
        <span className="text-[#8A9E7B] tracking-widest uppercase">
          Built with ❤️ by
          <a
            href="https://aducharlest.com/#contact"
            className="hover:text-[#1C2B1A] transition-colors ml-1"
          >
            CivicstackGh
          </a>
        </span>
      </footer>
    </main>
  );
}
