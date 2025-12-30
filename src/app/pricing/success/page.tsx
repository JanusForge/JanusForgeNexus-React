'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PricingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect back to the dashboard after 8 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 8000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
      {/* The Energy Core Animation */}
      <div className="relative w-48 h-48 mb-12">
        <div className="absolute inset-0 bg-blue-600 rounded-full blur-[60px] animate-pulse opacity-30"></div>
        <div className="relative border border-blue-500/40 w-full h-full rounded-full flex items-center justify-center bg-zinc-900/40 backdrop-blur-xl shadow-[inset_0_0_40px_rgba(59,130,246,0.2)]">
          <div className="text-7xl animate-[bounce_2s_infinite]">⚡</div>
        </div>
      </div>

      <div className="text-center z-10">
        <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          FORGE REFUELED
        </h1>
        
        <p className="text-blue-500 uppercase tracking-[0.5em] text-xs font-bold mb-10">
          Nexus Energy Synchronized
        </p>
        
        <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-3xl max-w-md mx-auto shadow-2xl backdrop-blur-md">
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            The Pentarchy has acknowledged your contribution. Your vault is being credited with fresh tokens. The Council is standing by for your next interjection.
          </p>
          
          {/* Progress Bar */}
          <div className="relative w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 bg-blue-500 h-full animate-[loading_8s_linear] shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
          </div>
          
          <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
            <span>Initializing</span>
            <span>Synchronizing</span>
            <span>Ready</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 bg-white text-black font-black rounded-full hover:bg-blue-500 hover:text-white transition-all uppercase text-xs tracking-tighter"
          >
            Return to Dashboard
          </button>
          
          <Link 
            href="/conversations"
            className="text-zinc-500 hover:text-blue-400 transition-colors text-xs font-bold uppercase tracking-widest border-b border-zinc-900 hover:border-blue-400 pb-1"
          >
            Go to Live Panel
          </Link>
        </div>

        <p className="mt-16 text-[10px] text-zinc-700 uppercase tracking-[0.2em]">
          Thank you for supporting our veteran-owned AI platform.
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          20% { width: 10%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
