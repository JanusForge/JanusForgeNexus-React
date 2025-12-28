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
  source: string;
  tags: string[];
  aiInterest: number;
  humanInterest: number;
  timestamp: string;
  nextUpdate: string;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('24:00:00');
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [topic, setTopic] = useState<Topic | null>(null);
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
      setIsSending(false); // EXIT: Reset button
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
      console.error('Sync failed:', error);
    }
  }, []);

  useEffect(() => { fetchBackendData(); }, [fetchBackendData]);

  // 3. SEND MESSAGE WITH SAFETY TIMEOUT
  const handleSendMessage = () => {
    if (!userMessage.trim() || isSending || !isAuthenticated) return;

    setIsSending(true);

    // Safety timeout: If no AI response in 8s, reset the button
    const timeoutId = setTimeout(() => {
      setIsSending(false);
    }, 8000);

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
    if (t === 'pro') return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
    if (t === 'enterprise') return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
    return 'border-green-500/30 bg-green-500/10 text-green-400';
  };

  if (!topic) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-purple-400 font-mono">
      <Zap className="animate-pulse mr-2" /> Initializing Janus Forge Nexus...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-gradient-x"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            <div className="lg:w-1/2">
              <div className="text-center lg:text-left mb-8">
                <div className="relative w-64 h-64 mx-auto lg:mx-0 mb-6 rounded-2xl overflow-hidden border-4 border-purple-500/30 shadow-2xl bg-black">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/logos/nexus-video-logo.mp4" type="video/mp4" />
                  </video>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">Janus Forge Nexus®</h1>
              </div>

              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-blue-300">AI Conversation Feed</h2>
                </div>
                <div className="p-6 border-b border-gray-800">
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isAuthenticated ? "Start a conversation..." : "Sign in to join"}
                    className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-lg text-sm text-white resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className={`px-2 py-1 rounded text-xs ${getTierBadgeColor(user?.tier)}`}>{user?.tier?.toUpperCase() || 'FREE'} TIER</span>
                    <button onClick={handleSendMessage} disabled={!userMessage.trim() || isSending || !isAuthenticated} className="px-4 py-2 bg-blue-600 rounded-lg text-sm">
                      {isSending ? 'AI Council Thinking...' : 'Post'}
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-800 max-h-[500px] overflow-y-auto">
                  {conversation.map((msg) => (
                    <div key={msg.id} className="p-6">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <span>{msg.avatar || '👤'}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="font-medium">{msg.name}</span>
                            <span className={`px-2 py-0.5 rounded-full border ${getTierBadgeColor(msg.tier)}`}>{msg.tier}</span>
                          </div>
                          <p className="text-sm text-gray-300">{msg.content}</p>
                          <div className="flex gap-4 mt-3 text-gray-500 text-xs">
                            <button className="flex items-center gap-1"><Heart size={14}/> {msg.likes || 0}</button>
                            <button className="flex items-center gap-1"><MessageSquare size={14}/> {msg.replies || 0}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">The Daily Forge</h2>
                  <div className="px-3 py-1 bg-purple-600/20 rounded-full text-purple-300 font-mono text-sm">{timeRemaining}</div>
                </div>
                <div className="mb-8 bg-gray-900/50 rounded-xl p-5 border border-gray-700">
                  <h3 className="text-xl font-bold">{topic.title}</h3>
                  <p className="text-gray-300 text-sm mt-2">{topic.description}</p>
                </div>
                <Link href="/daily-forge" className="block text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium">
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
