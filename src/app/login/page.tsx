'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ REPAIR: Use 'updateUserData' and 'user' instead of 'login' and 'isAuthenticated'
  const { user, updateUserData, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for verification success redirect
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('Email verified successfully! You can now sign in.');
      window.history.replaceState({}, '', '/login');
    }
  }, [searchParams]);

  // Auth Redirect logic
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      // ✅ SUCCESS: Initialize session via updateUserData
      updateUserData(data.user);

      // Redirect logic handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Initialize Session</h1>
            <p className="text-gray-400 mt-2 text-xs font-bold uppercase tracking-widest">Architect Authentication Required</p>
          </div>

          {successMessage && (
            <div className="p-4 mb-6 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-xs font-bold uppercase tracking-tight text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <p className="text-red-400 text-xs font-black uppercase">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest ml-1">
                Identity Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  Security Key
                </label>
                <Link href="/forgot-password" size={10} className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400">
                  Recovery
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black uppercase text-xs tracking-[0.3em] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/10"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Enter Nexus'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
              No Identity?{' '}
              <Link href="/register" className="text-blue-500 hover:text-white transition-colors ml-1">
                Register Architect
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
