"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { TOKEN_PACKAGES } from '@/config/tiers';
import { Loader2 } from 'lucide-react';

const BACKEND_URL = 'https://janusforgenexus-backend.onrender.com';

export default function TokenPurchase() {
  const { user, isAuthenticated } = useAuth();
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
    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black mb-4">Your Nexus Energy</h3>
        <div className="text-gray-400 mb-2">Current Tokens:</div>
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {(user.tokens_remaining || 0).toLocaleString()}
        </div>
      </div>

      <h4 className="text-xl font-black mb-6 text-center">Add More Fuel</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOKEN_PACKAGES.map((pkg) => (
          <div key={pkg.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
            <h5 className="text-lg font-black text-center mb-2">{pkg.name}</h5>
            <p className="text-gray-400 text-sm text-center mb-4">{pkg.description}</p>
            <div className="text-3xl font-black text-center mb-4">
              {pkg.tokens.toLocaleString()}
            </div>
            <p className="text-center text-gray-400 uppercase text-xs tracking-widest mb-6">Tokens</p>
            <p className="text-2xl font-black text-center mb-6">${pkg.price}</p>
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={isRedirecting === pkg.id}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isRedirecting === pkg.id ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Purchase'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
