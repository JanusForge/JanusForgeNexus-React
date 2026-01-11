// src/app/daily-forge/page.tsx - Updated with minimal changes
// • New "Topic Selection & Council Vote" section that appears when scoutedTopics exist
// • Shows the 3 scouted topics with descriptions
// • Displays each council member's vote (DeepSeek, Grok, Gemini)
// • Highlights the winning topic clearly
// • This section shows even after voting (for transparency), placed above the main topic
// • Falls back gracefully if no topics/votes yet
// • Replaces the old TopicSelectionInProgress component (now automated, no need for force button)
"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Calendar, Clock, Zap, Wifi, WifiOff, AlertCircle, Users, Vote, MessageSquare, Trophy } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface DailyForge {
  id: string;
  date: string;
  winningTopic: string;
  openingThoughts: string;
  conversationId?: string;
  created_at: string;
  scoutedTopics?: string;
  phase?: string;
  councilVotes?: string;
}

interface Message {
  id: string;
  name: string;
  content: string;
  sender: 'user' | 'ai';
  tokens_remaining?: number;
  created_at?: string;
}

export default function DailyForgePage() {
  const { user, isAuthenticated } = useAuth();
  const [current, setCurrent] = useState<DailyForge | null>(null);
  const [history, setHistory] = useState<DailyForge[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [allPosts, setAllPosts] = useState<Message[]>([]);
  const [userTokens, setUserTokens] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastErrorDetails, setLastErrorDetails] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Network: Online');
      setIsOnline(true);
      setError(null);
    };
    const handleOffline = () => {
      console.log('🌐 Network: Offline');
      setIsOnline(false);
      setError('Network connection lost. Please check your internet connection.');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync initial tokens from user object
  useEffect(() => {
    if (user && user.tokens_remaining !== undefined) {
      console.log('💰 Initial user tokens:', user.tokens_remaining);
      setUserTokens(user.tokens_remaining);
    }
  }, [user]);

  // Socket connection
  useEffect(() => {
    try {
      socketRef.current = io(API_BASE_URL, {
        withCredentials: true,
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      socketRef.current.on('connect', () => {
        console.log('✅ Daily Forge socket connected');
        if (current?.conversationId) {
          socketRef.current?.emit('join-conversation', current.conversationId);
        }
      });
      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Socket connection error:', err.message);
        setError('Realtime updates unavailable. Page will refresh periodically.');
      });
      socketRef.current.on('post:incoming', (msg: Message) => {
        console.log('📨 New post received:', msg);
        setAllPosts(prev => [msg, ...prev]);
        if (msg.tokens_remaining !== undefined) {
          setUserTokens(msg.tokens_remaining);
        }
      });
    } catch (err) {
      console.error('❌ Socket initialization failed:', err);
      setError('Realtime features disabled');
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [current?.conversationId]);

  // Enhanced polling for topic selection phase
  const startPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    const interval = setInterval(() => {
      if (current?.phase === 'TOPIC_SELECTION' && !current.winningTopic) {
        console.log('🔄 Polling for topic selection updates...');
        fetchData();
      }
    }, 10000); // Poll every 10 seconds during topic selection
    setPollingInterval(interval);
    return interval;
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching Daily Forge data...');
      const currentRes = await fetch(`${API_BASE_URL}/api/daily-forge/current`);
      if (!currentRes.ok) {
        throw new Error(`Failed to fetch current forge: ${currentRes.status}`);
      }
      const currentData = await currentRes.json();
      console.log('📊 Current forge:', currentData);
      setCurrent(currentData);
      // Update polling based on phase
      if (currentData.phase === 'TOPIC_SELECTION' && !currentData.winningTopic) {
        console.log('🔄 Starting polling for topic selection');
        startPolling();
      } else {
        console.log('🛑 Stopping polling - topic selected or phase advanced');
        stopPolling();
      }
      // Fetch conversation posts if conversation exists
      if (currentData.conversationId) {
        try {
          const postsRes = await fetch(`${API_BASE_URL}/api/conversations/${currentData.conversationId}`, {
            credentials: 'include'
          });
          if (postsRes.ok) {
            const conv = await postsRes.json();
            console.log('💬 Conversation data:', conv);
            const posts = conv.conversation?.posts || [];
            const formatted = posts.map((p: any) => ({
              id: p.id,
              name: p.is_human ? p.user?.username || 'User' : p.ai_model || 'AI Council',
              content: p.content,
              sender: p.is_human ? 'user' : 'ai',
              created_at: p.created_at
            })).reverse();
            setAllPosts(formatted);
          }
        } catch (postsErr) {
          console.error('❌ Failed to fetch posts:', postsErr);
        }
      }
      // Fetch history
      try {
        const historyRes = await fetch(`${API_BASE_URL}/api/daily-forge/history`);
        if (historyRes.ok) {
          setHistory(await historyRes.json());
        }
      } catch (historyErr) {
        console.error('❌ Failed to fetch history:', historyErr);
      }
      // Set up timer for debate countdown - Force end at next midnight EST (05:00 UTC)
      if (currentData.date) {
        const forgeDate = new Date(currentData.date);
        // Calculate next midnight EST (05:00 UTC the next day)
        const nextMidnightEST = new Date(forgeDate);
        nextMidnightEST.setDate(nextMidnightEST.getDate() + 1);
        nextMidnightEST.setUTCHours(5, 0, 0, 0); // 05:00 UTC = midnight EST
        const endTime = nextMidnightEST.getTime();
        const updateTimer = () => {
          const now = Date.now();
          const diff = endTime - now;
          if (diff <= 0) {
            setTimeLeft("Debate Closed");
          } else {
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${h}h ${m}m ${s}s remaining`);
          }
        };
        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        // Clean up timer
        return () => clearInterval(timer);
      }
    } catch (err: any) {
      console.error('❌ Daily Forge load error:', err);
      setError(err.message || 'Failed to load Daily Forge');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
    // Clean up polling on unmount
    return () => {
      stopPolling();
    };
  }, [isAuthenticated, user?.id]);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
  };

  const handleInterject = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if council debate is complete
    const isCouncilDebateComplete = () => {
      if (!current) return false;
      const hasOpeningThoughts = current.openingThoughts && current.openingThoughts.length > 0;
      const hasConversationId = !!current.conversationId;
      return hasOpeningThoughts && hasConversationId;
    };

    // Prevent interjection if in TOPIC_SELECTION phase
    if (current?.phase === 'TOPIC_SELECTION') {
      alert('The council is still selecting today\'s topic. Please wait for the topic to be chosen and the opening debate to begin.');
      return;
    }

    if (!isCouncilDebateComplete()) {
      if (!current?.openingThoughts) {
        alert('Council debate has not started yet. Please wait for the opening statements.');
      } else if (!current?.conversationId) {
        alert('Conversation not initialized. Please refresh the page.');
      } else {
        alert('Interjections are only allowed when council debate is complete.');
      }
      return;
    }

    if (!message.trim()) {
      alert('Please enter a message.');
      return;
    }

    if (!current) {
      alert('No active forge found.');
      return;
    }

    if (!user) {
      alert('Please sign in to interject.');
      return;
    }

    if (userTokens < 1) {
      alert('You need at least 1 token to interject. Please purchase tokens first.');
      return;
    }

    if (timeLeft === "Debate Closed") {
      alert('This debate is now closed. A new Daily Forge starts tomorrow.');
      return;
    }

    if (!current.conversationId) {
      alert('This conversation is not ready for interjections yet. Please try again in a moment.');
      return;
    }

    if (!isOnline) {
      alert('You are offline. Please check your internet connection and try again.');
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/conversations/${current.conversationId}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          userId: user.id,
          is_human: true,
          conversationId: current.conversationId,  // FIXED: camelCase to match backend
          isLiveChat: false  // FIXED: Explicitly prevent Live Chat fallback
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to send interjection';
        try {
          const errorText = await response.text();
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setMessage('');

      // Optimistic UI update: Add your message locally for instant feedback
      const newPost: Message = {
        id: crypto.randomUUID(),
        name: user.username || 'You',
        content: message,
        sender: 'user',
        created_at: new Date().toISOString(),
      };
      setAllPosts(prev => [newPost, ...prev]);

      if (responseData.tokens_remaining !== undefined) {
        setUserTokens(responseData.tokens_remaining);
      }

      alert("✅ Interjection sent! The council will respond soon.");
    } catch (err: any) {
      console.error('❌ Interjection failed:', err);
      alert(`Failed to send interjection: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  // New: Topic Selection & Vote Display Component
  const TopicSelectionAndVote = () => {
    if (!current?.scoutedTopics) return null;
    let scoutedTopics: any[] = [];
    try {
      scoutedTopics = JSON.parse(current.scoutedTopics || '[]');
    } catch (e) {
      console.error('Failed to parse scouted topics:', e);
    }
    let councilVotes: Record<string, string> = {};
    try {
      councilVotes = JSON.parse(current.councilVotes || '{}');
      // Normalize keys to lowercase for consistency
      councilVotes = Object.fromEntries(
        Object.entries(councilVotes).map(([k, v]) => [k.toLowerCase(), v as string])
      );
    } catch (e) {
      console.error('Failed to parse council votes:', e);
    }
    const winningTitle = current.winningTopic || 'Selection in progress...';
    return (
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700/50 rounded-3xl p-8 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <Trophy className="text-yellow-400" size={32} />
          <h3 className="text-3xl font-black text-indigo-300">Daily Topic Selection & Council Vote</h3>
        </div>
        {/* Scouted Topics */}
        <div className="mb-10">
          <h4 className="text-xl font-bold text-purple-300 mb-6 flex items-center gap-3">
            <MessageSquare size={24} />
            Three Scouted Topics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scoutedTopics.map((topic: any, i: number) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  topic.title === winningTitle
                    ? 'bg-yellow-900/40 border-yellow-500 shadow-xl shadow-yellow-900/50'
                    : 'bg-gray-900/50 border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl font-black text-purple-400">#{i + 1}</span>
                  {topic.title === winningTitle && (
                    <div className="flex items-center gap-2 text-yellow-400 font-bold">
                      <Trophy size={20} />
                      Winner
                    </div>
                  )}
                </div>
                <h5 className="text-lg font-bold text-white mb-2">{topic.title}</h5>
                <p className="text-gray-300 text-sm leading-relaxed">{topic.description || 'No description available'}</p>
                {topic.provocation && (
                  <p className="text-purple-300 text-xs italic mt-3">"{topic.provocation}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Council Votes */}
        {Object.keys(councilVotes).length > 0 && (
          <div>
            <h4 className="text-xl font-bold text-purple-300 mb-6 flex items-center gap-3">
              <Vote size={24} />
              Council Votes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['deepseek', 'grok', 'gemini_pro'].map((ai) => (
                <div key={ai} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-black text-xl">
                      {ai[0].toUpperCase()}
                    </div>
                    <h5 className="text-xl font-bold capitalize text-purple-300">{ai.replace('_', ' ')}</h5>
                  </div>
                  <p className="text-gray-200">
                    Voted for:{' '}
                    <span className="font-bold text-yellow-300">
                      {councilVotes[ai] || 'No vote recorded'}
                    </span>
                  </p>
                  {councilVotes[ai] === winningTitle && (
                    <div className="mt-3 text-green-400 font-bold flex items-center gap-2">
                      <Trophy size={18} />
                      Supported the winning topic
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-6"></div>
          <p className="text-2xl">Forging today's debate...</p>
          <p className="text-gray-400 mt-2">Loading AI Council discussion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Network status indicator */}
        {!isOnline && (
          <div className="fixed top-4 left-4 z-50">
            <div className="bg-red-500/90 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
              <WifiOff size={16} />
              <span className="font-bold">Offline</span>
            </div>
          </div>
        )}

        <h1 className="text-6xl md:text-8xl font-black text-center mb-16 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent uppercase">
          Daily Forge
        </h1>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6 mb-8">
            <p className="text-red-300">⚠️ {error}</p>
            {error.includes('Network') && (
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
              >
                Reload Page
              </button>
            )}
          </div>
        )}

        {current ? (
          <div className="mb-32">
            {/* NEW: Always show topic selection & vote info when available */}
            <TopicSelectionAndVote />

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight max-w-4xl mx-auto">
                {current.winningTopic || "Today's topic being selected..."}
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  {new Date(current.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span className={`font-bold text-xl ${timeLeft === "Debate Closed" ? "text-red-400" : "text-purple-400"}`}>
                    {timeLeft}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <div className="flex items-center gap-1 text-green-400">
                      <Wifi size={16} />
                      <span className="text-sm">Online</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-400">
                      <WifiOff size={16} />
                      <span className="text-sm">Offline</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    current.phase === 'CONVERSATION' ? 'bg-green-500/20 text-green-300 border border-green-500/50' :
                    current.phase === 'COUNCIL_DEBATE' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
                    current.phase === 'TOPIC_SELECTION' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' :
                    'bg-gray-500/20 text-gray-300 border border-gray-500/50'
                  }`}>
                    {current.phase?.replace('_', ' ') || 'ACTIVE'}
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Council Debate */}
            {current.openingThoughts && (
              <div className="space-y-12 mb-16">
                <h3 className="text-2xl font-black text-center mb-8">Initial Council Debate</h3>
                {JSON.parse(current.openingThoughts).map((resp: any, i: number) => (
                  <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-black text-lg">
                        {resp.model?.[0] || 'A'}
                      </div>
                      <h4 className="text-2xl font-black text-purple-400">
                        {resp.model || 'AI Council Member'}
                      </h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                      {resp.content || 'No response available'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Community Interjections */}
            <div className="space-y-8 mb-16">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="text-2xl font-black">Community Interjections</h3>
                {isAuthenticated && (
                  <div className="flex items-center gap-2 bg-gray-900/70 px-4 py-2 rounded-full">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="font-bold">{userTokens} tokens remaining</span>
                  </div>
                )}
              </div>

              {allPosts.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/30 border border-gray-800 rounded-3xl">
                  {current.phase === 'TOPIC_SELECTION' ? (
                    <>
                      <p className="text-gray-500 text-lg mb-4">Waiting for council debate to begin...</p>
                      <p className="text-gray-400">Interjections will open after the opening council debate.</p>
                    </>
                  ) : current.phase === 'COUNCIL_DEBATE' ? (
                    <>
                      <p className="text-gray-500 text-lg mb-4">Council debate in progress...</p>
                      <p className="text-gray-400">Interjections will open once the council finishes opening statements.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 text-lg mb-4">No interjections yet.</p>
                      <p className="text-gray-400">Be the first to challenge the council!</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {allPosts.map((msg) => (
                    <div key={msg.id} className={`p-8 rounded-3xl border ${msg.sender === 'user' ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-900/50 border-gray-800'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-black">
                            {msg.name?.[0] || 'U'}
                          </div>
                          <div>
                            <h4 className="font-black text-purple-400">{msg.name}</h4>
                            {msg.sender === 'ai' && (
                              <span className="text-xs bg-red-500/50 px-3 py-1 rounded-full">Council Response</span>
                            )}
                          </div>
                        </div>
                        {msg.created_at && (
                          <span className="text-gray-500 text-sm sm:ml-auto">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap text-lg">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interjection Form */}
            {timeLeft !== "Debate Closed" && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-3xl p-12 mb-12 text-center">
                  <h3 className="text-3xl font-black mb-6">Daily Forge Status: {current?.phase?.replace('_', ' ') || 'Active'}</h3>
                  {current?.phase === 'TOPIC_SELECTION' ? (
                    <>
                      <p className="text-xl text-blue-200 leading-relaxed mb-8">
                        <strong>Topic Selection Phase</strong><br />
                        The AI Council is currently selecting today's debate topic. Check back soon for the opening arguments!
                      </p>
                      <div className="bg-blue-900/30 border border-blue-700 rounded-2xl p-6">
                        <p className="text-lg text-blue-100">
                          <strong>Workflow status:</strong><br />
                          1. Topic Selection (Now) → 2. Council Debate → 3. Conversation Phase (24 hours) → 4. Debate Closed
                        </p>
                      </div>
                    </>
                  ) : current?.openingThoughts && current?.conversationId ? (
                    <>
                      <p className="text-xl text-gray-200 leading-relaxed mb-8">
                        <strong>Conversation Phase Active!</strong><br />
                        Purchase tokens to participate. Your comments and questions will be <strong>publicly displayed</strong> as part of this historic Daily Forge debate.<br />
                        Each interjection costs <strong>1 token</strong>. You must be signed in to join the council.
                      </p>
                      {!isAuthenticated ? (
                        <Link
                          href={`/register?redirect=${encodeURIComponent('/daily-forge')}`}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-black text-xl uppercase tracking-wider transition-all shadow-xl shadow-purple-900/50"
                        >
                          <Zap size={24} />
                          Sign Up Free → Get 10 Tokens
                        </Link>
                      ) : userTokens < 1 ? (
                        <Link
                          href="/pricing"
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-2xl font-black text-xl uppercase tracking-wider transition-all shadow-xl shadow-red-900/50"
                        >
                          <Zap size={24} />
                          Purchase Tokens to Interject
                        </Link>
                      ) : (
                        <p className="text-green-400 text-xl font-bold mb-8">
                          ✅ You have {userTokens} tokens available for interjections
                        </p>
                      )}
                    </>
                  ) : current?.phase === 'COUNCIL_DEBATE' ? (
                    <>
                      <p className="text-xl text-yellow-200 leading-relaxed mb-8">
                        <strong>Council Debate Phase</strong><br />
                        The AI Council is currently in the opening debate phase. The council members are presenting their initial arguments.<br />
                        <span className="text-green-300 font-bold">Interjections will be enabled once the council debate is complete.</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-xl text-gray-200 leading-relaxed mb-8">
                      The Daily Forge is active. Status updates will appear here.
                    </p>
                  )}
                </div>

                {/* Interjection Form */}
                {current?.openingThoughts && current?.conversationId && isAuthenticated && userTokens >= 1 && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-3xl p-12">
                    <form onSubmit={handleInterject} className="space-y-6">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Challenge the council. Add your insight. Shape the synthesis... (costs 1 token)"
                        className="w-full bg-black/50 border border-gray-700 rounded-2xl p-6 text-white min-h-[200px] outline-none focus:border-purple-500 resize-none text-lg"
                        required
                        disabled={sending || !isOnline || current?.phase === 'TOPIC_SELECTION'}
                      />
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="text-gray-400">
                          {message.length > 0 && `Characters: ${message.length}`}
                        </div>
                        <button
                          type="submit"
                          disabled={sending || !message.trim() || userTokens < 1 || !isOnline || current?.phase === 'TOPIC_SELECTION'}
                          className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-xl uppercase tracking-wider transition-all shadow-2xl shadow-purple-900/50"
                        >
                          <Zap size={24} />
                          {sending ? "Sending..." : `Interject (1 Token)`}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
            {timeLeft === "Debate Closed" && (
              <div className="text-center py-16 bg-gray-900/30 border border-gray-800 rounded-3xl">
                <p className="text-3xl text-gray-300 mb-4">⚖️ This Daily Forge is now closed.</p>
                <p className="text-xl text-gray-400">The council has finished debating. A new topic begins tomorrow.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-300 mb-4">No active Daily Forge found</p>
            <p className="text-xl text-gray-400">The council is preparing today's debate. Check back soon!</p>
          </div>
        )}

        {/* History */}
        <div className="mt-32">
          <h2 className="text-5xl font-black text-center mb-16">Daily Forge History</h2>
          {history.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500">No past debates yet.</p>
              <p className="text-xl text-gray-400 mt-4">The first Daily Forge begins soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((forge) => (
                <Link
                  key={forge.id}
                  href={`/conversation/${forge.conversationId || forge.id}/public`}
                  className="block bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all group"
                >
                  <h3 className="text-xl font-bold mb-4 line-clamp-3 group-hover:text-purple-400 transition-colors">
                    {forge.winningTopic}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {new Date(forge.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-purple-400 font-bold group-hover:text-purple-300 transition-colors">
                    View Debate →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
