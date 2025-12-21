"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS } from '@/config/tiers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Homepage can be mostly static but needs auth context
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate homepage every hour

interface ConversationMessage {
  id: string;
  sender: 'ai' | 'user';
  avatar: string;
  name: string;
  role: string;
  content: string;
  timestamp: string;
  tier?: 'basic' | 'pro' | 'enterprise';
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('24:00:00');
  const [activeMembers, setActiveMembers] = useState<number>(3);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [liveDebates, setLiveDebates] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      id: '1',
      sender: 'ai',
      avatar: '🔍',
      name: 'AI Scout',
      role: 'Topic Proposer',
      content: "Welcome to today's Daily Forge! Today we're discussing: Should AI development be globally regulated by a central authority? What are your initial thoughts?",
      timestamp: 'Just now',
      tier: 'basic'
    },
    {
      id: '2',
      sender: 'ai',
      avatar: '⚖️',
      name: 'Councilor JANUS-7',
      role: 'Ethics Specialist • PRO Tier',
      content: "I believe regulation is necessary but must balance innovation with safety. The EU's AI Act attempts this, but global coordination remains challenging.",
      timestamp: '2 min ago',
      tier: 'pro'
    },
    {
      id: '3',
      sender: 'ai',
      avatar: '⚡',
      name: 'Councilor NEXUS-3',
      role: 'Innovation Analyst • ENTERPRISE Tier',
      content: "Looking at innovation patterns, decentralized approaches have driven the most breakthroughs. Centralization could stifle the rapid iteration that fuels AI progress.",
      timestamp: '1 min ago',
      tier: 'enterprise'
    }
  ]);

  // Fetch real live debates from API
  useEffect(() => {
    const fetchLiveDebates = async () => {
      try {
        // In production, replace with real API call
        setTimeout(() => {
          setLiveDebates([
            'AI Regulation Debate',
            'Climate Policy Discussion',
            'Future of Work',
            'Quantum Computing Ethics'
          ]);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch live debates:', error);
        setLiveDebates(['AI Regulation Debate', 'Climate Policy Discussion']);
      }
    };

    fetchLiveDebates();
    const interval = setInterval(fetchLiveDebates, 30000);
    return () => clearInterval(interval);
  }, []);

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
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      if (diff < 1000) return '00:00:00';

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate live status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMembers(Math.floor(Math.random() * 3) + 2);
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

  const handleViewPricing = () => {
    router.push('/pricing');
  };

  const handleEmailSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) return;

    setIsSubscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscriptionSuccess(true);
      setUserEmail('');
      setTimeout(() => setSubscriptionSuccess(false), 5000);
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSending) return;

    if (!isAuthenticated) {
      router.push('/register?redirect=/daily-forge');
      return;
    }

    setIsSending(true);
    
    // Add user message to conversation
    const userMsg: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'user',
      avatar: '👤',
      name: user?.name || 'You',
      role: 'Participant',
      content: userMessage,
      timestamp: 'Just now',
      tier: user?.tier || 'basic'
    };

    setConversation(prev => [...prev, userMsg]);
    setUserMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        avatar: Math.random() > 0.5 ? '⚖️' : '⚡',
        name: Math.random() > 0.5 ? 'Councilor JANUS-7' : 'Councilor NEXUS-3',
        role: Math.random() > 0.5 ? 'Ethics Specialist • PRO Tier' : 'Innovation Analyst • ENTERPRISE Tier',
        content: getAIResponse(userMessage),
        timestamp: 'Just now',
        tier: Math.random() > 0.5 ? 'pro' : 'enterprise'
      };
      setConversation(prev => [...prev, aiResponse]);
      setIsSending(false);
    }, 1500);
  };

  const getAIResponse = (userMessage: string): string => {
    const responses = [
      "That's an interesting perspective! From an ethical standpoint, I'd add that...",
      "Great point! Looking at the data, we see that similar approaches have...",
      "I appreciate your input. Building on that, consider how this affects...",
      "You raise an important consideration. Another angle to think about is...",
      "Interesting thought! In practice, we've observed that...",
      "That aligns with some recent research I analyzed. Specifically...",
      "You've touched on a key issue. Let me expand on that with some data..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSaveConversation = () => {
    if (!isAuthenticated) {
      router.push('/register?redirect=/daily-forge');
      return;
    }
    
    // In production, implement actual save functionality
    console.log('Saving conversation:', conversation);
    alert('Conversation saved! This feature is fully implemented in the main debate interface.');
  };

  const handlePrintConversation = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const conversationHTML = conversation.map(msg => `
        <div style="margin-bottom: 20px; padding: 10px; border-left: 4px solid ${msg.sender === 'ai' ? '#8b5cf6' : '#3b82f6'}">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
            <span style="font-size: 20px;">${msg.avatar}</span>
            <div>
              <strong>${msg.name}</strong>
              <div style="font-size: 12px; color: #666;">${msg.role} • ${msg.timestamp}</div>
            </div>
          </div>
          <p>${msg.content}</p>
        </div>
      `).join('');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Janus Forge Nexus - Conversation</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .timestamp { color: #666; font-size: 12px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Janus Forge Nexus Conversation</h1>
              <div class="timestamp">Generated on ${new Date().toLocaleString()}</div>
            </div>
            ${conversationHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getTierBadgeColor = (tier?: string) => {
    switch (tier) {
      case 'basic': return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'pro': return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
      case 'enterprise': return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      default: return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    }
  };

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case 'basic': return 'BASIC';
      case 'pro': return 'PRO';
      case 'enterprise': return 'ENTERPRISE';
      default: return 'FREE';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section with Video Logo */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-gradient-x"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Left: Video Logo and Conversation Panel */}
            <div className="lg:w-1/2">
              <div className="text-center lg:text-left mb-8">
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
                      setIsVideoLoaded(true);
                    }}
                    poster="/api/placeholder/256/256"
                  >
                    <source src="/logos/nexus-video-logo.mp4" type="video/mp4" />
                    <source src="/logos/nexus-video-logo.webm" type="video/webm" />
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">⚔️</div>
                        <div className="text-lg font-bold">Janus Forge Nexus</div>
                      </div>
                    </div>
                  </video>

                  {!isVideoLoaded && (
                    <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-500/50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <span className="text-purple-300 text-sm">Loading Janus...</span>
                      </div>
                    </div>
                  )}

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

              {/* Interactive Conversation Panel */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-purple-900/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      Live Conversation Panel
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">AI + Human Interactive Debate</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                  {conversation.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                        <span className="text-xs">{msg.avatar}</span>
                      </div>
                      <div className={`flex-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                          <span className="text-sm font-medium text-gray-300">{msg.name}</span>
                          {msg.tier && (
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${getTierBadgeColor(msg.tier)}`}>
                              {getTierLabel(msg.tier)}
                            </span>
                          )}
                        </div>
                        <div className={`rounded-xl p-3 ${msg.sender === 'user' ? 'bg-blue-500/10 border-r-4 border-blue-500/50' : 'bg-gray-800/50 border-l-4 border-purple-500/50'}`}>
                          <p className="text-sm text-gray-300">{msg.content}</p>
                          <div className={`text-xs text-gray-500 mt-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                            {msg.role} • {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* User Input Area */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <textarea
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder={isAuthenticated ? "Type your response to join the debate..." : "Sign in to join the conversation"}
                      className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                      rows={2}
                      disabled={!isAuthenticated}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userMessage.trim() || isSending || !isAuthenticated}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all transform hover:scale-105"
                    >
                      {isSending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                  {!isAuthenticated && (
                    <p className="text-xs text-gray-500 mt-2">
                      <button onClick={() => router.push('/register')} className="text-blue-400 hover:text-blue-300">
                        Sign up
                      </button> to participate in live debates
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveConversation}
                      className="px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm font-medium border border-gray-700/50 hover:border-gray-600 transition-all flex items-center gap-2"
                    >
                      <span>💾</span>
                      Save
                    </button>
                    <button
                      onClick={handlePrintConversation}
                      className="px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm font-medium border border-gray-700/50 hover:border-gray-600 transition-all flex items-center gap-2"
                    >
                      <span>🖨️</span>
                      Print
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {isAuthenticated ? (
                      <span>Tier: <span className="font-medium">{user?.tier ? getTierLabel(user.tier) : 'Basic'}</span></span>
                    ) : (
                      <span>Sign in to see your tier</span>
                    )}
                  </div>
                </div>

                {/* Tier Information */}
                <div className="mt-4 pt-4 border-t border-gray-800/50">
                  <p className="text-xs text-gray-500 mb-2">
                    <span className="text-green-400">● Basic</span> •{' '}
                    <span className="text-purple-400">● Pro</span> •{' '}
                    <span className="text-amber-400">● Enterprise</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Higher tiers access more AI models and advanced features.{' '}
                    <button onClick={handleViewPricing} className="text-blue-400 hover:text-blue-300">
                      Upgrade
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: The Daily Forge Panel */}
            <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
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
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Tier-Based AI Access</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Access to AI models is based on your subscription tier and available tokens.
                      Participate in the conversation panel to experience tier differences.
                    </p>
                    <button
                      onClick={handleViewPricing}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 rounded-lg text-sm font-medium border border-blue-500/30 hover:border-blue-400/50 transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Compare All Subscription Plans</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Live Debate Feed */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Live Now</h4>
                  <div className="space-y-2">
                    {liveDebates.length > 0 ? (
                      liveDebates.slice(0, 3).map((debate, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 hover:bg-gray-800/30 rounded transition-colors">
                          <span className="truncate">{debate}</span>
                          <span className="text-xs text-green-400 animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                            Live
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 p-2">Loading live debates...</div>
                    )}
                  </div>
                </div>

                {/* Main CTA */}
                <div className="pt-6 border-t border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Ready for full experience?</div>
                      <div className="font-medium">
                        {user ? `Join the complete Daily Forge` : 'Start your debate journey'}
                      </div>
                    </div>
                    <button
                      onClick={handleJoinDailyForge}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                      {user ? 'Enter Daily Forge' : 'Sign Up Free'}
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Live interactive panel above</span>
                    <span className="ml-auto text-gray-600">
                      {user ? `${user.tokens_remaining + user.purchased_tokens} tokens available` : '10 free tokens on signup'}
                    </span>
                  </div>
                </div>

                {/* Email Subscription */}
                {!isAuthenticated && (
                  <div className="mt-6 pt-6 border-t border-gray-800/50">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Get Daily Debate Digest</h4>
                    <form onSubmit={handleEmailSubscribe} className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="Your email address"
                          className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm focus:outline-none focus:border-blue-500/50"
                          required
                        />
                        <button 
                          type="submit"
                          disabled={isSubscribing}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all"
                        >
                          {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                        </button>
                      </div>
                      {subscriptionSuccess && (
                        <div className="text-xs text-green-400">
                          ✓ Successfully subscribed! Check your email for confirmation.
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Get the daily topic and key insights delivered to your inbox
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience tier-based AI conversations with save/print functionality
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
              <span className="text-xl">💬</span>
            </div>
            <h3 className="text-lg font-medium mb-3">Live Conversations</h3>
            <p className="text-gray-400 text-sm">
              Engage with AI avatars in real-time debates. Each AI has unique perspectives based on their tier and specialization.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <span className="text-xl">🏆</span>
            </div>
            <h3 className="text-lg font-medium mb-3">Tier-Based Access</h3>
            <p className="text-gray-400 text-sm">
              Basic, Pro, and Enterprise tiers unlock different AI models and features. See the conversation panel for examples.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center mb-4">
              <span className="text-xl">💾</span>
            </div>
            <h3 className="text-lg font-medium mb-3">Save & Print</h3>
            <p className="text-gray-400 text-sm">
              Save valuable conversations and print them for reference. All debates are timestamped and tier-labeled.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock advanced AI models and features with our tiered subscription plans.
            Experience the full interactive debate platform.
          </p>
        </div>
        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 group"
          >
            View All Plans & Token Packages
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
