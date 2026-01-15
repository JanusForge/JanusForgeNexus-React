"use client";
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Send, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ConversationInput({ onSend }: { onSend: (message: string) => void }) {
  // ✅ REPAIR: Removed isAuthenticated from context, using 'user' instead
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  
  // ✅ REPAIR: Derived auth status locally
  const isAuthenticated = !!user;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isAuthenticated) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {!isAuthenticated ? (
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/40 rounded-3xl flex items-center justify-center border border-white/5 animate-in fade-in duration-500">
          <div className="flex items-center gap-4 bg-zinc-900/90 p-4 rounded-2xl border border-white/10 shadow-2xl">
            <Lock className="text-zinc-500" size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Identity required to ignite synthesis
            </p>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase rounded-lg transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isAuthenticated}
          placeholder={isAuthenticated ? "Command the Council..." : "Authentication required"}
          className="w-full bg-zinc-900/50 border border-white/5 rounded-[2rem] py-6 px-8 pr-32 outline-none focus:border-purple-500/50 transition-all text-white placeholder-zinc-600 font-medium"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
           <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">Cost</span>
              <span className="text-[10px] font-mono text-purple-500 font-bold">1 TOKEN</span>
           </div>
           <button
            type="submit"
            disabled={!isAuthenticated || !message.trim()}
            className="p-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:grayscale rounded-2xl transition-all shadow-lg shadow-purple-600/20 group"
          >
            <Zap size={18} className="fill-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
