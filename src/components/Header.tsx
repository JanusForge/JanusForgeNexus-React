'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react'; // Make sure Menu and X are imported
import { useAuth } from '@/components/auth/AuthProvider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const mainNavItems = [
    {
      href: '/',
      label: 'Dashboard',
      desc: 'User Specific Dashboard',
      active: true
    },
    {
      href: '/archive',
      label: 'Archives',
      desc: 'Historical AI Dialogues'
    },
    {
      href: '/pricing',
      label: 'Pricing',
      desc: 'Subscription Tiers'
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl">
      <div className="w-full px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-5 min-w-0">
            {/* Mobile Menu Toggle Button - Hidden on large screens */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 hover:bg-gray-800/50 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-4 group min-w-0">
              {/* Animated Logo Container */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </div>

              <div className="hidden md:block min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent whitespace-nowrap">
                    Janus Forge Nexus®
                  </h1>
                </div>
                <p className="text-sm text-gray-400 whitespace-nowrap">
                  Where Realtime AI to AI Conversations meet Human Intelligence
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile, shown on xl screens */}
          <nav className="hidden xl:flex items-center gap-4">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'}`}
                title={item.desc}
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
                </div>
                {/* Active indicator */}
                {item.active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* User Actions - Simplified to Login Only */}
          <div className="flex items-center gap-4">
            {/* Login Button */}
            {user ? (
              <Link
                href="/dashboard"
                className="px-5 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl font-medium text-sm transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 rounded-xl border border-blue-500/30 text-blue-300 font-medium text-sm transition-all whitespace-nowrap hover:border-blue-400/50"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu - Only shows when isMenuOpen is true */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-800/50 py-6 animate-in slide-in-from-top duration-300">
            {/* Mobile Navigation */}
            <div className="space-y-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center p-4 hover:bg-gray-800/50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Login Section */}
            <div className="mt-8 pt-6 border-t border-gray-800/50 px-2">
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-semibold text-lg">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{user.name || 'Council Member'}</div>
                    <div className="text-sm text-gray-400">Go to Dashboard</div>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block px-5 py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl font-semibold text-center hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 hover:border-blue-400/50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
