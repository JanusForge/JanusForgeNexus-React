"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS, TOKEN_PACKAGES, getTierColor } from '@/config/tiers';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2, Zap, ShieldCheck } from 'lucide-react';

// Sub-component to handle search params safely in Next.js
function BillingContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (searchParams.get('success')) {
      setNotification({
        type: 'success',
        message: 'Payment Successful! Your tokens are being processed and will appear shortly.'
      });
    } else if (searchParams.get('canceled')) {
      setNotification({
        type: 'error',
        message: 'Payment Canceled. No charges were made.'
      });
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const currentTier = (user?.tier?.toLowerCase() || 'free') as keyof typeof TIER_CONFIGS;
  const tierConfig = TIER_CONFIGS[currentTier];

  const handlePurchase = async (pkg: any) => {
    setSelectedPackage(pkg.id);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: pkg.stripePriceId,
          userId: user?.id,
          tokens: pkg.tokens
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
      setSelectedPackage(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Token <span className="text-blue-500">Forge</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-medium">
            Power your conversations with the Council. High-reasoning models consume more energy—ensure your forge stays lit.
          </p>
        </header>

        {/* Status Notification */}
        {notification && (
          <div className={`max-w-4xl mx-auto mb-8 p-4 rounded-2xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${
            notification.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="font-bold text-sm uppercase tracking-tight">{notification.message}</p>
          </div>
        )}

        {/* Current Status */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-8 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Active Tier</div>
                <div className={`inline-block px-4 py-1 rounded-full ${getTierColor(currentTier)} text-white text-xs font-black uppercase`}>
                  {tierConfig.name}
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Available Energy</div>
                <div className="text-3xl font-black text-white mb-1">
                  {user ? ((user.tokens_remaining || 0) + (user.purchased_tokens || 0)).toLocaleString() : 0}
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">
                  {user?.tokens_remaining || 0} Monthly + {user?.purchased_tokens || 0} Purchased
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Usage Heat</div>
                <div className="text-3xl font-black text-blue-500 mb-1">
                  {user ? (tierConfig.monthly_tokens - (user.tokens_remaining || 0)) : 0}
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Consumed this cycle</div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Packages */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-2xl font-black mb-10 text-center uppercase italic tracking-tighter">Purchase Fuel Cells</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TOKEN_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`group relative bg-white/[0.02] rounded-3xl border ${selectedPackage === pkg.id ? 'border-blue-500' : 'border-white/10'} p-8 hover:bg-white/[0.05] transition-all`}
              >
                <div className="mb-8">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-black text-white mb-2">
                    ${pkg.price}
                  </div>
                  <div className="text-blue-400 text-sm font-bold uppercase tracking-widest">{pkg.tokens.toLocaleString()} Tokens</div>
                </div>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-center text-gray-400 text-xs font-medium">
                    <ShieldCheck size={14} className="text-green-500 mr-2" />
                    NON-EXPIRING FUEL
                  </li>
                  <li className="flex items-center text-gray-400 text-xs font-medium">
                    <Zap size={14} className="text-blue-500 mr-2" />
                    ALL COUNCIL ACCESS
                  </li>
                </ul>

                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={!!selectedPackage}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    pkg.id === 'ignition'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {selectedPackage === pkg.id ? <Loader2 className="animate-spin" size={16} /> : 'Acquire tokens'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Stripe Branding */}
        <div className="max-w-xl mx-auto text-center opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Secure Payments Powered By</p>
            <div className="flex justify-center grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
            </div>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense because of useSearchParams
export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <BillingContent />
    </Suspense>
  );
}
