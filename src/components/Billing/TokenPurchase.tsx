"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TOKEN_PACKAGES, TIER_CONFIGS, type UserTier } from '@/config/tiers';

export default function TokenPurchase() {
  const { user, purchaseTokenPackage, isLoading } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      setMessage({ type: 'error', text: 'Please select a token package' });
      return;
    }

    setMessage(null);
    const result = await purchaseTokenPackage(selectedPackage);
    
    if (result.success) {
      const pkg = TOKEN_PACKAGES.find(p => p.id === selectedPackage);
      setMessage({ 
        type: 'success', 
        text: `Successfully purchased ${pkg?.tokens} tokens!` 
      });
      setSelectedPackage('');
    } else {
      setMessage({ 
        type: 'error', 
        text: result.error || 'Purchase failed. Please try again.' 
      });
    }
  };

  if (!user) return null;

  const currentTier = TIER_CONFIGS[user.tier];

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Token Balance</h2>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user.tokens_remaining + user.purchased_tokens}
            </div>
            <div className="text-sm text-gray-400">
              <div>Monthly: {user.tokens_remaining} remaining</div>
              <div>Purchased: {user.purchased_tokens} tokens</div>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50">
          <span className="text-sm text-gray-300">{currentTier.name} Tier</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-white mb-4">Buy Additional Tokens</h3>
        <p className="text-gray-400 mb-4 text-sm">
          Purchase token packs that expire in 90 days. Use them whenever you need extra capacity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {TOKEN_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-4 rounded-xl border transition-all ${
                selectedPackage === pkg.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {pkg.tokens}
                </div>
                <div className="text-sm text-gray-300 mb-2">tokens</div>
                <div className="text-lg font-bold text-green-400 mb-1">
                  ${pkg.price}
                </div>
                <div className="text-xs text-gray-400">
                  ${pkg.pricePerToken.toFixed(3)}/token
                </div>
                {pkg.popular && (
                  <div className="mt-2 text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                    POPULAR
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-4 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handlePurchase}
          disabled={!selectedPackage || isLoading}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Purchase Selected Package'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Tokens expire 90 days after purchase. Monthly allocation resets on your billing date.
        </p>
      </div>

      <div className="pt-6 border-t border-gray-800/50">
        <h4 className="font-bold text-white mb-3">Your Purchased Packages</h4>
        {user.token_packages && user.token_packages.length > 0 ? (
          <div className="space-y-2">
            {user.token_packages.map((pkg, index) => {
              const packageInfo = TOKEN_PACKAGES.find(p => p.id === pkg.packageId);
              const usedPercentage = (pkg.used / pkg.tokens) * 100;
              const expiresInDays = Math.ceil(
                (new Date(pkg.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={index} className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-white">
                      {packageInfo?.name || 'Token Package'}
                    </div>
                    <div className="text-sm text-gray-400">
                      Expires in {expiresInDays} days
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${usedPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-300">
                      {pkg.used} / {pkg.tokens} used
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No purchased token packages yet.</p>
        )}
      </div>
    </div>
  );
}
