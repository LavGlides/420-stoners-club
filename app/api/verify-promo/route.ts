import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();

  if (!code) return NextResponse.json({ error: 'No code provided.' }, { status: 400 });

  const supabase = await createClient();
  const { data: promo } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .single();

  if (!promo) return NextResponse.json({ error: 'Promo code not found.' }, { status: 404 });

  // Check expiry
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This promo code has expired.' }, { status: 400 });
  }

  // Check usage limit
  if (promo.max_uses && promo.uses_count >= promo.max_uses) {
    return NextResponse.json({ error: 'Promo code usage limit reached.' }, { status: 400 });
  }

  // Check minimum order
  if (subtotal < promo.min_order) {
    return NextResponse.json({
      error: `Minimum order of ${promo.min_order} required.`,
    }, { status: 400 });
  }

  const discount =
    promo.discount_type === 'percentage'
      ? (subtotal * promo.discount_value) / 100
      : promo.discount_value;

  return NextResponse.json({
    discount: parseFloat(discount.toFixed(2)),
    message: `${promo.discount_type === 'percentage' ? promo.discount_value + '% off' : promo.discount_value + ' off'} applied!`,
  });
}
