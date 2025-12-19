"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS, TOKEN_PACKAGES, type UserTier } from '@/config/tiers';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const { user, upgradeTier } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpgrade = async (tier: UserTier) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to upgrade' });
      return;
    }

    setMessage(null);
    const result = await upgradeTier(tier);
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: `Successfully upgraded to ${TIER_CONFIGS[tier].name}!` 
      });
      setSelectedTier(null);
    } else {
      setMessage({ 
        type: 'error', 
        text: result.error || 'Upgrade failed' 
      });
    }
  };

  const tiers = Object.entries(TIER_CONFIGS).filter(([key]) => key !== 'admin');

  const yearlyDiscount = 0.2; // 20% discount for yearly billing

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your debating needs. All plans include access to all AI models.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-800/50 rounded-full p-1 mt-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly <span className="text-green-400 ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {message && (
          <div className={`max-w-2xl mx-auto p-4 rounded-lg mb-8 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map(([tierKey, tier]) => {
            const tierId = tierKey as UserTier;
            const price = billingPeriod === 'yearly' 
              ? Math.round(tier.price * (1 - yearlyDiscount) * 12)
              : tier.price;
            
            return (
              <div
                key={tierId}
                className={`rounded-2xl p-6 border transition-all ${
                  tierId === 'pro'
                    ? 'border-purple-500 bg-gray-900/80 scale-105'
                    : 'border-gray-800/50 bg-gray-900/50'
                }`}
              >
                {tierId === 'pro' && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-4 text-sm min-h-[40px]">
                  {tierId === 'free' ? 'Perfect for trying out JanusForge' :
                   tierId === 'basic' ? 'For casual debaters' :
                   tierId === 'pro' ? 'For serious debaters and teams' :
                   'For enterprises and power users'}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    {tierId !== 'free' && (
                      <span className="text-gray-400">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {tierId !== 'free' && billingPeriod === 'yearly' && (
                    <div className="text-sm text-gray-400 mt-1">
                      <s>${tier.price * 12}/year</s> • Save ${Math.round(tier.price * 12 * yearlyDiscount)}/year
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (user) {
                      if (user.tier === tierId) {
                        setMessage({ type: 'error', text: `You're already on the ${tier.name} plan` });
                      } else {
                        handleUpgrade(tierId);
                      }
                    } else {
                      router.push('/register');
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    tierId === 'pro'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : tierId === 'free'
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {user?.tier === tierId ? 'Current Plan' : tierId === 'free' ? 'Get Started' : 'Upgrade Now'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Token Packages Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Need More Tokens?</h2>
            <p className="text-gray-400">
              Purchase additional tokens for when you need extra capacity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {TOKEN_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 hover:border-gray-700 transition-all"
              >
                <div className="text-center">
                  {pkg.popular && (
                    <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs mb-3">
                      POPULAR
                    </div>
                  )}
                  <div className="text-3xl font-bold text-white mb-1">
                    {pkg.tokens}
                  </div>
                  <div className="text-gray-300 mb-4">tokens</div>
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    ${pkg.pricePerToken.toFixed(3)} per token
                  </div>
                  <button
                    onClick={() => {
                      if (user) {
                        // In reality, this would open purchase modal
                        setMessage({ 
                          type: 'success', 
                          text: `Redirecting to purchase ${pkg.tokens} tokens...` 
                        });
                      } else {
                        router.push('/login');
                      }
                    }}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-2">How do tokens work?</h3>
              <p className="text-gray-400">
                Each AI response uses tokens based on the length of the conversation. 
                Your monthly plan includes a set number of tokens that reset each billing cycle. 
                You can purchase additional tokens that expire in 90 days.
              </p>
            </div>
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-2">Can I change my plan?</h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade at any time. When upgrading, 
                you'll get access to the new features immediately. When downgrading, 
                changes take effect at the end of your billing cycle.
              </p>
            </div>
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-2">What's your refund policy?</h3>
              <p className="text-gray-400">
                We offer a 14-day money-back guarantee for all paid plans. 
                Token purchases are non-refundable as they are consumed immediately.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Debates?</h2>
            <p className="text-gray-300 mb-6">
              Join thousands of users who are already experiencing better debates with AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
