"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TokenPurchase from '@/components/Billing/TokenPurchase';
import TierUpgrade from '@/components/Billing/TierUpgrade';
import { TIER_CONFIGS } from '@/config/tiers';
import Link from 'next/link';

export default function BillingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentTier = user ? TIER_CONFIGS[user.tier] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Billing & Tokens</h1>
          <p className="text-gray-400">
            Manage your subscription and purchase additional tokens
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">Current Plan</div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentTier?.name || 'Free'}
            </div>
            <div className="text-gray-300">
              {user?.tier === 'free' ? 'Free forever' : `$${currentTier?.price}/month`}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">Tokens Available</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
              {user ? user.tokens_remaining + user.purchased_tokens : 0}
            </div>
            <div className="text-gray-300">
              {user?.tokens_remaining} monthly + {user?.purchased_tokens} purchased
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">AI Models Allowed</div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentTier?.max_ai_models || 2}
            </div>
            <div className="text-gray-300">
              per debate
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Purchase Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Purchase Tokens</h2>
              <Link 
                href="/pricing" 
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View all plans →
              </Link>
            </div>
            <TokenPurchase />
          </div>

          {/* Tier Upgrade Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Subscription Plans</h2>
              <div className="text-sm text-gray-400">
                {user?.tier === 'free' ? 'Start your trial' : 'Change plan'}
              </div>
            </div>
            <TierUpgrade />
          </div>
        </div>

        {/* Usage Information */}
        <div className="mt-8 bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
          <h3 className="text-xl font-bold mb-4">How Tokens Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-white mb-2">Token Usage</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  AI response generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  Debate analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  Summary creation
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Monthly Allocation</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Resets on billing date
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Use-it-or-lose-it
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Auto-renews monthly
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Purchased Tokens</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Expire in 90 days
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Used after monthly tokens
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Stackable packages
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          Need help with billing? <a href="mailto:support@janusforge.ai" className="text-blue-400 hover:text-blue-300">Contact support</a>
        </div>
      </div>
    </div>
  );
}
