'use client';
import { useCartStore } from '@/lib/store/cartStore';
import { createClient } from '@/lib/supabase/client';

interface PaystackButtonProps {
  email: string;
  onSuccess?: (reference: string) => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaystackButton({ email, onSuccess }: PaystackButtonProps) {
  const { getTotal, items, promoCode, discount, clearCart } = useCartStore();

  const handlePayment = () => {
    const total = getTotal();
    if (total <= 0 || !email) return;

    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => initiatePayment();
      document.head.appendChild(script);
    } else {
      initiatePayment();
    }
  };

  const initiatePayment = async () => {
    const total = getTotal();
    const reference = `SC-${Date.now()}`;

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email,
      amount: Math.round(total * 100), // Paystack uses kobo/pesewas
      currency: 'GHS', // Change to NGN, USD, etc. as needed
      ref: reference,
      metadata: {
        items: items.map((i) => ({ id: i.product.id, name: i.product.name, qty: i.quantity })),
        promo_code: promoCode,
      },
      callback: async (response: { reference: string }) => {
        // Save order to Supabase
        const supabase = createClient();
        await supabase.from('orders').insert({
          reference: response.reference,
          email,
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            qty: i.quantity,
            price: i.product.on_sale ? i.product.sale_price : i.product.price,
          })),
          subtotal: useCartStore.getState().getSubtotal(),
          discount,
          total,
          promo_code: promoCode,
          status: 'paid',
        });

        clearCart();
        onSuccess?.(response.reference);
        alert(`✅ Payment successful! Ref: ${response.reference}`);
      },
      onClose: () => {
        console.log('Payment modal closed');
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-[#1C2B1A] text-[#FDFCF8] text-sm tracking-[0.25em] uppercase
                 py-4 rounded-md hover:bg-[#3D6B35] transition-colors duration-200
                 font-medium"
    >
      Pay with Paystack
    </button>
  );
}
