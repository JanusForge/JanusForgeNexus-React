"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/debates';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  // Demo credentials
  const demoCredentials = [
    { email: 'free@example.com', password: 'demo123', label: 'Free Tier' },
    { email: 'basic@example.com', password: 'demo123', label: 'Basic Tier' },
    { email: 'pro@example.com', password: 'demo123', label: 'Pro Tier' },
    { email: 'admin-access@janusforge.ai', password: 'admin123', label: 'Admin Access' },
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">JF</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Welcome back</h1>
          <p className="text-gray-400 mt-2">Sign in to your JanusForge account</p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-800/50">
          <h3 className="font-bold text-white mb-2">Demo Access</h3>
          <p className="text-gray-400 text-sm mb-3">Try out different user tiers:</p>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(cred.email, cred.password)}
                className="w-full text-left p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg text-sm"
              >
                <div className="font-medium text-white">{cred.label}</div>
                <div className="text-gray-400 text-xs mt-1">{cred.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                required
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
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center text-sm">
              <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-800/50">
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Token Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            New users get 50 free tokens to start debating
          </p>
        </div>
      </div>
    </div>
  );
}
