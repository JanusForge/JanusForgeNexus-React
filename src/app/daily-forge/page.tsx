// src/app/daily-forge/page.tsx
"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Calendar, Clock, Zap, Wifi, Trophy, MessageSquare, Loader2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function DailyForgePage() {
  const { user, isAuthenticated } = useAuth();
  const [current, setCurrent] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const DEBATE_COST = 3;
  const isOwner = user?.email === 'admin@janusforge.ai';
  const hasAccess = isOwner || (user?.tokens_remaining && user.tokens_remaining >= DEBATE_COST);

  useEffect(() => {
    fetchCurrentForge();
    socketRef.current = io(API_BASE_URL, { withCredentials: true });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  useEffect(() => {
    if (current?.conversationId && socketRef.current) {
      socketRef.current.emit('join', { conversationId: current.conversationId });

      socketRef.current.on('post:incoming', (msg: any) => {
        if (msg.conversationId === current.conversationId) {
          setAllPosts(prev => [msg, ...prev]);
        }
      });
    }
    return () => { socketRef.current?.off('post:incoming'); };
  }, [current?.conversationId]);

  const fetchCurrentForge = async () => {
    const res = await fetch(`${API_BASE_URL}/api/daily-forge/current`);
    if (res.ok) {
      const data = await res.json();
      setCurrent(data);
      if (data.conversationId) {
        const postsRes = await fetch(`${API_BASE_URL}/api/conversations/${data.conversationId}`);
        if (postsRes.ok) {
          const pData = await postsRes.json();
          setAllPosts(pData.conversation.posts.reverse());
        }
      }
    }
  };

  const handleInterject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !current?.conversationId || !hasAccess) return;
    setSending(true);

    try {
      await fetch(`${API_BASE_URL}/api/conversations/${current.conversationId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          userId: user.id,
          conversationId: current.conversationId
        })
      });
      setMessage('');
    } catch (err) { console.error(err); } finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-black text-center mb-12 uppercase italic">The Daily Forge</h1>

        {current && (
          <>
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-3xl p-8 mb-12 text-center">
              <Trophy className="mx-auto mb-4 text-yellow-500" size={48} />
              <h2 className="text-3xl font-bold mb-4">{current.winningTopic}</h2>
              <div className="flex justify-center gap-6 text-gray-400 text-sm">
                <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(current.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-2 text-indigo-400 uppercase font-black animate-pulse"><Zap size={14}/> 2026 Models Active</span>
              </div>
            </div>

            <div className="space-y-6 mb-24">
              {allPosts.map((msg: any) => (
                <div key={msg.id} className={`p-6 rounded-2xl border ${msg.sender === 'ai' ? 'bg-gray-900/40 border-gray-800' : 'bg-blue-900/20 border-blue-500/30'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[8px]">{msg.name?.[0]}</div>
                    <span className="text-xs font-black uppercase text-purple-400">{msg.name}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            <div className="sticky bottom-8 bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Adversarial interjection</span>
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Cost: 3 Tokens</span>
              </div>
              <form onSubmit={handleInterject} className="flex gap-4">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isOwner ? "Owner Mode: Synthesis Enabled" : "Interject into the council (3 Tokens)..."}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-purple-500"
                />
                <button
                  disabled={sending || !message.trim() || !hasAccess}
                  className="px-8 py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 disabled:opacity-50 transition-all"
                >
                  {sending ? <Loader2 className="animate-spin" size={20}/> : 'Interject'}
                </button>
              </form>
              {!hasAccess && !isOwner && <p className="text-center text-[9px] text-red-400 mt-2 uppercase font-black">Insufficient balance for 2026 Frontier Synthesis</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
