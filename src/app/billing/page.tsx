"use client";
import { TOKEN_PACKAGES } from '@/config/tiers';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const BACKEND_URL = 'https://janusforgenexus-backend.onrender.com';

function BillingContent() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);

  const isCanceled = searchParams.get('canceled') === 'true';

  const handlePurchase = async (pkg: any) => {
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
          mode: 'payment'
        }),
      });

      const data = await response.json();
      if (data.url) {
        router.push(data.url); // ← FIXED: use router instead of window.location
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
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Cancel Alert */}
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

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase">
            Add More Fuel
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Purchase non-expiring tokens to continue your journey with the Council.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TOKEN_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all group">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{pkg.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{pkg.description}</p>
                <div className="text-5xl font-black text-white mb-2">
                  {pkg.tokens.toLocaleString()}
                </div>
                <p className="text-gray-400 uppercase text-xs tracking-widest">Tokens</p>
              </div>
              <div className="text-center mb-8">
                <span className="text-4xl font-black text-white">${pkg.price}</span>
              </div>
              <button
                onClick={() => handlePurchase(pkg)}
                disabled={isRedirecting === pkg.id}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-70 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2"
              >
                {isRedirecting === pkg.id ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Purchase Fuel'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400">
            Current tokens: <span className="text-white font-bold">{user?.tokens_remaining?.toLocaleString() || 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return <BillingContent />;
}
