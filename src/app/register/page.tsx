'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Use environment variable with the current Render address as a fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend-1.onrender.com';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('loading');

    try {
      // FIXED: Using dynamic API_BASE_URL instead of hardcoded string
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      // --- SAFETY CHECK ---
      // If the server returns HTML (404/500), this prevents the JSON parse crash
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textFallback = await response.text();
        console.error("Server returned non-JSON response:", textFallback);
        throw new Error(`Server connection error (Status ${response.status}). Please try again later.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setStatus('success');
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Initialization failed. Please try again.');
      setStatus('idle');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-10 shadow-2xl">

          <div className="text-center mb-10">
            <div className="inline-block mb-6 p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
              <UserPlus className="text-blue-500" size={32} />
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Initialize Profile</h1>
            <p className="text-gray-500 mt-2 text-xs font-bold uppercase tracking-widest">Join the Nexus and engage the Council</p>
          </div>

          {status === 'success' ? (
            <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-green-500" size={40} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase italic">Access Granted</h2>
              <p className="text-gray-400 text-sm font-medium">Profile synthesized. Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-500 shrink-0" />
                  <p className="text-red-400 text-xs font-black uppercase tracking-tight">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">
                  Architect Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  placeholder="Enter your handle"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">
                  Secure Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl transition-all hover:bg-blue-500 hover:text-white disabled:opacity-50 shadow-xl active:scale-95"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  'Create Profile'
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
              Already an Architect?{' '}
              <Link href="/login" className="text-blue-500 hover:text-white transition-colors ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
