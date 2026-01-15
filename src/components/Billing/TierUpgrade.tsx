"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Zap, Coins } from 'lucide-react';

export default function TierUpgrade() {
  // ✅ REPAIR: Removed isAuthenticated from context destructuring
  const { user } = useAuth();

  // ✅ REPAIR: Locally derive authentication status
  const isAuthenticated = !!user;

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 mb-8 hover:border-purple-500/20 transition-all">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-purple-500/10 rounded-2xl">
          <Coins size={24} className="text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Nexus Energy</h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            Reserve: {user.tokens_remaining?.toLocaleString() || 0} tokens
          </p>
        </div>
      </div>

      <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
        Adversarial Council queries consume 1 token per cycle. Add fuel to your reserve to maintain high-frequency synthesis.
      </p>

      <Link
        href="/pricing"
        className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-600/20"
      >
        <Zap size={14} fill="white" />
        Add More Tokens
      </Link>
    </div>
  );
}
