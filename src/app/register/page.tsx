'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShieldCheck, UserPlus } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
      // Connects to your live Render backend
      const response = await fetch('https://janusforgenexus-backend-1.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setStatus('success');
      // Brief delay so the user sees the success state before redirecting to login
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <UserPlus className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Initialize Profile</h1>
            <p className="text-gray-400 mt-2">Join the Nexus and engage the Council</p>
          </div>

          {status === 'success' ? (
            <div className="text-center py-8 animate-in fade-in zoom-in">
              <ShieldCheck className="mx-auto text-green-500 mb-4" size={64} />
              <h2 className="text-xl font-bold text-white mb-2">Access Granted</h2>
              <p className="text-gray-400">Welcome email dispatched. Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  Architect Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your handle"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  Secure Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin mx-auto" size={18} />
                ) : (
                  'Create Profile'
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Already an Architect?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
