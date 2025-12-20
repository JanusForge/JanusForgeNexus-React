"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS } from '@/config/tiers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Homepage can be mostly static but needs auth context
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate homepage every hour

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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
      {/* Hero Section with Video Logo */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-gradient-x"></div>
        
        {/* Video Logo Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left: Video Logo and Main Heading */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="mb-8">
                {/* Video Logo */}
                <div className="relative w-64 h-64 mx-auto lg:mx-0 mb-8 rounded-2xl overflow-hidden border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20 bg-black">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedData={() => setIsVideoLoaded(true)}
                    poster="/api/placeholder/256/256"
                  >
                    <source src="/logos/nexus-video-logo.mp4" type="video/mp4" />
                    <source src="/logos/nexus-video-logo.mp4" type="video/webm" />
                    {/* Fallback image */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">⚔️</div>
                        <div className="text-lg font-bold">Janus Forge Nexus</div>
                      </div>
                    </div>
                  </video>
  
                  {/* Loading spinner - shown only while video loads */}
                  {!isVideoLoaded && (
                    <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-500/50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <span className="text-purple-300 text-sm">Loading Janus...</span>
                      </div>
                    </div>
                  )}

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
                  </div>
                

                <h1 className="text-3xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Janus Forge Nexus
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-6">
                  A Multi-AI with Human Realtime Conversation Platform
                  <span className="block text-lg text-purple-400 mt-2">
                    Where perspectives collide and wisdom emerges
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  {isAuthenticated ? 'Start New Debate' : 'Get Started Free'}
                </button>
                <Link
                  href="/pricing"
                  className="px-8 py-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-lg font-medium border border-gray-700/50 hover:border-gray-600 transition-all"
                >
                  View Pricing
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span>Live AI Debates</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Token System</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span>Multi-Model</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="lg:w-1/2">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
                <h2 className="text-2xl font-bold mb-6 text-center">Platform Stats</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-3xl font-bold text-green-400">5+</div>
                    <div className="text-gray-400">AI Models</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-3xl font-bold text-blue-400">4</div>
                    <div className="text-gray-400">Pricing Tiers</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-3xl font-bold text-purple-400">50</div>
                    <div className="text-gray-400">Free Tokens</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-3xl font-bold text-amber-400">24/7</div>
                    <div className="text-gray-400">Availability</div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Current User</div>
                      <div className="font-medium">
                        {user ? user.name || user.email?.split('@')[0] : 'Guest'}
                      </div>
                    </div>
                    {user && (
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Tokens</div>
                        <div className="text-xl font-bold text-green-400">
                          {user.tokens_remaining + user.purchased_tokens}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">⚔️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Dual Perspective AI</h3>
            <p className="text-gray-400">
              Named after Janus, the two-faced Roman god, our AI presents both sides of every argument with balanced intelligence.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 hover:border-green-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">⚖️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Fair Token System</h3>
            <p className="text-gray-400">
              Transparent pay-as-you-go token system. Monthly plans + flexible token packages for when you need extra capacity.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 hover:border-amber-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Deep Debate Analytics</h3>
            <p className="text-gray-400">
              Get insights into argument quality, bias detection, and debate dynamics with our comprehensive analytics dashboard.
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
              className={`rounded-2xl p-6 border transition-all hover:scale-105 ${
                tierKey === 'pro'
                  ? 'border-purple-500 bg-gray-900/80 shadow-2xl shadow-purple-500/20'
                  : 'border-gray-800/50 bg-gray-900/50 hover:border-gray-700'
              }`}
            >
              {tierKey === 'pro' && (
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium">
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}

              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                  tierKey === 'pro' ? 'bg-purple-500/20' :
                  tierKey === 'enterprise' ? 'bg-amber-500/20' :
                  'bg-blue-500/20'
                }`}>
                  <span className={`text-lg ${
                    tierKey === 'pro' ? 'text-purple-400' :
                    tierKey === 'enterprise' ? 'text-amber-400' :
                    'text-blue-400'
                  }`}>
                    {tierKey === 'pro' ? '⚡' :
                     tierKey === 'enterprise' ? '🏢' : '👤'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">${tier.price}
                  <span className="text-sm text-gray-400 font-normal">/month</span>
                </div>
                <div className="text-gray-400 text-sm">
                  {tierKey === 'free' ? 'Free forever' : 'Billed monthly'}
                </div>
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
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  tierKey === 'pro'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {user?.tier === tierKey ? 'Current Plan' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-lg font-medium border border-gray-700/50 hover:border-gray-600 transition-all group"
          >
            View detailed pricing and token packages
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* CTA Section with Video Logo */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="relative bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-3xl p-8 md:p-12 overflow-hidden">
          {/* Video Logo in background */}
          <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-xl flex items-center justify-center">
              <span className="text-3xl">⚔️</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to Experience Dual-Perspective AI?</h2>
          <p className="text-gray-300 mb-8 text-lg relative z-10">
            Join the future of intelligent debate with JanusForge&apos;s unique two-faced AI approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Start Free Trial
            </button>
            <Link
              href="/demo"
              className="px-8 py-4 bg-transparent hover:bg-gray-800/50 rounded-xl text-lg font-medium border border-gray-700/50 hover:border-gray-600 transition-all"
            >
              Watch Demo Video
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6 relative z-10">
            No credit card required • 50 free tokens included • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
