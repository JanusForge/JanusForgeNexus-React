"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS } from '@/config/tiers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/debates');
    } else {
      router.push('/register');
    }
  };

  const popularTiers = Object.entries(TIER_CONFIGS)
    .filter(([key]) => ['basic', 'pro', 'enterprise'].includes(key));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-gradient-x"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Debate with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Create, participate, and analyze debates with multiple AI models. 
            Perfect for critical thinking, education, and entertainment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg font-medium transition-all transform hover:scale-105"
            >
              {isAuthenticated ? 'Start New Debate' : 'Get Started Free'}
            </button>
            <Link
              href="/demo"
              className="px-8 py-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-lg font-medium border border-gray-700/50"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose JanusForge?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience debates like never before with our powerful AI platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Multiple AI Models</h3>
            <p className="text-gray-400">
              Debate with GPT-4, Claude, Gemini, Grok, and more. Each with unique perspectives and reasoning styles.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold">⚖️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Fair Token System</h3>
            <p className="text-gray-400">
              Pay-as-you-go with our transparent token system. Monthly subscriptions + additional token packages available.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Deep Analytics</h3>
            <p className="text-gray-400">
              Get insights into debate dynamics, AI biases, argument quality, and more with our analytics dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your debating needs. All plans include access to all AI models.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {popularTiers.map(([tierKey, tier]) => (
            <div
              key={tierKey}
              className={\`rounded-2xl p-6 border transition-all hover:scale-105 \${tierKey === 'pro' ? 'border-purple-500 bg-gray-900/80' : 'border-gray-800/50 bg-gray-900/50'}\`}
            >
              {tierKey === 'pro' && (
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">\${tier.price}</div>
                <div className="text-gray-400">per month</div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/pricing')}
                className={\`w-full py-3 rounded-lg font-medium \${tierKey === 'pro' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gray-800 hover:bg-gray-700'}\`}
              >
                {user?.tier === tierKey ? 'Current Plan' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
          >
            View detailed pricing and token packages
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Debating?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of users who are already experiencing better debates with AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg font-medium"
            >
              Start Free Trial
            </button>
            <Link
              href="/demo"
              className="px-8 py-4 bg-transparent hover:bg-gray-800/50 rounded-xl text-lg font-medium border border-gray-700/50"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            No credit card required for free tier • 50 tokens included
          </p>
        </div>
      </div>
    </div>
  );
}
