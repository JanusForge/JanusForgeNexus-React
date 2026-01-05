"use client";
import { TOKEN_PACKAGES } from '@/config/tiers';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const BACKEND_URL = 'https://janusforgenexus-backend.onrender.com';

export default function BillingPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);

  if (!isAuthenticated) {
    router.push('/login');
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
          userId: user?.id,
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
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase">
            Fuel Your Forge
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Add non-expiring tokens to continue your journey with the Council.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TOKEN_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all group">
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
                className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
              >
                {isRedirecting === pkg.id ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  'Purchase Fuel'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Current tokens: <span className="text-white font-bold">{(user as any)?.tokens_remaining || 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
