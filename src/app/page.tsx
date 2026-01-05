"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Loader2, Globe, ShieldCheck, ChevronRight, Share2, Radio, Info, Coins, Menu, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import ShareDropdown from '@/components/ShareDropdown';
import ConversationSidebar from '@/app/components/ConversationSidebar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface ConversationMessage {
  id: string;
  sender: 'ai' | 'user';
  name: string;
  content: string;
  timestamp: string;
  tokens_remaining?: number;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const socketRef = useRef<Socket | null>(null);
  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // New Conversation loading state
  const [creatingNew, setCreatingNew] = useState(false);

  // BETA Architect redirect
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref === 'BETA_2026') {
      router.push('/register');
    }
  }, [searchParams, router]);

  // --- 🚀 FIRST TIME VISITOR STATE ---
  useEffect(() => {
    const hasSeenBriefing = localStorage.getItem('janus_briefing_seen');
    if (isAuthenticated && !hasSeenBriefing) {
      setShowBriefing(true);
    }
  }, [isAuthenticated]);

  const closeBriefing = () => {
    localStorage.setItem('janus_briefing_seen', 'true');
    setShowBriefing(false);
  };

  // --- 🔌 SOCKET.IO CONNECTION ---
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
    });
    socketRef.current.on('connect', () => console.log('🏛️ Council Connection Verified'));
    socketRef.current.on('post:incoming', (msg: ConversationMessage) => {
      setConversation(prev => [msg, ...prev]);
      if (msg.tokens_remaining !== undefined) {
        setTokensRemaining(msg.tokens_remaining);
      }
      setIsSending(false);
    });
    socketRef.current.on('error', (err: any) => {
      console.error("Socket Error:", err);
      setIsSending(false);
    });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  useEffect(() => {
    if (user) setTokensRemaining((user as any).tokens_remaining || 0);
  }, [user]);

  const handleSendMessage = () => {
    if (!userMessage.trim() || isSending) return;
    setIsSending(true);
    socketRef.current?.emit('post:new', {
      content: userMessage,
      userId: user?.id,
      name: (user as any)?.username || 'User',
      isLiveChat: true
    });
    setUserMessage('');
  };

  // === START NEW CONVERSATION ===
  const handleNewConversation = async () => {
  if (!user) {
    alert("Please log in to start a conversation");
    return;
  }

  setCreatingNew(true);

  try {
    const createRes = await fetch(`${API_BASE_URL}/api/conversations`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: "New Live Conversation",
        userId: user.id  // ← THIS IS THE KEY FIX
      })
    });

    if (createRes.ok) {
      const newConv = await createRes.json();
      const newId = newConv.conversation.id;

      setCurrentConversationId(newId);
      setConversation([]);
      setUserMessage('');

      alert("New conversation started! The council awaits your first move.");
    } else {
      const errorData = await createRes.json().catch(() => ({}));
      alert("Failed: " + (errorData.message || "Try again"));
    }
  } catch (err) {
    console.error("New conversation error:", err);
    alert("Connection issue — please refresh and try again");
  } finally {
    setCreatingNew(false);
  }
};  



  // === AUTO-LOAD / CREATE LIVE NEXUS CHAT ON LOGIN ===
  useEffect(() => {
    if (!user || currentConversationId) return;
    const ensureLiveChat = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/conversations/user?userId=${user.id}`, {
          credentials: 'include'
        });
        if (!res.ok) return;
        const data = await res.json();
        const liveChat = data.find((c: any) => c.title === "Live Nexus Chat");
        if (liveChat) {
          setCurrentConversationId(liveChat.id);
          handleSelectConversation(liveChat.id);
        } else {
          const createRes = await fetch(`${API_BASE_URL}/api/conversations`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: "Live Nexus Chat" })
          });
          if (createRes.ok) {
            const newConv = await createRes.json();
            setCurrentConversationId(newConv.conversation.id);
            setConversation([]);
          }
        }
      } catch (err) {
        console.error("Failed to ensure Live Nexus Chat:", err);
      }
    };
    ensureLiveChat();
  }, [user, currentConversationId]);

  // === LOAD FULL HISTORY WHEN SELECTING FROM SIDEBAR ===
  const handleSelectConversation = async (convId: string) => {
    setCurrentConversationId(convId);
    setConversation([]);
    try {
      const res = await fetch(`${API_BASE_URL}/api/conversations/${convId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        const formattedPosts = data.conversation.posts.map((p: any) => ({
          id: p.id,
          name: p.is_human ? (user?.username || 'Architect') : (p.ai_model || 'Council'),
          content: p.content,
          sender: p.is_human ? 'user' : 'ai' as 'user' | 'ai',
          timestamp: p.created_at,
          tokens_remaining: undefined
        }));
        setConversation(formattedPosts.reverse());
      }
    } catch (err) {
      console.error("Failed to load conversation history:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex relative">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        onSelectConversation={handleSelectConversation}
        currentConversationId={currentConversationId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Mobile Sidebar Toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden p-3 bg-gray-900/80 backdrop-blur rounded-xl border border-gray-800 shadow-xl"
        >
          <Menu size={24} className="text-blue-400" />
        </button>
      )}

      {/* Main Page Content */}
      <div className="flex-1 overflow-auto">
        {showBriefing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="max-w-xl bg-gray-900 border border-blue-500/30 rounded-[3rem] p-12 shadow-3xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <ShieldCheck className="text-blue-400" size={40} />
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">Architect Briefing</h2>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Protocol: Synthesis Induction</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-3 text-yellow-500">
                    <Zap size={18} />
                    <span className="font-black uppercase text-xs tracking-widest">Initial Fuel</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Your account is pre-loaded with <span className="text-white font-bold">50 Neural Tokens</span>. Each query consumes 1 token.
                  </p>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-3 text-blue-400">
                    <Coins size={18} />
                    <span className="font-black uppercase text-xs tracking-widest">Expansion</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">Spark Packs available in the Pricing sector.</p>
                </div>
              </div>
              <button onClick={closeBriefing} className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-blue-900/40">
                Initialize Connection
              </button>
            </div>
          </div>
        )}

        <div className="relative pt-12 pb-12 text-center border-b border-white/5">
          <div className="flex justify-center mb-6">
            <video autoPlay muted loop playsInline className="w-80 h-80 md:w-96 md:h-96 object-contain">
              <source src="/janus-logo-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="max-w-7xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 animate-pulse uppercase tracking-[0.2em]">
              <Globe size={10} /> Live Nexus Active
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent uppercase">
              Janus Forge <span className="text-blue-500">Nexus®</span>
            </h1>
          </div>
        </div>

        {/* Centered Live Chat Showdown - Full Width Focus */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <div className="flex flex-col relative group">
                <h2 className="font-black flex items-center gap-3 text-2xl md:text-3xl tracking-widest text-white uppercase cursor-pointer">
                  <Radio className="text-red-500 animate-pulse" size={24} />
                  Live Multi-AI Realtime Chat Showdown
                  <div className="p-2 bg-white/5 rounded-full">
                    <Info size={18} className="text-blue-400" />
                  </div>
                </h2>
                <span className="text-sm md:text-base text-gray-400 font-bold uppercase ml-8 tracking-widest mt-1">Real-time Multiversal Debate</span>
              </div>
              <div className="flex items-center gap-3">
                {/* New Conversation Button with Visual Feedback */}
                {isAuthenticated && (
                  <button
                    onClick={handleNewConversation}
                    disabled={creatingNew}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-70 rounded-lg flex items-center gap-2 font-bold text-sm"
                  >
                    {creatingNew ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={18} />
                        New Conversation
                      </>
                    )}
                  </button>
                )}
                <button onClick={() => setIsShareOpen(!isShareOpen)} className={`p-2 rounded-lg hover:bg-gray-800 ${isShareOpen ? 'bg-gray-800' : ''}`}>
                  <Share2 size={20} className="text-gray-400" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                  <Zap size={14} className="text-purple-400 fill-purple-400" />
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-tighter">
                    {tokensRemaining} TOKENS
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row border-b border-gray-800">
              <div className={`p-6 space-y-4 ${isShareOpen ? 'md:w-2/3 w-full' : 'w-full'}`}>
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={!isAuthenticated || tokensRemaining <= 0}
                  placeholder="Welcome! Please log in or sign up to share your question with the Council."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white min-h-[150px] outline-none focus:border-blue-500 transition-all resize-none font-medium placeholder:italic"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isSending}
                  className="w-full py-4 bg-blue-600 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'Execute Synthesis'}
                </button>
              </div>
              {isShareOpen && (
                <div className="md:w-1/3 w-full p-4 border-l border-gray-800 bg-black/20">
                  <ShareDropdown
                    conversationText={conversation.map(m => `[${m.name}]: ${m.content}`).join('\n\n')}
                    username={(user as any)?.username || 'User'}
                    setIsOpen={setIsShareOpen}
                  />
                </div>
              )}
            </div>

            <div className="divide-y divide-gray-800 max-h-[700px] overflow-y-auto">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-6 transition-all ${msg.name === 'Architect' ? 'bg-blue-900/10 border-l-4 border-blue-500' : ''}`}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 font-bold text-xs uppercase shadow-inner">
                      {msg.name[0]}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{msg.name}</span>
                        {['GEMINI', 'DEEPSEEK', 'GROK', 'CLAUDE', 'GPT_4'].includes(msg.name) && (
                          <span className="text-[8px] bg-red-500 px-2 py-0.5 rounded font-black text-white uppercase">Council Response</span>
                        )}
                        {msg.name === 'Architect' && (
                          <span className="text-[8px] bg-blue-500 px-2 py-0.5 rounded font-black text-white uppercase">Primary Intel</span>
                        )}
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
