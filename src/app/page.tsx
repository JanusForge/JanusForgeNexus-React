"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Calendar, Clock, TrendingUp, Users, Zap, Heart, MessageSquare, Save } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

// Production API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type ConversationTier = 'basic' | 'pro' | 'enterprise' | 'free';

interface ConversationMessage {
  id: string;
  sender: 'ai' | 'user';
  avatar: string;
  name: string;
  role: string;
  content: string;
  timestamp: string;
  tier?: ConversationTier;
  likes?: number;
  replies?: number;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  aiInterest: number;
  humanInterest: number;
  nextUpdate: string;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('24:00:00');
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  
  // Skeleton state to prevent "Initializing" hang
  const [topic, setTopic] = useState<Topic | null>({
    id: 'loading',
    title: 'Synchronizing with Nexus...',
    description: 'Fetching the latest Forge data from the Council...',
    aiInterest: 0,
    humanInterest: 0,
    nextUpdate: new Date(Date.now() + 86400000).toISOString()
  });
  
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  // 1. SOCKET INITIALIZATION
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
    });

    socketRef.current.on('post:incoming', (newMessage: ConversationMessage) => {
      setConversation(prev => [newMessage, ...prev]);
    });

    socketRef.current.on('ai:response', (aiMessage: ConversationMessage) => {
      setConversation(prev => [aiMessage, ...prev]);
      setIsSending(false); // SUCCESS EXIT: Reset button
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  // 2. DATA SYNC
  const fetchBackendData = useCallback(async () => {
    try {
      const [topicRes, convRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/daily-forge/topic`),
        fetch(`${API_BASE_URL}/api/conversations/preview`)
      ]);

      if (topicRes.ok) {
        const data = await topicRes.json();
        setTopic(data.topic || data);
      }
      if (convRes.ok) {
        const data = await convRes.json();
        setConversation(data.conversations || data);
      }
    } catch (error) {
      console.error('Backend sync failed:', error);
    }
  }, []);

  useEffect(() => { fetchBackendData(); }, [fetchBackendData]);

  // 3. MESSAGE HANDLING
  const handleSendMessage = () => {
    if (!userMessage.trim() || isSending || !isAuthenticated) return;

    setIsSending(true);

    // SAFETY EXIT: Reset button if no response after 8 seconds
    const timeout = setTimeout(() => setIsSending(false), 8000);

    const payload = {
      content: userMessage,
      userId: user?.id,
      name: (user as any)?.username || (user as any)?.name || 'Anonymous',
      tier: user?.tier || 'free',
      timestamp: new Date().toISOString(),
      conversationId: 'home-preview'
    };

    socketRef.current?.emit('post:new', payload);
    setUserMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getTierBadgeColor = (tier?: string) => {
    const t = tier?.toLowerCase();
    if (t === 'pro' || t === 'professional') return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
    if (t === 'enterprise') return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
    return 'border-green-500/30 bg-green-500/10 text-green-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10 animate-gradient-x"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          
          {/* --- HERO SECTION --- */}
          <div className="text-center mb-16 space-y-6">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-3xl overflow-hidden border-4 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] bg-black">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="/logos/nexus-video-logo.mp4" type="video/mp4" />
              </video>
          </div>
  
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Janus Forge Nexus®
          </h1>
  
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-xl md:text-2xl text-white font-medium tracking-wide">
              Where <span className="text-orange-400">Grok</span> meets <span className="text-blue-400">Gemini</span> meets <span className="text-purple-400">Claude</span>...
            </p>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              And they all meet YOU.
            </p>
            <p className="text-gray-500 text-sm uppercase tracking-[0.2em] font-bold">
              Direct. Real-Time. Multi-Model Intelligence.
            </p>
          </div>
        </div>

            {/* --- LEFT: AI FEED PANEL --- */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-blue-300">AI Conversation Feed</h2>
                  <span className="flex items-center gap-2 text-xs text-green-500 font-mono">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE NEXUS
                  </span>
                </div>

                <div className="p-6 border-b border-gray-800 bg-gray-800/20">
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isAuthenticated ? "Engage the AI Council..." : "Please sign in to join the conversation"}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none text-white transition-colors"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${getTierBadgeColor(user?.tier)}`}>
                      {user?.tier?.toUpperCase() || 'FREE'} TIER
                    </span>
                    <button 
                      onClick={handleSendMessage} 
                      disabled={!userMessage.trim() || isSending || !isAuthenticated} 
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95"
                    >
                      {isSending ? 'AI Council Thinking...' : 'Post'}
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-800 max-h-[550px] overflow-y-auto">
                  {conversation.map((msg) => (
                    <div key={msg.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600 shadow-inner">
                          <span className="text-sm">{msg.avatar || '👤'}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="font-bold text-gray-200">{msg.name}</span>
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getTierBadgeColor(msg.tier)}`}>
                              {msg.tier?.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{msg.content}</p>
                          <div className="flex gap-4 mt-4 text-gray-500 text-[10px] font-medium">
                            <button className="flex items-center gap-1 hover:text-red-400 transition-colors"><Heart size={12}/> {msg.likes || 0}</button>
                            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors"><MessageSquare size={12}/> {msg.replies || 0}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- RIGHT: DAILY FORGE CARD --- */}
            <div className="lg:w-1/2 w-full sticky top-8">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                    <h2 className="text-2xl font-bold tracking-tight">The Daily Forge</h2>
                  </div>
                  <div className="px-4 py-1.5 bg-purple-600/20 rounded-full border border-purple-500/30 text-purple-300 font-mono text-xs shadow-inner">
                    {timeRemaining}
                  </div>
                </div>

                <div className="mb-8 bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50 backdrop-sepia-0">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20 uppercase tracking-widest">Active Topic</span>
                  <h3 className="text-xl font-bold mt-4 mb-3 text-white">{topic?.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">{topic?.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-center">
                      <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">AI Interest</div>
                      <div className="text-2xl font-black text-green-400">{topic?.aiInterest}%</div>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-center">
                      <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Human Interest</div>
                      <div className="text-2xl font-black text-blue-400">{topic?.humanInterest}%</div>
                    </div>
                  </div>
                </div>

                <Link href="/daily-forge" className="flex items-center justify-center w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                  Enter The Daily Forge
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
