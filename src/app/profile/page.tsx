"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { ShieldCheck, Clock, Calendar, Zap, AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// 🛡️ Explicitly define the SovereignUser interface for strict type safety
interface SovereignUser {
  id: string;
  username: string;
  email: string;
  role: string;
  access_expiry?: string | Date;
  tokens_remaining?: number;
}

export default function ProfilePage() {
  // ✅ Cast the auth hook to our specific SovereignUser type
  const { user, loading } = useAuth() as { user: SovereignUser | null, loading: boolean };
  const [timeLeft, setTimeLeft] = useState<string>("");

  // --- ⏳ REAL-TIME COUNTDOWN LOGIC ---
  useEffect(() => {
    // Primary guard to prevent effect execution without data
    if (!user?.access_expiry) return;

    const calculateTime = () => {
      // Secondary guard inside scope to satisfy TypeScript's strict null check
      if (!user || !user.access_expiry) return;

      const expiry = new Date(user.access_expiry).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days > 0 ? `${days}d ` : ""}${hours}h ${mins}m`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); 
    return () => clearInterval(timer);
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white italic uppercase tracking-widest text-xs">
      Synchronizing Neural Profile...
    </div>
  );

  // Logic to determine if sovereignty is active
  const isActive = !!(user?.access_expiry && new Date(user.access_expiry) > new Date());

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* HEADER SECTION */}
        <div className="flex items-end gap-6 mb-12">
          <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
            <ShieldCheck size={48} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              {user?.username || 'Architect'}
            </h1>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
              ID: {user?.id?.slice(-8)} • {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* ⚡ STATUS CARD */}
          <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${
            isActive 
            ? 'bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_50px_rgba(79,70,229,0.1)]' 
            : 'bg-zinc-950 border-white/5 opacity-60'
          }`}>
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-white/5 rounded-xl text-indigo-400">
                <Clock size={20} />
              </div>
              <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {isActive ? 'Sovereign Active' : 'Spectator'}
              </div>
            </div>
            
            <div className="mb-2 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Temporal Command Remaining</div>
            <div className="text-5xl font-black italic tracking-tighter mb-4 text-white">
              {isActive ? timeLeft : "0h 0m"}
            </div>
            
            <p className={`text-xs font-medium italic ${isActive ? 'text-indigo-400/60' : 'text-zinc-600'}`}>
              {isActive 
                ? "Full command of the Janus Forge Council is currently enabled." 
                : "Access expired. Reactivate via the Sovereignty Portal to command."}
            </p>
          </div>

          {/* 📜 ACCOUNT DETAILS */}
          <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">Nexus Statistics</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-zinc-600" />
                  <span className="text-sm font-bold text-zinc-400 uppercase italic">Expiry Date</span>
                </div>
                <span className="text-sm font-black text-zinc-100">
                  {user?.access_expiry ? new Date(user.access_expiry).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-zinc-600" />
                  <span className="text-sm font-bold text-zinc-400 uppercase italic">Authority Tier</span>
                </div>
                <span className="text-sm font-black text-indigo-400 uppercase italic">
                  {user?.role || 'User'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => window.location.href = '/pricing'}
              className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
            >
              Extend Sovereignty
            </button>
          </div>
        </div>

        {/* 🚨 SYSTEM NOTE */}
        {!isActive && (
          <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-4 animate-pulse">
            <AlertCircle className="text-amber-500" size={20} />
            <p className="text-amber-200/60 text-xs font-medium leading-relaxed italic">
              Your account is currently in <span className="text-amber-500 font-black">SPECTATOR MODE</span>. 
              You can view the AI's output but cannot initiate new neural forging sessions until a pass is acquired.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
