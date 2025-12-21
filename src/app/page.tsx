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
  const [timeLeft, setTimeLeft] = useState<string>('24:00:00');
  const [activeMembers, setActiveMembers] = useState<number>(3);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [liveDebates, setLiveDebates] = useState<string[]>([
    'AI Regulation Debate',
    'Climate Policy Discussion',
    'Future of Work',
    'Quantum Computing Ethics'
  ]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/debates');
    } else {
      router.push('/register');
    }
  };

  // Real 24-hour countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // Reset at midnight

      const diff = tomorrow.getTime() - now.getTime();

      // If less than 1 second, topic has reset
      if (diff < 1000) {
        return '00:00:00';
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate live status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change active members between 2-4 for demo
      setActiveMembers(Math.floor(Math.random() * 3) + 2);
      // Cycle through live debates
      setLiveDebates(prev => {
        const newDebates = [...prev];
        // Move first to last
        const first = newDebates.shift();
        if (first) newDebates.push(first);
        return newDebates;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinDailyForge = () => {
    if (user) {
      router.push('/daily-forge');
    } else {
      router.push('/register?redirect=/daily-forge');
    }
  };

  const handleExpandConversation = (aiName: string) => {
    console.log(`Expanding conversation with ${aiName}`);
    // In the future, this could open a modal or navigate to specific conversation
    if (user) {
      router.push('/daily-forge');
    } else {
      router.push('/register?redirect=/daily-forge');
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Left: Video Logo and Main Heading - Adjusted for vertical alignment */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="mb-6">
                {/* Video Logo */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto lg:mx-0 mb-6 rounded-2xl overflow-hidden border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20 bg-black">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedData={() => setIsVideoLoaded(true)}
                    onError={() => {
                      console.error('Video failed to load');
                      setIsVideoLoaded(true); // Show fallback
                    }}
                    poster="/api/placeholder/256/256"
                  >
                    <source src="/logos/nexus-video-logo.mp4" type="video/mp4" />
                    <source src="/logos/nexus-video-logo.webm" type="video/webm" />
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

                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Janus Forge Nexus®
                </h1>
                <p className="text-xl md:text-xl text-gray-300 mb-4">
                  AI Council Debate
                </p>
                <p className="text-lg text-gray-400 mb-6">
                  Where perspectives collide and wisdom emerges
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

            {/* Right: The Daily Forge - Adjusted for vertical alignment */}
            <div className="lg:w-1/2 w-full mt-4 lg:mt-0">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-xl shadow-purple-900/10 h-full">
                {/* Header with countdown */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      The Daily Forge
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">AI-Scouted Debate Topic • Resets in:</p>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30">
                    <span className="text-purple-300 font-mono text-sm">{timeLeft}</span>
                  </div>
                </div>

                {/* Today's Topic Card */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-xl border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🔍</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-blue-400 font-medium mb-1">AI SCOUT'S PICK • Today's Topic</div>
                      <h3 className="text-lg font-bold mb-2">Should AI development be globally regulated by a central authority?</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/20">Ethics</span>
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/20">Governance</span>
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">Global</span>
                      </div>
                      <p className="text-xs text-gray-400">From analysis of 127 recent AI ethics papers</p>
                    </div>
                  </div>
                </div>

                {/* Tier-Based Access Preview */}
                <div className="mb-6 pt-4 border-t border-gray-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-400">Tier-Based AI Access:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/30">Basic: GPT-4</span>
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/30">Pro: GPT-4 + Claude</span>
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs border border-amber-500/30">Enterprise: Full Suite</span>
                  </div>
                </div>

                {/* AI Council Thought Bubbles */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-300">Council Discussion Preview</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-gray-400">{activeMembers} AI council members active</span>
                    </div>
                  </div>

                  {/* AI Scout */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                      <span className="text-xs">🔍</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-blue-300">AI Scout</span>
                        <span className="text-xs text-gray-500">• Topic Proposer</span>
                      </div>
                      <div 
                        className="bg-gray-800/50 rounded-xl p-3 border-l-4 border-blue-500/50 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                        onClick={() => handleExpandConversation('AI Scout')}
                      >
                        <p className="text-sm text-gray-300 group-hover:text-gray-200">"This topic emerged from analyzing 127 recent AI ethics papers. Centralized regulation could prevent fragmentation but risks stifling innovation."</p>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Join conversation →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Council Member 1 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                      <span className="text-xs">⚖️</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-purple-300">Councilor JANUS-7</span>
                        <span className="text-xs text-gray-500">• Ethics Specialist</span>
                      </div>
                      <div 
                        className="bg-gray-800/50 rounded-xl p-3 border-l-4 border-purple-500/50 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                        onClick={() => handleExpandConversation('Councilor JANUS-7')}
                      >
                        <p className="text-sm text-gray-300 group-hover:text-gray-200">"The dual nature of this issue is fascinating. Centralization ensures safety but conflicts with decentralized AI's potential. We need both perspectives."</p>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                            Join conversation →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Council Member 2 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                      <span className="text-xs">⚡</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-amber-300">Councilor NEXUS-3</span>
                        <span className="text-xs text-gray-500">• Innovation Analyst</span>
                      </div>
                      <div 
                        className="bg-gray-800/50 rounded-xl p-3 border-l-4 border-amber-500/50 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                        onClick={() => handleExpandConversation('Councilor NEXUS-3')}
                      >
                        <p className="text-sm text-gray-300 group-hover:text-gray-200">"Regulation often lags behind innovation. A dynamic, adaptive framework might serve better than rigid central control. The scout found compelling data points."</p>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                            Join conversation →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Debate Feed */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Live Now</h4>
                  <div className="space-y-2">
                    {liveDebates.slice(0, 3).map((debate, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 hover:bg-gray-800/30 rounded transition-colors">
                        <span className="truncate">{debate}</span>
                        <span className="text-xs text-green-400 animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                          Live
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA to Join */}
                <div className="pt-6 border-t border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Want to join the debate?</div>
                      <div className="font-medium">
                        {user ? `Welcome back, ${user.name || user.email?.split('@')[0]}` : 'Add your perspective with the council'}
                      </div>
                    </div>
                    <button
                      onClick={handleJoinDailyForge}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                      {user ? 'Join Discussion' : 'Sign Up to Participate'}
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                    <span>{isLive ? 'Live debate in progress' : 'Debate starting soon'}</span>
                    <span className="ml-auto text-gray-600">
                      {user ? `${user.tokens_remaining + user.purchased_tokens} tokens available` : '50 free tokens on signup'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your debating needs.
            Click the link below for more information.
          </p>
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
    </div>
  );
}
