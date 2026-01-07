"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Calendar, Clock, Zap } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

// URGENT FIX: Make sure this matches your production backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface DailyForge {
  id: string;
  date: string;
  winningTopic: string;
  openingThoughts: string;
  conversationId?: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  content: string;
  sender: 'user' | 'ai';
  tokens_remaining?: number;
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

  const socketRef = useRef<Socket | null>(null);

  // URGENT FIX: Socket setup with better error handling
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
      });

      socketRef.current.on('new-reply', (reply: any) => {
        console.log('💬 New reply:', reply);
        // Handle threaded replies if needed
      });

    } catch (err) {
      console.error('❌ Socket initialization failed:', err);
      setError('Realtime features disabled');
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [current?.conversationId]);

  // URGENT FIX: Enhanced data fetching with error handling
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        setError(null);
        console.log('🔄 Fetching Daily Forge data...');

        // Fetch current Daily Forge
        const currentRes = await fetch(`${API_BASE_URL}/api/daily-forge/current`);
        if (!currentRes.ok) {
          throw new Error(`Failed to fetch current forge: ${currentRes.status}`);
        }

        const currentData = await currentRes.json();
        console.log('📊 Current forge:', currentData);
        setCurrent(currentData);

        // URGENT FIX: Check if conversationId exists and is properly linked
        if (!currentData.conversationId) {
          console.warn('⚠️ No conversationId linked to DailyForge');
          setError('Daily Forge conversation not properly initialized');
        } else if (socketRef.current?.connected) {
          socketRef.current.emit('join-conversation', currentData.conversationId);
          console.log('✅ Joined conversation:', currentData.conversationId);
        }

        // FIX #1: Fetch conversation posts - USE CORRECT ENDPOINT
        if (currentData.conversationId) {
          try {
            const postsRes = await fetch(`${API_BASE_URL}/api/conversations/${currentData.conversationId}`);
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

        // FIX #2: Fetch user tokens if authenticated - USE CORRECT ENDPOINT
        if (isAuthenticated) {
          try {
            const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, { 
              credentials: 'include' 
            });
            if (userRes.ok) {
              const userData = await userRes.json();
              setUserTokens(userData.user?.token_balance || 0);
              console.log('✅ User tokens fetched:', userData.user?.token_balance);
            }
          } catch (tokensErr) {
            console.error('❌ Failed to fetch user tokens:', tokensErr);
          }
        }

        // Set up timer for debate countdown
        if (currentData.date) {
          const endTime = new Date(currentData.date).getTime() + 24 * 60 * 60 * 1000;

          const updateTimer = () => {
            const now = Date.now();
            const diff = endTime - now;
            if (diff <= 0) {
              setTimeLeft("Debate Closed");
              if (timer) clearInterval(timer);
            } else {
              const h = Math.floor(diff / 3600000);
              const m = Math.floor((diff % 3600000) / 60000);
              const s = Math.floor((diff % 60000) / 1000);
              setTimeLeft(`${h}h ${m}m ${s}s remaining`);
            }
          };

          updateTimer();
          timer = setInterval(updateTimer, 1000);
        }

        // Set up polling for updates if socket fails
        if (!socketRef.current?.connected) {
          pollInterval = setInterval(fetchData, 30000); // Poll every 30 seconds
        }

      } catch (err: any) {
        console.error('❌ Daily Forge load error:', err);
        setError(err.message || 'Failed to load Daily Forge');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (timer) clearInterval(timer);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isAuthenticated, user?.id]);

  // FIX #3: Proper token check and interjection handling
  const handleInterject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !current || !user) {
      alert('Please enter a message and make sure you are signed in.');
      return;
    }

    // Check tokens
    if (userTokens < 1) {
      alert('You need at least 1 token to interject. Please purchase tokens first.');
      return;
    }

    // Check if debate is closed
    if (timeLeft === "Debate Closed") {
      alert('This debate is now closed. A new Daily Forge starts tomorrow.');
      return;
    }

    setSending(true);

    try {
      // FIX: Use the conversations API endpoint - tokens are auto-deducted in backend
      const response = await fetch(`${API_BASE_URL}/api/conversations/${current.conversationId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          userId: user.id
          // Backend will auto-deduct 1 token and create transaction
        })
      });

      if (response.ok) {
        setMessage('');
        setUserTokens(prev => prev - 1); // Update local state
        alert("✅ Interjection sent! The council will respond soon.");
        
        // Refresh posts after successful interjection
        if (current.conversationId) {
          setTimeout(async () => {
            try {
              const postsRes = await fetch(`${API_BASE_URL}/api/conversations/${current.conversationId}`);
              if (postsRes.ok) {
                const conv = await postsRes.json();
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
            } catch (refreshErr) {
              console.error('Failed to refresh posts:', refreshErr);
            }
          }, 2000); // Wait 2 seconds for AI responses
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send interjection');
      }
    } catch (err: any) {
      console.error('❌ Interjection failed:', err);
      alert(`Failed to send interjection: ${err.message}`);
    } finally {
      setSending(false);
    }
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
        <h1 className="text-6xl md:text-8xl font-black text-center mb-16 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent uppercase">
          Daily Forge
        </h1>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6 mb-8">
            <p className="text-red-300">⚠️ {error}</p>
          </div>
        )}

        {current ? (
          <div className="mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight max-w-4xl mx-auto">
                {current.winningTopic}
              </h2>
              <div className="flex items-center justify-center gap-6 text-gray-400">
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
              </div>
            </div>

            {/* Opening Council Debate */}
            <div className="space-y-12 mb-16">
              <h3 className="text-2xl font-black text-center mb-8">Initial Council Debate</h3>
              {current.openingThoughts && JSON.parse(current.openingThoughts).map((resp: any, i: number) => (
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

            {/* Community Interjections */}
            <div className="space-y-8 mb-16">
              <div className="flex justify-between items-center mb-8">
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
                  <p className="text-gray-500 text-lg mb-4">No interjections yet.</p>
                  <p className="text-gray-400">Be the first to challenge the council!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {allPosts.map((msg) => (
                    <div key={msg.id} className={`p-8 rounded-3xl border ${msg.sender === 'user' ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-900/50 border-gray-800'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-black">
                          {msg.name?.[0] || 'U'}
                        </div>
                        <div>
                          <h4 className="font-black text-purple-400">{msg.name}</h4>
                          {msg.sender === 'ai' && (
                            <span className="text-xs bg-red-500/50 px-3 py-1 rounded-full">Council Response</span>
                          )}
                        </div>
                        {msg.created_at && (
                          <span className="text-gray-500 text-sm ml-auto">
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
                  <h3 className="text-3xl font-black mb-6">Interject into the Debate</h3>
                  <p className="text-xl text-gray-200 leading-relaxed mb-8">
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
                    <p className="text-green-400 text-xl font-bold">
                      ✅ You have {userTokens} tokens available for interjections
                    </p>
                  )}
                </div>

                {isAuthenticated && userTokens >= 1 && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-3xl p-12">
                    <form onSubmit={handleInterject} className="space-y-6">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Challenge the council. Add your insight. Shape the synthesis... (costs 1 token)"
                        className="w-full bg-black/50 border border-gray-700 rounded-2xl p-6 text-white min-h-[200px] outline-none focus:border-purple-500 resize-none text-lg"
                        required
                        disabled={sending}
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">
                          {message.length > 0 && `Characters: ${message.length}`}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-300">
                            This will use <strong>1 token</strong> from your balance
                          </span>
                          <button
                            type="submit"
                            disabled={sending || !message.trim() || userTokens < 1}
                            className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-xl uppercase tracking-wider transition-all shadow-2xl shadow-purple-900/50"
                          >
                            <Zap size={24} />
                            {sending ? "Sending..." : `Interject (1 Token)`}
                          </button>
                        </div>
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

