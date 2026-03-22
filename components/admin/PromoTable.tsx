'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PromoCode } from '@/types';

export default function PromoTable({ promos, onSaved }: { promos: PromoCode[]; onSaved: () => void }) {
  const supabase = createClient();
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('0');
  const [maxUses, setMaxUses] = useState('');

  const addPromo = async () => {
    if (!code || !value) return;
    await supabase.from('promo_codes').insert({
      code: code.toUpperCase(),
      discount_type: type,
      discount_value: parseFloat(value),
      min_order: parseFloat(minOrder),
      max_uses: maxUses ? parseInt(maxUses) : null,
    });
    setCode(''); setValue(''); setMinOrder('0'); setMaxUses('');
    onSaved();
  };

  const toggleActive = async (p: PromoCode) => {
    await supabase.from('promo_codes').update({ active: !p.active }).eq('id', p.id);
    onSaved();
  };

  const deletePromo = async (id: string) => {
    await supabase.from('promo_codes').delete().eq('id', id);
    onSaved();
  };

  return (
    <div>
      {/* Add Promo */}
      <div className="bg-white/5 border border-white/10 rounded-sm p-6 mb-8">
        <h2 className="text-sm tracking-widest uppercase text-[#8A9E7B] mb-4">New Promo Code</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="CODE"
            className="bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#8A9E7B] uppercase tracking-widest" />
          <select value={type} onChange={(e) => setType(e.target.value as any)}
            className="bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none">
            <option value="percentage">Percentage %</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input value={value} onChange={(e) => setValue(e.target.value)}
            placeholder="Value (e.g. 10)"
            type="number"
            className="bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#8A9E7B]" />
          <input value={minOrder} onChange={(e) => setMinOrder(e.target.value)}
            placeholder="Min Order"
            type="number"
            className="bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none" />
          <input value={maxUses} onChange={(e) => setMaxUses(e.target.value)}
            placeholder="Max Uses (blank = unlimited)"
            type="number"
            className="bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none" />
        </div>
        <button onClick={addPromo}
          className="px-5 py-2.5 bg-[#3D6B35] text-white text-xs tracking-widest uppercase rounded-sm hover:bg-[#8A9E7B] transition-colors">
          Add Promo
        </button>
      </div>

      {/* Promos List */}
      <div className="space-y-2">
        {promos.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-sm">
            <div>
              <span className="text-white font-mono text-sm">{p.code}</span>
              <span className="ml-3 text-white/40 text-xs">
                {p.discount_type === 'percentage' ? `${p.discount_value}%` : `GHS ${p.discount_value}`} off
                {p.min_order > 0 && ` · min GHS ${p.min_order}`}
                {p.max_uses && ` · ${p.uses_count}/${p.max_uses} used`}
              </span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => toggleActive(p)}
                className={`text-xs px-2 py-1 rounded-sm ${p.active ? 'bg-[#3D6B35] text-white' : 'border border-white/20 text-white/40'}`}>
                {p.active ? 'Active' : 'Inactive'}
              </button>
              <button onClick={() => deletePromo(p.id)}
                className="text-xs text-red-400/60 hover:text-red-400 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}