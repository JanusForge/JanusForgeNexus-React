"use client";
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TOKEN_PACKAGES } from '@/config/tiers';
import { Loader2 } from 'lucide-react';

const BACKEND_URL = 'https://janusforgenexus-backend.onrender.com';

export default function TokenPurchase() {
  // ✅ REPAIR: Removed isAuthenticated from context destructuring
  const { user } = useAuth();
  
  // ✅ REPAIR: Derive authentication status locally
  const isAuthenticated = !!user;
  
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handlePurchase = async (pkg: any) => {
    setIsRedirecting(pkg.id);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: pkg.stripePriceId,
          userId: user.id,
          mode: 'payment'
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Checkout failed');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsRedirecting(null);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">Nexus Energy Reserve</h3>
        <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Current Capacity:</div>
        <div className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">
          {(user.tokens_remaining || 0).toLocaleString()}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

      <h4 className="text-xl font-black mb-10 text-center uppercase italic tracking-tighter text-white">Add More Fuel</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOKEN_PACKAGES.map((pkg) => (
          <div key={pkg.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all group">
            <h5 className="text-lg font-black text-center mb-2 uppercase italic tracking-tight text-white group-hover:text-purple-400 transition-colors">{pkg.name}</h5>
            <p className="text-zinc-500 text-[10px] font-bold text-center mb-6 uppercase tracking-widest leading-relaxed">{pkg.description}</p>
            
            <div className="bg-black/40 rounded-2xl py-6 mb-6">
               <div className="text-4xl font-black text-center text-white mb-1">
                 {pkg.tokens.toLocaleString()}
               </div>
               <p className="text-center text-zinc-600 uppercase text-[8px] font-black tracking-[0.4em]">Tokens</p>
            </div>

            <p className="text-2xl font-black text-center mb-8 text-white">${pkg.price}</p>
            
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={isRedirecting === pkg.id}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all disabled:opacity-50 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              {isRedirecting === pkg.id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Ignite Purchase'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
