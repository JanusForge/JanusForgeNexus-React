"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Zap, Coins } from 'lucide-react';

export default function TierUpgrade() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Coins size={32} className="text-purple-400" />
        <div>
          <h3 className="text-2xl font-black text-white">Nexus Energy</h3>
          <p className="text-gray-400">You have {user.tokens_remaining?.toLocaleString() || 0} tokens remaining</p>
        </div>
      </div>

      <p className="text-gray-300 mb-6">
        Each query consumes 1 token. When you're ready for more, add fuel with one-time token packs.
      </p>

      <Link
        href="/pricing"
        className="inline-flex items-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-lg transition-all"
      >
        <Zap size={20} />
        Add More Tokens
      </Link>
    </div>
  );
}
