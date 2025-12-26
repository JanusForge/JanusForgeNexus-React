"use client";

import { TIER_CONFIGS } from '@/config/tiers';
import Link from 'next/link';

export default function PricingPage() {
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
          {Object.entries(TIER_CONFIGS).map(([tierKey, tier]) => (
            <div
              key={tierKey}
              className={`rounded-2xl border ${tier.popular ? 'border-blue-500' : 'border-gray-800'} p-8 ${tier.popular ? 'bg-gray-900/50' : 'bg-gray-900/30'} backdrop-blur-sm`}
            >
              {tier.popular && (
                <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full mb-6">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-300">{tier.description}</p>
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{tier.monthlyTokens.toLocaleString()} monthly tokens</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Access to {tier.aiModels.join(', ')}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{tier.features[0]}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{tier.features[1]}</span>
                </div>
              </div>

              <Link
                href={tierKey === 'free' ? '/register' : `/register?tier=${tierKey}`}
                className={`block w-full py-3 px-4 text-center font-semibold rounded-lg transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {tierKey === 'free' ? 'Get Started Free' : 'Choose Plan'}
              </Link>
            </div>
          ))}
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
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Sales</h3>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
                >
                  Schedule a Demo
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
