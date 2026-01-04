"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS } from '@/config/tiers';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">JF</span>
              </div>
              <span className="text-white font-bold text-xl">Janus Forge Nexus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>
           {/* <Link href="/archive" className="text-gray-300 hover:text-white transition">
              Archives
            </Link> */}
            <Link href="/pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </Link>

            {isAuthenticated ? (
              <>
                {/* Token Display with Null Safety */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-800/50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">
                    {user ? ((user.tokens_remaining || 0) + (user.purchased_tokens || 0)) : 0}
                  </span>
                  <span className="text-gray-400 text-sm">tokens</span>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <span>{user?.name || user?.email?.split('@')[0]}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-4 border-b border-gray-700">
                      <div className="font-medium text-white">{user?.name || user?.email}</div>
                      <div className="text-sm text-gray-400">
                        {/* Type-safe tier lookup */}
                        {user ? TIER_CONFIGS[user.tier as keyof typeof TIER_CONFIGS]?.name : 'Free'} Tier
                      </div>
                    </div>
                    <div className="p-2">
                      <Link href="/profile" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded">
                        Profile Settings
                      </Link>
                      <Link href="/billing" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded">
                        Billing & Tokens
                      </Link>
                      {user?.isAdmin && (
                        <Link href="/admin" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800/50">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-300 hover:text-white">
                Home
              </Link>
              <Link href="/archive" className="text-gray-300 hover:text-white">
                Archives
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white">
                Pricing
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 bg-gray-800/50 rounded-lg">
                    <div className="text-white font-medium">Token Balance</div>
                    <div className="text-2xl font-bold text-green-400">
                      {user ? ((user.tokens_remaining || 0) + (user.purchased_tokens || 0)) : 0}
                    </div>
                  </div>

                  <Link href="/profile" className="text-gray-300 hover:text-white">
                    Profile
                  </Link>
                  <Link href="/billing" className="text-gray-300 hover:text-white">
                    Billing
                  </Link>
                  {user?.isAdmin && (
                    <Link href="/admin" className="text-gray-300 hover:text-white">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-left text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-center font-medium"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
