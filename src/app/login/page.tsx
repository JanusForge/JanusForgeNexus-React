"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo: any email works
    login();
    
    // Redirect based on email
    if (email === 'admin-access@janusforge.ai') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
        
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg text-white"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold"
            >
              Sign In
            </button>

            <div className="text-center text-sm text-gray-400">
              <p>For admin access, use: admin-access@janusforge.ai</p>
              <p>Any email works for user access</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
