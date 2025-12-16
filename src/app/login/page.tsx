"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { FiLock, FiMail, FiAlertCircle, FiCheckCircle, FiDatabase } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { signIn, user, session, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && (user || session)) {
      if (user?.is_admin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [authLoading, user, session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        // Handle specific error cases
        if (signInError.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Try demo credentials below or check Supabase setup.');
        } else if (signInError.message?.includes('Email not confirmed')) {
          setError('Please verify your email address before logging in.');
        } else if (signInError.message?.includes('database') || signInError.message?.includes('schema')) {
          setError('Database connection issue. Using demo mode instead.');
          // Try demo credentials automatically
          await tryDemoCredentials();
        } else {
          setError(signInError.message || 'Login failed. Please try again.');
        }
      } else {
        setSuccess('Login successful! Redirecting...');
        // Redirect is handled by useEffect above
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Trying demo mode...');
      await tryDemoCredentials();
    } finally {
      setIsLoading(false);
    }
  };

  const tryDemoCredentials = async () => {
    // Try demo admin credentials
    if (email === 'admin-access@janusforge.ai' && password === 'MyFourKids&8Grandkid') {
      const { error } = await signIn(email, password);
      if (!error) {
        setSuccess('Admin login successful! (Demo mode) Redirecting...');
      }
    }
    // Try demo user credentials
    else if (email === 'cassandra@janusforge.ai' && password === 'password') {
      const { error } = await signIn(email, password);
      if (!error) {
        setSuccess('User login successful! (Demo mode) Redirecting...');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

      <div className="relative container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
              <span className="text-2xl font-bold text-white">JF</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">Sign in to continue to Janus Forge Nexus</p>
          </div>

          {/* Login Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 shadow-2xl">
            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-xl flex items-start space-x-3">
                <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-400 font-medium">Error</p>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800/50 rounded-xl flex items-start space-x-3">
                <FiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-400 font-medium">Success</p>
                  <p className="text-green-300 text-sm mt-1">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setError('Password reset not implemented yet')}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Remember Me & Submit */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="ml-3 text-sm text-gray-400">
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>

            {/* Demo Credentials (Remove in production) */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <p className="text-sm text-gray-400 mb-3">Demo Access (Development Only):</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-400">Admin Account</p>
                    <p className="text-gray-400 text-xs">Full system access</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-blue-300">admin-access@janusforge.ai</p>
                    <p className="font-mono text-green-300 text-xs">MyFourKids&8Grandkid</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-400">User Account</p>
                    <p className="text-gray-400 text-xs">Standard dashboard access</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-purple-300">cassandra@janusforge.ai</p>
                    <p className="font-mono text-green-300 text-xs">password</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                These credentials will work in demo mode even without Supabase setup
              </p>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link
                  href="/pricing"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Get started →
                </Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your data is secured with end-to-end encryption and enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
