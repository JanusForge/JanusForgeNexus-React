"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS } from '@/config/tiers';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout, getRemainingTokens } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [remainingTokens, setRemainingTokens] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user && isClient) {
      setRemainingTokens(getRemainingTokens());
    }
  }, [user, isClient, getRemainingTokens]);

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

  const userTier = user ? TIER_CONFIGS[user.tier] : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">⚔️</span>
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
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/debates" className="text-gray-300 hover:text-white transition-colors">
              Debates
            </Link>
            <Link href="/archive" className="text-gray-300 hover:text-white transition-colors">
              Archives
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>

            {/* Auth Status */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Token Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-sm">
                    {remainingTokens.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-xs">tokens</span>
                  {userTier && user && (
                    <div className={`ml-1 px-2 py-0.5 rounded-full text-xs ${getTierStyle(user.tier)}`}>
                      {userTier.name}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-700">
                      <div className="font-medium text-white">{user?.name || user?.email}</div>
                      <div className="text-sm text-gray-400">
                        {userTier?.name || 'Free'} Tier
                        {user?.isAdmin && ' • Administrator'}
                      </div>
                      <div className="mt-2 text-sm text-green-400 font-medium">
                        {remainingTokens.toLocaleString()} tokens available
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/billing"
                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Billing & Tokens
                      </Link>
                      <Link
                        href="/debates"
                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Debates
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-red-300 hover:text-white hover:bg-red-900/20 rounded transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-700/50 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
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
                href="/"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/debates"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Debates
              </Link>
              <Link
                href="/archive"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Archives
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
                    {/* Token Display */}
                    <div className="p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-400">Token Balance</div>
                        {user && (
                          <div className={`px-2 py-1 rounded-full text-xs ${getTierStyle(user.tier)}`}>
                            {userTier?.name || 'Free'}
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-green-400">
                        {remainingTokens.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Available for debates
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-gray-300 font-medium">{user?.name || user?.email || 'User'}</div>
                        <div className="text-sm text-gray-500">
                          {user?.email === 'admin-access@janusforge.ai' ? 'Administrator' : 'Standard User'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="block text-center px-4 py-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-gray-300 font-medium transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/billing"
                        className="block text-center px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 rounded-lg text-white font-medium transition-all border border-blue-800/30"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Manage Tokens
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-lg text-white font-medium transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center px-4 py-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-gray-300 font-medium transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all"
                    >
                      Sign Up Free
                    </Link>
                    <div className="text-center text-xs text-gray-500 pt-2">
                      Get 50 free tokens to start debating
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Helper function for tier styling
function getTierStyle(tier: string) {
  switch (tier) {
    case 'pro':
      return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    case 'enterprise':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    case 'basic':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'admin':
      return 'bg-red-500/20 text-red-300 border border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
  }
}
