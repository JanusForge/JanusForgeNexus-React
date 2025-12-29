"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS, TOKEN_PACKAGES, getTierColor } from '@/config/tiers';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

// Force the tier to match the keys of TIER_CONFIGS to satisfy TypeScript
const currentTier = (user?.tier?.toLowerCase() || 'free') as keyof typeof TIER_CONFIGS;
const tierConfig = TIER_CONFIGS[currentTier];


  const handlePurchase = (pkgId: string) => {
    // In production, this would redirect to Stripe checkout
    // For now, show a message about what would happen
    alert('In production: Redirect to Stripe checkout for payment processing.\n\nAfter payment, tokens would be added to your account via webhook.');
    setSelectedPackage(pkgId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Token Management</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Purchase tokens to participate in AI conversations. Each AI response consumes tokens based on model complexity.
          </p>
        </header>

        {/* Current Status */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Current Tier</div>
                <div className={`inline-block px-4 py-2 rounded-full ${getTierColor(currentTier)} text-white font-semibold`}>
                  {tierConfig.name}
                </div>
                <div className="mt-3 text-gray-300 text-sm">
                  {tierConfig.features[0]}
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Tokens Available</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {user ? ((user.tokens_remaining || 0) + (user.purchased_tokens || 0)) : 0}
                </div>
                <div className="text-gray-300">
                  {user?.tokens_remaining || 0} monthly + {user?.purchased_tokens || 0} purchased
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Token Usage</div>
                <div className="text-2xl font-bold text-white mb-1">
                  {user ? (tierConfig.monthly_tokens - (user.tokens_remaining || 0)) : 0}
                </div>
                <div className="text-gray-300">
                  used this month
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Packages */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Purchase Additional Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOKEN_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-gray-800/30 rounded-xl border ${selectedPackage === pkg.id ? 'border-blue-500' : 'border-gray-700'} p-6 hover:bg-gray-800/50 transition-all ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                    POPULAR
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ${pkg.price}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{pkg.tokens.toLocaleString()} tokens</div>
                  <div className="text-green-400 text-xs mt-1">
                    ${((pkg.price / pkg.tokens) * 1000).toFixed(3)} per 1K tokens
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-300 text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No expiration
                  </li>
                  <li className="flex items-center text-gray-300 text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Works with all AI models
                  </li>
                  <li className="flex items-center text-gray-300 text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {pkg.description}
                  </li>
                </ul>

                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={selectedPackage === pkg.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {selectedPackage === pkg.id ? 'Processing...' : 'Purchase'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Token Usage Guide */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">How Tokens Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">AI Conversations</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• ~100-500 tokens per AI response</li>
                  <li>• Depends on model complexity</li>
                  <li>• Longer debates cost more</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Monthly Reset</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Tier tokens reset monthly</li>
                  <li>• Purchased tokens never expire</li>
                  <li>• Unused tokens roll over (tier limit)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-2">Cost Efficiency</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Larger packs = better value</li>
                  <li>• Buy when you need</li>
                  <li>• Cancel anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Production Note */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Production Payment Processing</h3>
            <p className="text-gray-300">
              In production, this page would integrate with Stripe for secure payment processing. 
              After successful payment, tokens would be automatically added to your account via webhook.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Payment processing would be PCI-compliant and secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
