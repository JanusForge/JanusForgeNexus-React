"use client";
import { TOKEN_PACKAGES } from '@/config/tiers';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

const BACKEND_URL = 'https://janusforgenexus-backend.onrender.com';

function PricingContent() {
  // ✅ REPAIR: Removed isAuthenticated, added loading
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ REPAIR: Locally derive authentication status
  const isAuthenticated = !!user;
  const isOwner = user?.email === 'admin@janusforge.ai';

  // --- SAFETY ALERT LOGIC ---
  const isCanceled = searchParams.get('canceled') === 'true';

  const handleStripeCheckout = async (pkg: any) => {
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }

    setIsRedirecting(pkg.id);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: pkg.stripePriceId,
          userId: user?.id,
          tokens: pkg.tokens,
          mode: 'payment'
        }),
      });

      const data = await response.json();
      if (data.url) {
        // ✅ REPAIR: Using router.push instead of window.location for SPA performance
        router.push(data.url);
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsRedirecting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-24 selection:bg-blue-500/30">
      <div className="container mx-auto px-4">
        {/* --- SAFETY ALERT UI --- */}
        {isCanceled && (
          <div className="max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-top duration-500">
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center justify-center gap-4">
              <AlertTriangle className="text-red-500" size={20} />
              <p className="text-red-200 text-xs uppercase tracking-[0.2em] font-black text-center">
                Transaction Aborted. Your Forge energy remains at current levels.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase italic">
            The Nexus <span className="text-blue-500">Economy</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Fuel your Forge with non-expiring tokens. Pay only for what you use.
          </p>
        </div>

        {/* ONE-TIME FUEL TOP-UP */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">One-Time Fuel Top-Up</h2>
            <p className="text-gray-500 text-sm">Non-expiring tokens for intensive sessions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOKEN_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden">
                {/* Admin/Owner Badge [cite: 2025-11-27] */}
                {isOwner && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] px-3 py-1 font-black uppercase tracking-widest italic">
                    Authority Access
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{pkg.name}</h4>
                    <p className="text-xs text-gray-500">{pkg.description}</p>
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-lg text-blue-400 text-xs font-black">
                    ${pkg.price}
                  </div>
                </div>
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-3xl font-black text-white">{pkg.tokens.toLocaleString()}</span>
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Tokens</span>
                </div>
                <button
                  onClick={() => handleStripeCheckout(pkg)}
                  disabled={!!isRedirecting}
                  className="w-full py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  {isRedirecting === pkg.id ? <Loader2 size={14} className="animate-spin" /> : 'Purchase Fuel'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status Check for Owners */}
        {isOwner && (
          <div className="mt-16 text-center animate-pulse">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <ShieldCheck className="text-blue-500" size={14} />
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
                Master Reserve Active: {user?.tokens_remaining?.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense to prevent Next.js hydration errors with useSearchParams
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PricingContent />
    </Suspense>
  );
}
