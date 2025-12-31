"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TOKEN_PACKAGES } from '@/config/tiers';
import { useRouter } from 'next/navigation';

export default function TokenPurchase() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePurchase = async (packageId: string) => {
    setSelectedPackage(packageId);
    setMessage(null);

    const pkg = TOKEN_PACKAGES.find(p => p.id === packageId);
    if (!pkg) return;

    try {
      // Connect to your live Render backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: pkg.stripePriceId, 
          userId: user?.id 
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect the Architect to the secure Stripe portal
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error("Purchase failed:", error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to initiate purchase. Please try again.'
      });
    } finally {
      setSelectedPackage('');
    }
  };

  const handleManageBilling = async () => {
    // Note: This requires a separate /api/stripe/create-portal-session endpoint
    // For now, we redirect to the local billing page
    router.push('/billing');
  };

  if (isLoading || !user) {
    return (
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Purchase Tokens</h3>

      <div className="mb-6">
        <div className="text-gray-400 mb-2">Your Current Tokens:</div>
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {((user?.tokens_remaining || 0) + (user?.purchased_tokens || 0)).toLocaleString()}
        </div>
        <div className="text-gray-300 text-sm mt-1">
          {user?.tokens_remaining || 0} monthly + {user?.purchased_tokens || 0} purchased
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {TOKEN_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`p-4 bg-gray-800/50 rounded-lg border ${selectedPackage === pkg.id ? 'border-blue-500' : 'border-gray-700'} hover:border-gray-600 transition-colors ${pkg.popular ? 'ring-1 ring-blue-500/50' : ''}`}
          >
            {pkg.popular && (
              <div className="inline-block px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded mb-2">
                POPULAR
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-white">{pkg.name}</h4>
                <div className="text-gray-300 text-sm">
                  {pkg.tokens.toLocaleString()} tokens • ${pkg.price}
                </div>
              </div>
              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={selectedPackage !== ''}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedPackage === pkg.id ? 'Connecting...' : 'Purchase'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'}`}>
          <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="space-y-4">
          <button
            onClick={handleManageBilling}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Review Subscription Details
          </button>

          <p className="text-gray-400 text-sm">
            Purchased tokens never expire. Monthly tokens reset on your billing date.
            All payments are processed securely via Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
