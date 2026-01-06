"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, Zap, User, LogOut, Coins } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">JF</span>
            </div>
            <span className="text-white font-black text-xl hidden sm:block">Janus Forge Nexus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/daily-forge" className="text-gray-300 hover:text-white transition-colors font-medium">
              Daily Forge
            </Link>
            {isAuthenticated && user?.role === 'GOD_MODE' && (
              <Link href="/admin" className="text-gray-300 hover:text-white transition-colors font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side - Auth & Tokens */}
          <div className="flex items-center gap-6">
            {/* Token Balance */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                <Coins size={18} className="text-purple-400" />
                <span className="text-white font-medium">
                  {(user?.tokens_remaining || 0).toLocaleString()}
                </span>
                <span className="text-gray-400 text-sm">tokens</span>
              </div>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <User size={20} />
                  <span className="hidden sm:inline">{user?.username || 'Profile'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium px-4">
                Home
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors font-medium px-4">
                Pricing
              </Link>
              <Link href="/daily-forge" className="text-gray-300 hover:text-white transition-colors font-medium px-4">
                Daily Forge
              </Link>
              {isAuthenticated && user?.role === 'GOD_MODE' && (
                <Link href="/admin" className="text-gray-300 hover:text-white transition-colors font-medium px-4">
                  Admin
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Link href="/profile" className="text-gray-300 hover:text-white transition-colors font-medium px-4">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left text-gray-300 hover:text-red-400 transition-colors font-medium px-4"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
