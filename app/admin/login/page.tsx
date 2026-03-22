'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    router.push('/admin');
  };

  return (
    <main className="min-h-screen bg-[#1C2B1A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-[#FDFCF8] text-2xl font-black tracking-tight mb-8">
          420 SC · Admin
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[#8A9E7B]" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[#8A9E7B]" />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit"
            className="w-full bg-[#3D6B35] text-white text-sm tracking-widest uppercase py-3 rounded-sm hover:bg-[#8A9E7B] transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
