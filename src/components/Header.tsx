"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Don't render auth-dependent UI until client-side
  if (!isClient || isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-800 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
            {/* Login button skeleton */}
            <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">⚡</span>
            </div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Janus Forge Nexus®
              </div>
              <div className="text-xs text-gray-400">AI Council Debates</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/archive" className="text-gray-300 hover:text-white transition-colors">
              Archives
            </Link>
            <Link href="/architecture" className="text-gray-300 hover:text-white transition-colors">
              Architecture
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            
            {/* Auth Status */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-300">{user?.email?.split('@')[0] || 'User'}</div>
                    <div className="text-xs text-gray-500">
                      {user?.email === 'admin-access@janusforge.ai' ? 'Admin' : 'User'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-lg text-white text-sm font-medium transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800/50">
            <div className="space-y-4">
              <Link 
                href="/dashboard" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/archive" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Archives
              </Link>
              <Link 
                href="/architecture" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Architecture
              </Link>
              <Link 
                href="/pricing" 
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              
              {/* Mobile Auth Status */}
              <div className="pt-4 border-t border-gray-800/50">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-gray-300 font-medium">{user?.email || 'User'}</div>
                        <div className="text-sm text-gray-500">
                          {user?.email === 'admin-access@janusforge.ai' ? 'Administrator' : 'Standard User'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-lg text-white font-medium transition-all"
                    >
                      Logout & Return Home
                    </button>
                    <Link
                      href="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center px-4 py-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-gray-300 font-medium transition-all"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
