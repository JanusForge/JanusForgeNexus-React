"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, Zap, User, LogOut, Coins, ShieldAlert, Radio } from 'lucide-react';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Protocol 0: Check for owner email or God Mode role
  const isAdmin = isAuthenticated && (user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE');

  // Listen for Global Broadcasts
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
      {/* 📡 GLOBAL BROADCAST BANNER */}
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

      <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                <span className="text-white font-black text-xl">JF</span>
              </div>
              {/* ✅ FIXED: Corrected JSX syntax for legal name */}
              <span className="text-white font-black text-xl hidden sm:block italic uppercase tracking-tighter">
                Janus Forge Nexus ®
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium text-xs uppercase tracking-widest">
                Home
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors font-medium text-xs uppercase tracking-widest">
                Pricing
              </Link>
              <Link href="/daily-forge" className="text-gray-300 hover:text-white transition-colors font-medium text-xs uppercase tracking-widest">
                Daily Forge
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors font-bold uppercase text-[10px] tracking-widest border border-amber-500/20 px-3 py-1 rounded-md bg-amber-500/5"
                >
                  <ShieldAlert size={14} />
                  Nexus Watch
                </Link>
              )}
            </div>

            {/* Right Side - Auth & Tokens */}
            <div className="flex items-center gap-6">
              {isAuthenticated && (
                <div className="flex items-center gap-3 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                  <Coins size={16} className="text-purple-400" />
                  <span className="text-white font-mono font-bold text-sm">
                    {user?.email === 'admin@janusforge.ai' ? '∞' : (user?.tokens_remaining || 0).toLocaleString()}
                  </span>
                </div>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                        <User size={16} />
                    </div>
                    <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">{(user as any)?.username || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
                  >
                    Join Forge
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-gray-800 animate-in fade-in slide-in-from-top-4">
              <div className="flex flex-col gap-5 px-4">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-xs font-black uppercase tracking-widest">Home</Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-xs font-black uppercase tracking-widest">Pricing</Link>
                <Link href="/daily-forge" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-xs font-black uppercase tracking-widest">Daily Forge</Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-amber-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={14} /> Nexus Watch
                  </Link>
                )}
                {isAuthenticated && (
                  <>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-xs font-black uppercase tracking-widest">Profile</Link>
                    <button onClick={logout} className="text-left text-red-500 text-xs font-black uppercase tracking-widest">Logout</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
