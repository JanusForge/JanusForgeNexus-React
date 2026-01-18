"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, User, LogOut, ShieldAlert, Radio, ShieldCheck, Clock, Zap } from 'lucide-react';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface NexusUser {
  id: string;
  username: string;
  email: string;
  role: string;
  access_expiry?: string | Date;
}

export default function Navbar() {
  const { user, logout } = useAuth() as { user: NexusUser | null, logout: () => void };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && (user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE' || user?.role === 'ADMIN');

  // --- ⏳ NEXUS ACCESS LOGIC ---
  const hasAccess = !!(user?.access_expiry && new Date(user.access_expiry) > new Date());

  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });
    socket.on('broadcast:incoming', (data: { message: string }) => {
      setSystemAlert(data.message);
      setTimeout(() => setSystemAlert(null), 15000);
    });
    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {systemAlert && (
        <div className="bg-indigo-600 text-white py-2 px-4 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-500">
          <Radio size={16} className="animate-pulse flex-shrink-0" />
          <span className="text-xs md:text-sm font-black uppercase tracking-widest text-center">
            Nexus Alert: {systemAlert}
          </span>
          <button onClick={() => setSystemAlert(null)} className="hover:rotate-90 transition-transform">
            <X size={16} />
          </button>
        </div>
      )}

      <nav className="bg-black/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-indigo-500/20">
                <ShieldCheck size={22} />
              </div>
              <span className="text-white font-black text-xl italic uppercase tracking-tighter">
                Janus Forge Nexus<sup className="text-[10px] ml-1">®</sup>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors font-black text-[10px] uppercase tracking-[0.2em]">
                Home
              </Link>
              <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 transition-colors font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap size={12} />
                Nexus Access
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors font-black uppercase text-[10px] tracking-widest border border-amber-500/20 px-4 py-1.5 rounded-full bg-amber-500/5"
                >
                  <ShieldAlert size={14} />
                  Nexus Watch
                </Link>
              )}
            </div>

            <div className="flex items-center gap-6">
              {isAuthenticated && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${
                  hasAccess
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.1)]'
                  : 'bg-zinc-900/50 border-white/5 text-zinc-500'
                }`}>
                  <Clock size={14} className={hasAccess ? 'animate-pulse' : ''} />
                  <span className="font-black text-[10px] uppercase tracking-widest">
                    {isAdmin ? 'Eternal Status' : hasAccess ? 'Nexus Active' : 'Observer Mode'}
                  </span>
                </div>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <div className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:border-indigo-500/50 transition-all">
                        <User size={16} />
                    </div>
                  </Link>
                  <button onClick={logout} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest">
                    Login
                  </Link>
                  <Link href="/register" className="px-6 py-2.5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.15em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-indigo-500/10">
                    Join Forge
                  </Link>
                </div>
              )}

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-zinc-400">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-8 border-t border-white/5 animate-in slide-in-from-top-4 duration-300">
              <div className="flex flex-col gap-6 px-4">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-white text-[10px] font-black uppercase tracking-widest">Home</Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Nexus Access</Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={14} /> Nexus Watch
                  </Link>
                )}
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Profile</Link>
                    <button onClick={logout} className="text-left text-red-500 text-[10px] font-black uppercase tracking-widest">Disconnect</button>
                  </>
                ) : (
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-white text-[10px] font-black uppercase tracking-widest">Join Forge</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
