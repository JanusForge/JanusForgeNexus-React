"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    const savedEmail = localStorage.getItem('janusforge_user_email');
    if (savedEmail === 'admin-access@janusforge.ai') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // For demo: any email/password works
    login(email);

    // Redirect based on email
    if (email === 'admin-access@janusforge.ai') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 mb-4 shadow-lg">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to your Janus Forge Nexus account</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded bg-gray-800/50 border-gray-700" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Sign In
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <a href="/waitlist" className="text-blue-400 hover:text-blue-300">
                  Join waitlist
                </a>
              </p>
            </div>

            {/* Demo Info */}
            <div className="mt-8 pt-6 border-t border-gray-800/50">
              <div className="text-center text-sm">
                <p className="text-gray-400 mb-2">For demo purposes:</p>
                <div className="space-y-1">
                  <p className="text-amber-300">Admin: <code className="bg-gray-800 px-2 py-1 rounded">admin-access@janusforge.ai</code></p>
                  <p className="text-green-300">User: Any email works</p>
                  <p className="text-gray-500 text-xs mt-2">Password: Any value accepted</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <a href="/" className="text-gray-400 hover:text-gray-300 text-sm inline-flex items-center gap-2">
            <span>←</span>
            <span>Return to homepage</span>
          </a>
        </div>
      </div>
    </div>
  );
}
