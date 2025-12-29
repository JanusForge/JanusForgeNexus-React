"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS, TOKEN_PACKAGES, getTierColor } from '@/config/tiers';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2, Zap, ShieldCheck, Clock } from 'lucide-react';

function BillingContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const BACKEND_URL = 'https://janusforgenexus-backend-1.onrender.com';

  useEffect(() => {
    if (searchParams.get('success')) {
      setNotification({ type: 'success', message: 'Payment Successful! Your forge is refueled.' });
    } else if (searchParams.get('canceled')) {
      setNotification({ type: 'error', message: 'Payment Canceled.' });
    }

    if (user?.id) {
      fetch(`${BACKEND_URL}/api/v1/billing/history/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setHistory(Array.isArray(data) ? data : []);
          setIsHistoryLoading(false);
        })
        .catch(() => setIsHistoryLoading(false));
    }
  }, [searchParams, user?.id]);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-blue-500 w-12 h-12" /></div>;
  if (!isAuthenticated) { router.push('/login'); return null; }

  const currentTier = (user?.tier?.toLowerCase() || 'free') as keyof typeof TIER_CONFIGS;
  const tierConfig = TIER_CONFIGS[currentTier];

  const handlePurchase = async (pkg: any) => {
    setSelectedPackage(pkg.id);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: pkg.stripePriceId, userId: user?.id, tokens: pkg.tokens, mode: 'payment' }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
      setSelectedPackage(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Token <span className="text-blue-500">Forge</span></h1>
        </header>

        {/* Current Status Widget */}
        <div className="max-w-4xl mx-auto mb-16 bg-white/[0.03] rounded-3xl border border-white/10 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div><div className="text-gray-500 text-[10px] font-black uppercase mb-3 tracking-widest">Active Tier</div><div className={`inline-block px-4 py-1 rounded-full ${getTierColor(currentTier)} text-white text-xs font-black uppercase`}>{tierConfig.name}</div></div>
                <div><div className="text-gray-500 text-[10px] font-black uppercase mb-3 tracking-widest">Energy</div><div className="text-3xl font-black text-white">{user?.token_balance?.toLocaleString() || 0}</div></div>
                <div><div className="text-gray-500 text-[10px] font-black uppercase mb-3 tracking-widest">Type</div><div className="text-blue-500 text-xs font-black uppercase tracking-widest italic">Fusion Core</div></div>
            </div>
        </div>

        {/* Token Packages */}
        <div className="max-w-6xl mx-auto mb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {TOKEN_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="bg-white/[0.02] rounded-3xl border border-white/10 p-8 hover:bg-white/[0.05] transition-all">
                    <h3 className="text-xl font-black uppercase mb-2">{pkg.name}</h3>
                    <div className="text-4xl font-black mb-4">${pkg.price}</div>
                    <button onClick={() => handlePurchase(pkg)} disabled={!!selectedPackage} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-xs uppercase tracking-widest">
                        {selectedPackage === pkg.id ? <Loader2 className="animate-spin mx-auto" size={16}/> : 'Acquire tokens'}
                    </button>
                </div>
            ))}
        </div>

        {/* TRANSACTION LOGS */}
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3"><Clock size={20} className="text-blue-500" /> Nexus Log: Recent Acquisitions</h3>
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead><tr className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/10"><th className="px-8 py-4">Timestamp</th><th className="px-8 py-4">Tier</th><th className="px-8 py-4">Energy</th><th className="px-8 py-4 text-right">Status</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {history.map((tx) => (
                  <tr key={tx.id} className="text-xs">
                    <td className="px-8 py-5 text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-5 font-black uppercase">{tx.packageName}</td>
                    <td className="px-8 py-5 text-blue-400 font-bold">+{tx.tokens.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right"><span className="text-green-500 bg-green-500/10 px-2 py-1 rounded font-black uppercase">Authorized</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() { return <Suspense fallback={<div className="min-h-screen bg-black" />}><BillingContent /></Suspense>; }
