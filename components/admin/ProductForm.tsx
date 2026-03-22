"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { useToast } from "@/components/Toast";

interface Props {
  product?: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSaved, onCancel }: Props) {
  const supabase = createClient();
  const { success, error: showError } = useToast();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [position, setPosition] = useState("0");
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStock, setInStock] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
      setSalePrice(String(product.sale_price ?? ""));
      setOnSale(product.on_sale);
      setDescription(product.description ?? "");
      setSlug(product.slug);
      setPosition(String(product.position));
      setSizes(product.sizes ?? []);
      setInStock(product.in_stock);
    } else {
      // Reset
      setName("");
      setPrice("");
      setSalePrice("");
      setOnSale(false);
      setDescription("");
      setSlug("");
      setPosition("0");
      setInStock(true);
      setImageFile(null);
    }
  }, [product]);

  // Auto-generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Remove multiple hyphens
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-update slug if it's empty or still matches old name pattern
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setSalePrice("");
    setOnSale(false);
    setDescription("");
    setSlug("");
    setPosition("0");
    setSizes([]);
    setInStock(true);
    setImageFile(null);
  };

  const uploadImage = async (
    file: File,
  ): Promise<{ url: string; path: string }> => {
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return { url: data.publicUrl, path };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = product?.image_url;
      let imagePath = product?.image_path;

      if (imageFile) {
        // Delete old image if editing
        if (product?.image_path) {
          await supabase.storage
            .from("product-images")
            .remove([product.image_path]);
        }
        const uploaded = await uploadImage(imageFile);
        imageUrl = uploaded.url;
        imagePath = uploaded.path;
      }

      const payload = {
        name,
        price: parseFloat(price),
        sale_price: salePrice ? parseFloat(salePrice) : null,
        on_sale: onSale,
        description,
        slug,
        position: parseInt(position),
        sizes,
        in_stock: inStock,
        image_url: imageUrl,
        image_path: imagePath,
      };

      if (product) {
        await supabase.from("products").update(payload).eq("id", product.id);
        success(`✓ ${name} updated successfully`);
      } else {
        await supabase.from("products").insert(payload);
        success(`✓ ${name} added to your collection`);
        resetForm();
      }

      onSaved();
    } catch (err) {
      console.error(err);
      showError("Failed to save product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 rounded-sm p-6 mb-8 space-y-4"
    >
      <h2 className="text-sm tracking-widest uppercase text-[#8A9E7B]">
        {product ? "Edit Product" : "Add Product"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminInput
          label="Name"
          value={name}
          onChange={handleNameChange}
          required
        />
        <AdminInput
          label="Slug (URL)"
          value={slug}
          onChange={setSlug}
          required
        />
        <AdminInput
          label="Price (GHS)"
          type="number"
          value={price}
          onChange={setPrice}
          required
        />
        <AdminInput
          label="Sale Price"
          type="number"
          value={salePrice}
          onChange={setSalePrice}
        />
        <AdminInput
          label="Position"
          type="number"
          value={position}
          onChange={setPosition}
        />
      </div>

      <div className="pt-3 space-y-2 border-t border-white/10">
        <p className="text-xs text-white/40 tracking-widest uppercase">
          Available Sizes
        </p>
        <div className="grid grid-cols-4 gap-2">
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size],
                )
              }
              className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
                sizes.includes(size)
                  ? "bg-[#3D6B35] border-[#3D6B35] text-white"
                  : "border-white/20 text-white/40 hover:border-white/60 hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <AdminInput
        label="Description"
        value={description}
        onChange={setDescription}
      />

      <AdminInput
        label="Description"
        value={description}
        onChange={setDescription}
      />

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
            className="accent-[#3D6B35]"
          />
          On Sale
        </label>
        <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="accent-[#3D6B35]"
          />
          In Stock
        </label>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-xs text-white/40 mb-1 tracking-widest uppercase">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3
                     file:bg-[#3D6B35] file:text-white file:border-0 file:text-xs
                     file:rounded-sm file:cursor-pointer"
        />
        {product?.image_url && !imageFile && (
          <p className="text-xs text-white/30 mt-1">
            Current image will be kept unless replaced.
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={uploading}
          className="px-5 py-2.5 bg-[#3D6B35] text-white text-xs tracking-widest uppercase rounded-sm hover:bg-[#8A9E7B] transition-colors disabled:opacity-50"
        >
          {uploading ? "Saving..." : product ? "Update" : "Add Product"}
        </button>
        {product && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-white/20 text-white/50 text-xs tracking-widest uppercase rounded-sm hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1 tracking-widest uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5
                   focus:outline-none focus:border-[#8A9E7B] rounded-sm placeholder:text-white/20"
      />
    </div>
  );
}
