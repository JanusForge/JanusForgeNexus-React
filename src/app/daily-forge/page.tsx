"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Calendar, Clock, Zap, Wifi, WifiOff } from 'lucide-react';
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

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // FIX 1: Sync initial tokens from user object like Home page does
  useEffect(() => {
    if (user && user.tokens_remaining !== undefined) {
      console.log('💰 Initial user tokens:', user.tokens_remaining);
      setUserTokens(user.tokens_remaining);
    }
  }, [user]);

  // FIX 2: Update socket to handle token updates like Home page
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

        // FIX 3: Update tokens from socket message like Home page does
        if (msg.tokens_remaining !== undefined) {
          setUserTokens(msg.tokens_remaining);
        }
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

  // Debug form state
  useEffect(() => {
    console.log('🔍 Debug - Form state:');
    console.log('   Message:', message);
    console.log('   Sending:', sending);
    console.log('   User tokens:', userTokens);
    console.log('   Authenticated:', isAuthenticated);
    console.log('   Current forge ID:', current?.conversationId);
    console.log('   Current phase:', current?.phase);
  }, [message, sending, userTokens, isAuthenticated, current]);

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

        // FIXED: Only show error in CONVERSATION phase without conversationId
        console.log(`🔍 Debug - Phase: ${currentData.phase}, Conversation ID: ${currentData.conversationId || 'none'}`);

        if (currentData.phase === 'CONVERSATION' && !currentData.conversationId) {
          console.error('❌ CONVERSATION phase but no conversationId');
          setError('Daily Forge conversation not properly initialized');
        } else {
          // For TOPIC_SELECTION or any other phase, NO ERROR
          console.log(`✅ ${currentData.phase} phase - conversationId not required yet`);
          setError(null);

          // Join socket if we have conversationId (optional for CONVERSATION phase)
          if (currentData.conversationId && socketRef.current?.connected) {
            socketRef.current.emit('join-conversation', currentData.conversationId);
            console.log('✅ Joined conversation:', currentData.conversationId);
          }
        }

        // FIX #1: Fetch conversation posts - USE CORRECT ENDPOINT
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
          pollInterval = setInterval(fetchData, 30000);
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

  // Diagnostic function for debugging
  const runDiagnostics = async () => {
    console.group('🔧 Daily Forge Diagnostics');
    console.log('📅 Current Date:', new Date().toISOString());
    console.log('👤 User:', user);
    console.log('💰 User Tokens:', userTokens);
    console.log('🎯 Current Forge:', current);
    console.log('🔌 Socket Connected:', socketRef.current?.connected);
    console.log('🌐 API Base URL:', API_BASE_URL);
    console.log('📶 Network Online:', isOnline);
    
    // Test API connectivity
    try {
      console.log('🏥 Testing API health...');
      const healthCheck = await fetch(`${API_BASE_URL}/health`, { 
        credentials: 'include'
      });
      console.log('🏥 Health Check Status:', healthCheck.status);
      if (!healthCheck.ok) {
        const text = await healthCheck.text();
        console.log('🏥 Health Check Response:', text);
      }
    } catch (err: any) {
      console.error('🏥 Health Check Failed:', err.message);
    }
    
    // Test conversation endpoint
    if (current?.conversationId) {
      try {
        console.log('💬 Testing conversation endpoint...');
        const convTest = await fetch(
          `${API_BASE_URL}/api/conversations/${current.conversationId}`,
          { 
            credentials: 'include'
          }
        );
        console.log('💬 Conversation Test Status:', convTest.status);
        if (!convTest.ok) {
          const text = await convTest.text();
          console.log('💬 Conversation Test Response:', text);
        }
      } catch (err: any) {
        console.error('💬 Conversation Test Failed:', err.message);
      }
    }
    
    console.groupEnd();
    
    alert('Diagnostics complete. Check browser console for details.');
  };

  // Test the POST endpoint directly
  const testPostEndpoint = async () => {
    if (!current?.conversationId || !user) {
      alert('Need conversation ID and user to test');
      return;
    }

    console.log('🔍 Testing POST endpoint directly...');
    
    const testPayload = {
      content: 'Test message from diagnostic function',
      userId: user.id,
      is_human: true,
      conversation_id: current.conversationId
    };

    console.log('📤 Test POST URL:', `${API_BASE_URL}/api/conversations/${current.conversationId}/posts`);
    console.log('📝 Test Payload:', testPayload);

    try {
      const response = await fetch(`${API_BASE_URL}/api/conversations/${current.conversationId}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      console.log('📡 Test Response Status:', response.status);
      console.log('📡 Test Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Test Failed - Response Text:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          console.error('❌ Test Failed - JSON:', errorJson);
          alert(`POST test failed: ${response.status}\n\n${JSON.stringify(errorJson, null, 2)}`);
        } catch {
          console.error('❌ Test Failed - Raw Text:', errorText);
          alert(`POST test failed: ${response.status}\n\n${errorText}`);
        }
      } else {
        const successData = await response.json();
        console.log('✅ Test Success:', successData);
        alert(`POST test successful!\n\n${JSON.stringify(successData, null, 2)}`);
      }
    } catch (err: any) {
      console.error('❌ Test Exception:', err);
      alert(`Test exception: ${err.message}`);
    }
  };

  // FIX #3: Proper token check and interjection handling WITH DEBUGGING
  const handleInterject = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🚀 handleInterject called');
    console.log('📝 Message:', message);
    console.log('👤 User:', user);
    console.log('🎯 Current forge:', current);
    console.log('💰 User tokens:', userTokens);
    console.log('⏰ Time left:', timeLeft);
    console.log('📊 Current phase:', current?.phase);

    // NEW LOGIC: Check if council debate is complete (has opening thoughts and conversation)
    const isCouncilDebateComplete = () => {
      if (!current) return false;

      const hasOpeningThoughts = current.openingThoughts &&
                                current.openingThoughts.length > 0;
      const hasConversationId = !!current.conversationId;

      return hasOpeningThoughts && hasConversationId;
    };

    // Allow interjections if council debate is complete, regardless of phase label
    if (!isCouncilDebateComplete()) {
      console.log('❌ Council debate not complete');
      console.log('  Has opening thoughts:', !!current?.openingThoughts);
      console.log('  Has conversation ID:', !!current?.conversationId);

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
      console.log('❌ Message is empty');
      alert('Please enter a message.');
      return;
    }

    if (!current) {
      console.log('❌ No current forge');
      alert('No active forge found.');
      return;
    }

    if (!user) {
      console.log('❌ User not authenticated');
      alert('Please sign in to interject.');
      return;
    }

    if (userTokens < 1) {
      console.log('❌ Insufficient tokens:', userTokens);
      alert('You need at least 1 token to interject. Please purchase tokens first.');
      return;
    }

    if (timeLeft === "Debate Closed") {
      console.log('❌ Debate is closed');
      alert('This debate is now closed. A new Daily Forge starts tomorrow.');
      return;
    }

    if (!current.conversationId) {
      console.log('❌ No conversation ID');
      alert('This conversation is not ready for interjections yet. Please try again in a moment.');
      return;
    }

    if (!isOnline) {
      console.log('❌ Network is offline');
      alert('You are offline. Please check your internet connection and try again.');
      return;
    }

    console.log('✅ All checks passed, making POST request...');
    console.log('📤 POST URL:', `${API_BASE_URL}/api/conversations/${current.conversationId}/posts`);
    console.log('📝 POST Body:', JSON.stringify({
      content: message,
      userId: user.id
    }));

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
          conversation_id: current.conversationId
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = 'Failed to send interjection';
        let errorDetails = '';
        
        try {
          const errorText = await response.text();
          console.error('❌ Server error text:', errorText);
          errorDetails = errorText;
          
          try {
            const errorData = JSON.parse(errorText);
            console.error('❌ Backend error details:', errorData);
            errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
            errorDetails = JSON.stringify(errorData, null, 2);
          } catch (parseError) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        } catch (textError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        setLastErrorDetails(errorDetails);
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('✅ Interjection successful:', responseData);

      setMessage('');
      setLastErrorDetails('');

      // Update tokens if returned
      if (responseData.tokens_remaining !== undefined) {
        console.log('💰 Updated tokens:', responseData.tokens_remaining);
        setUserTokens(responseData.tokens_remaining);
      }

      // If backend returns the new post, add it to the list
      if (responseData.post) {
        const newPost: Message = {
          id: responseData.post.id,
          name: user.username || 'User',
          content: responseData.post.content,
          sender: 'user',
          tokens_remaining: responseData.tokens_remaining,
          created_at: responseData.post.created_at || new Date().toISOString()
        };
        setAllPosts(prev => [newPost, ...prev]);
        console.log('📝 Added new post to list:', newPost);
      }

      alert("✅ Interjection sent! The council will respond soon.");

      // Refresh posts after successful interjection
      if (current.conversationId) {
        setTimeout(async () => {
          try {
            console.log('🔄 Refreshing posts...');
            const postsRes = await fetch(`${API_BASE_URL}/api/conversations/${current.conversationId}`, {
              credentials: 'include'
            });
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
              console.log('✅ Posts refreshed, count:', formatted.length);
            }
          } catch (refreshErr) {
            console.error('Failed to refresh posts:', refreshErr);
          }
        }, 2000);
      }

    } catch (err: any) {
      console.error('❌ Interjection failed:', err);

      // Enhanced error handling with retry suggestion
      let alertMessage = err.message || 'Please try again';
      let showRetryButton = false;
      
      if (err.message.includes('500') || err.message.includes('Internal server error')) {
        alertMessage = 'Server error. Please try again in a moment. If this continues, contact support.';
        showRetryButton = true;
      } else if (err.message.includes('401') || err.message.includes('403')) {
        alertMessage = 'Session expired. Please refresh the page and sign in again.';
      } else if (err.message.includes('404')) {
        alertMessage = 'Conversation not found. Please refresh the page.';
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        alertMessage = 'Network error. Please check your connection and try again.';
        showRetryButton = true;
      }

      // Log detailed error for debugging
      console.error('🔴 Full error details:', {
        message: err.message,
        stack: err.stack,
        currentForge: current,
        userTokens,
        timeLeft
      });

      // Show retry option for certain errors
      if (showRetryButton) {
        const shouldRetry = window.confirm(`${alertMessage}\n\nLast error details:\n${lastErrorDetails}\n\nWould you like to retry?`);
        if (shouldRetry) {
          // Small delay before retry
          setTimeout(() => {
            handleInterject(e);
          }, 2000);
          return;
        }
      } else {
        alert(`Failed to send interjection: ${alertMessage}\n\nError details:\n${lastErrorDetails}`);
      }
    } finally {
      setSending(false);
    }
  };

  // Test function for debugging
  const testInterjection = async () => {
    console.log('🧪 Testing interjection function...');
    setMessage('Test message - please ignore');

    // Simulate form submit
    const fakeEvent = {
      preventDefault: () => console.log('preventDefault called')
    } as React.FormEvent;

    await handleInterject(fakeEvent);
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

        {/* Debug buttons - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <button
              onClick={testInterjection}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold"
            >
              🧪 Test Interjection
            </button>
            <button
              onClick={runDiagnostics}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
            >
              🔧 Run Diagnostics
            </button>
            <button
              onClick={testPostEndpoint}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold"
            >
              📤 Test POST Endpoint
            </button>
          </div>
        )}

        {/* Error details display */}
        {lastErrorDetails && (
          <div className="fixed top-20 right-4 z-50 max-w-md">
            <div className="bg-red-900/90 text-white p-4 rounded-lg border border-red-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Last Error Details:</span>
                <button 
                  onClick={() => setLastErrorDetails('')}
                  className="text-red-300 hover:text-white"
                >
                  ×
                </button>
              </div>
              <pre className="text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                {lastErrorDetails}
              </pre>
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight max-w-4xl mx-auto">
                {current.winningTopic}
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
                {/* Network status */}
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
                {/* Add phase badge */}
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
                  <p className="text-gray-500 text-lg mb-4">No interjections yet.</p>
                  <p className="text-gray-400">Be the first to challenge the council!</p>
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

            {/* Interjection Form & Phase Information */}
            {timeLeft !== "Debate Closed" && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-3xl p-12 mb-12 text-center">
                  <h3 className="text-3xl font-black mb-6">Daily Forge Status: {current?.phase?.replace('_', ' ') || 'Active'}</h3>

                  {/* UPDATED LOGIC: Check if council debate is complete */}
                  {current?.openingThoughts && current?.conversationId ? (
                    <>
                      <p className="text-xl text-gray-200 leading-relaxed mb-8">
                        <strong>Conversation Phase Active!</strong><br />
                        {current?.phase === 'COUNCIL_DEBATE' && (
                          <span className="text-yellow-300 text-lg block mb-2">
                            (Phase display may be delayed - interjections are enabled!)
                          </span>
                        )}
                        Purchase tokens to participate. Your comments and questions will be <strong>publicly displayed</strong> as part of this historic Daily Forge debate.<br />
                        Each interjection costs <strong>1 token</strong>. You must be signed in to join the council.
                        {!isOnline && (
                          <span className="text-red-300 block mt-2">
                            ⚠️ You are currently offline. Please check your internet connection.
                          </span>
                        )}
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
                      <div className="bg-yellow-900/30 border border-yellow-700 rounded-2xl p-6">
                        <p className="text-lg text-yellow-100">
                          <strong>Expected timeline:</strong><br />
                          1. Council Debate → 2. Conversation Phase (24 hours) → 3. Debate Closed
                        </p>
                      </div>
                    </>
                  ) : current?.phase === 'TOPIC_SELECTION' ? (
                    <p className="text-xl text-blue-200 leading-relaxed mb-8">
                      <strong>Topic Selection Phase</strong><br />
                      The council is selecting today's debate topic. Check back soon for the opening arguments!
                    </p>
                  ) : (
                    <p className="text-xl text-gray-200 leading-relaxed mb-8">
                      The Daily Forge is active. Status updates will appear here.
                    </p>
                  )}
                </div>

                {/* UPDATED: Show interjection form when council debate is complete */}
                {current?.openingThoughts && current?.conversationId && isAuthenticated && userTokens >= 1 && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-3xl p-12">
                    <form onSubmit={handleInterject} className="space-y-6">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Challenge the council. Add your insight. Shape the synthesis... (costs 1 token)"
                        className="w-full bg-black/50 border border-gray-700 rounded-2xl p-6 text-white min-h-[200px] outline-none focus:border-purple-500 resize-none text-lg"
                        required
                        disabled={sending || !isOnline}
                      />
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="text-gray-400">
                          {message.length > 0 && `Characters: ${message.length}`}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <span className="text-gray-300">
                            This will use <strong>1 token</strong> from your balance
                          </span>
                          <button
                            type="submit"
                            disabled={sending || !message.trim() || userTokens < 1 || !isOnline}
                            className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-xl uppercase tracking-wider transition-all shadow-2xl shadow-purple-900/50"
                          >
                            <Zap size={24} />
                            {sending ? "Sending..." : `Interject (1 Token)`}
                            {!isOnline && " (Offline)"}
                          </button>
                        </div>
                      </div>
                      {!isOnline && (
                        <div className="text-center">
                          <p className="text-red-400 text-sm">
                            ⚠️ You are offline. Please check your internet connection to interject.
                          </p>
                        </div>
                      )}
                      {lastErrorDetails && (
                        <div className="text-center">
                          <details className="text-red-400 text-sm">
                            <summary className="cursor-pointer">Show last error details</summary>
                            <pre className="text-xs bg-red-900/30 p-3 rounded-lg mt-2 overflow-auto max-h-32 whitespace-pre-wrap">
                              {lastErrorDetails}
                            </pre>
                          </details>
                        </div>
                      )}
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
