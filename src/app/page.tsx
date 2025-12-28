"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Calendar, Clock, TrendingUp, Users, Zap, Heart, MessageSquare, Save } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

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

  const [timeRemaining, setTimeRemaining] = useState<string>('24:00:00');
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  
  // Initialize topic with a skeleton so the page doesn't hang on "Initializing"
  const [topic, setTopic] = useState<Topic | null>({
    id: 'loading',
    title: 'Synchronizing with Nexus...',
    description: 'Fetching the latest Forge data...',
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
      setIsSending(false); // Reset button state
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

    // Safety timeout to prevent getting stuck in "Thinking..."
    const timeout = setTimeout(() => setIsSending(false), 8000);

    const payload = {
      content: userMessage,
      userId: user?.id,
      // Fixed: Casting as any to bypass the TypeScript 'username' vs 'name' conflict
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
      <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: AI Feed */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              Janus Forge Nexus®
            </h1>
            
            <div className="bg-gray-900/80 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex justify-between">
                <h2 className="text-xl font-bold text-blue-300">Conversation Feed</h2>
                <span className="text-xs text-green-500 animate-pulse">● Live</span>
              </div>

              <div className="p-6 border-b border-gray-800">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isAuthenticated ? "Engage the AI Council..." : "Please sign in..."}
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-lg text-white resize-none"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className={`px-2 py-1 rounded text-xs ${getTierBadgeColor(user?.tier)}`}>
                    {user?.tier?.toUpperCase() || 'FREE'} TIER
                  </span>
                  <button 
                    onClick={handleSendMessage} 
                    disabled={!userMessage.trim() || isSending || !isAuthenticated}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all"
                  >
                    {isSending ? 'AI Council Thinking...' : 'Post'}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
                {conversation.map((msg) => (
                  <div key={msg.id} className="p-6 hover:bg-gray-800/20">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        {msg.avatar || '👤'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 text-xs">
                          <span className="font-bold">{msg.name}</span>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] ${getTierBadgeColor(msg.tier)}`}>
                            {msg.tier?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Daily Forge Card */}
          <div className="lg:w-1/2">
            <div className="bg-gray-900/80 p-8 rounded-2xl border border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2"><Zap className="text-yellow-500" /> <h2 className="text-2xl font-bold">The Daily Forge</h2></div>
                <div className="font-mono text-purple-400 bg-purple-400/10 px-3 py-1 rounded border border-purple-400/20">{timeRemaining}</div>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h3 className="text-xl font-bold mb-2">{topic?.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{topic?.description}</p>
              </div>

              <Link href="/daily-forge" className="block text-center w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:scale-[1.02] transition-transform">
                Enter The Daily Forge
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
