'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// FIXED: Correct import for the Link component
import Link from 'next/link';
import { Loader2, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await fetch('https://janusforgenexus-backend-1.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to reset password.');

      setStatus('success');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  if (!token) {
    return (
      <div className="text-center p-8 bg-red-900/20 border border-red-800 rounded-2xl">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">Invalid Access Link</h2>
        <p className="text-gray-400 mb-6">This password reset link is missing its security token.</p>
        <Link href="/login" className="text-blue-500 hover:underline">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">New Password</h1>
        <p className="text-gray-400 mt-2">Establish your new credentials for the Nexus.</p>
      </div>

      {status === 'success' ? (
        <div className="text-center animate-in fade-in zoom-in">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-green-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Password Updated</h2>
          <p className="text-gray-400 mb-6">Your access has been restored. Redirecting to login...</p>
          <button 
            onClick={() => router.push('/login')}
            className="flex items-center justify-center gap-2 mx-auto text-blue-400 font-bold hover:text-blue-300"
          >
            Go to Login <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-500" size={18} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-white w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="animate-spin text-blue-500" size={32} />}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
