"use client";

import { TIER_CONFIGS, TOKEN_PACKAGES } from '@/config/tiers';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState, Suspense } from 'react'; // Added Suspense for Next.js safety
import { useSearchParams } from 'next/navigation'; // Added this import
import { Loader2, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';

// We wrap the content in a small inner component because useSearchParams 
// requires a Suspense boundary in Next.js App Router
function PricingContent() {
  const { user, isAuthenticated } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  // --- SAFETY ALERT LOGIC ---
  const isCanceled = searchParams.get('canceled') === 'true';

  const BACKEND_URL = 'https://janusforgenexus-backend-1.onrender.com';

  const isPopularTier = (tierKey: string) => tierKey === 'pro';

  const handleStripeCheckout = async (item: any, mode: 'payment' | 'subscription') => {
    if (!isAuthenticated) {
      window.location.href = `/register?tier=${item.id || 'free'}`;
      return;
    }

    setIsRedirecting(item.id);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: item.stripePriceId,
          userId: user?.id,
          tokens: item.tokens || item.monthly_tokens || 0,
          mode: mode
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
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

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
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
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase">
            The Nexus <span className="text-blue-500">Economy</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Choose a monthly tier for consistent access or top up your forge with one-time fuel packs.
          </p>
        </div>

        {/* SUBSCRIPTION TIERS */}
        <div className="flex justify-center mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
            {Object.entries(TIER_CONFIGS)
              .filter(([tierKey]) => tierKey !== 'admin' && tierKey !== 'enterprise')
              .map(([tierKey, tier]) => {
                const isPopular = isPopularTier(tierKey);
                const tierWithId = { ...tier, id: tierKey };

                return (
                  <div
                    key={tierKey}
                    className={`flex flex-col rounded-3xl border transition-all duration-300 ${
                      isPopular
                        ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_40px_rgba(37,99,235,0.1)] scale-105 z-10'
                        : 'border-white/10 bg-white/5'
                    } p-8 relative`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">{tier.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white">${tier.price}</span>
                        <span className="text-gray-500 text-sm font-bold">/mo</span>
                      </div>
                    </div>

                    <ul className="flex-1 space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Zap size={12} className="text-blue-400" />
                        </div>
                        {tier.monthly_tokens.toLocaleString()} Tokens / month
                      </li>
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                          <ShieldCheck size={16} className="text-white/20" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => tierKey !== 'free' && handleStripeCheckout(tierWithId, 'subscription')}
                      disabled={isRedirecting === tierKey}
                      className={`w-full py-4 text-center font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                        tierKey === 'free' ? 'bg-white/5 text-gray-500 cursor-not-allowed' :
                        isPopular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isRedirecting === tierKey ? <Loader2 size={16} className="animate-spin" /> :
                       tierKey === 'free' ? 'Default Access' : 'Upgrade Nexus'}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ONE-TIME FUEL TOP-UP */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">One-Time Fuel Top-Up</h2>
            <p className="text-gray-500 text-sm">Non-expiring tokens for intensive sessions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOKEN_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
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
                  onClick={() => handleStripeCheckout(pkg, 'payment')}
                  disabled={!!isRedirecting}
                  className="w-full py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {isRedirecting === pkg.id ? <Loader2 size={14} className="animate-spin" /> : 'Purchase Fuel'}
                </button>
              </div>
            ))}
          </div>
        </div>
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
