"use client";
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function TokenUsage() {
  const { user } = useAuth();
  const [remainingTokens, setRemainingTokens] = useState<number>(0);

  useEffect(() => {
    if (user) {
      setRemainingTokens(user.tokens_remaining || 0);
    }
  }, [user]);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
      <Zap size={18} className="text-purple-400 fill-purple-400" />
      <span className="text-sm font-bold text-purple-300 uppercase tracking-tight">
        {remainingTokens.toLocaleString()} Tokens
      </span>
    </div>
  );
}
