export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  on_sale: boolean;
  image_url?: string;
  image_path?: string;
  in_stock: boolean;
  slug: string;
  position: number;
  sizes?: string[]; // available product sizes (S, M, L, XL ...)
  total_sales?: number; // computed from orders for admin insights
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses?: number;
  uses_count: number;
  active: boolean;
  expires_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
