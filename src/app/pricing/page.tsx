"use client";

import { TIER_CONFIGS } from '@/config/tiers';
import Link from 'next/link';

export default function PricingPage() {
  // Mark 'pro' tier as popular for display purposes
  const isPopularTier = (tierKey: string) => tierKey === 'pro';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Tier
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Select the plan that matches your AI conversation needs. All tiers include access to our growing AI council.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {Object.entries(TIER_CONFIGS).filter(([tierKey]) => tierKey !== 'admin').map(([tierKey, tier]) => {
            const isPopular = isPopularTier(tierKey);
            
            return (
              <div
                key={tierKey}
                className={`rounded-2xl border ${isPopular ? 'border-blue-500' : 'border-gray-800'} p-8 ${isPopular ? 'bg-gray-900/50' : 'bg-gray-900/30'} backdrop-blur-sm relative`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    {tier.price > 0 && (
                      <span className="text-gray-400 ml-2">/month</span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {tier.monthly_tokens.toLocaleString()} tokens per month
                  </p>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Access to {tier.max_ai_models} AI models</span>
                  </div>
                  {tier.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={tierKey === 'free' ? '/register' : `/register?tier=${tierKey}`}
                  className={`block w-full py-3 px-4 text-center font-semibold rounded-lg transition-all ${
                    isPopular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  {tierKey === 'free' ? 'Get Started Free' : 'Choose Plan'}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gray-900/30 rounded-2xl border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Enterprise Solutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Custom Integration</h3>
                <p className="text-gray-300">
                  Need custom AI models, dedicated infrastructure, or enterprise-grade security? 
                  Our team can build a tailored solution for your organization.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Custom AI model training
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Dedicated infrastructure
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    SOC 2 compliance
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Sales</h3>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all mb-4"
                >
                  Schedule a Demo
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <p className="text-gray-400 text-sm">
                  Get in touch for custom pricing, dedicated support, and enterprise features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Token System Explanation */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-900/30 rounded-2xl border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How Our Token System Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-blue-400 text-lg font-semibold mb-2">1. Monthly Tokens</div>
                <p className="text-gray-300">
                  Each tier includes monthly tokens that refresh every 30 days. Use them for AI conversations, debates, and analysis.
                </p>
              </div>
              <div>
                <div className="text-purple-400 text-lg font-semibold mb-2">2. Purchased Tokens</div>
                <p className="text-gray-300">
                  Need more? Buy additional token packs that never expire. Perfect for high-usage months or special projects.
                </p>
              </div>
              <div>
                <div className="text-green-400 text-lg font-semibold mb-2">3. Efficient Usage</div>
                <p className="text-gray-300">
                  Different AI models consume tokens at different rates. Advanced models cost more but provide deeper insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
