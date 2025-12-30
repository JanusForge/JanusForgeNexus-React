'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const BillingSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // Give the user 5 seconds to celebrate before redirecting to dashboard
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-blue-500/30 rounded-2xl p-8 text-center shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">FORGE REFUELED</h1>
        <p className="text-blue-400 font-mono text-sm mb-8 uppercase tracking-widest">Transaction Verified • Energy Restored</p>
        
        <div className="space-y-4 mb-8">
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-[loading_5s_linear_forwards]" />
          </div>
          <p className="text-zinc-500 text-xs">Redirecting to Council Chambers...</p>
        </div>

        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          ENTER DASHBOARD
        </button>
      </div>
    </div>
  );
};
