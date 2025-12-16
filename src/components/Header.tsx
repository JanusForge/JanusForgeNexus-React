"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  // Function to determine dashboard route based on email
  const getDashboardRoute = () => {
    if (!user?.email) return '/dashboard';
    return user.email === 'admin-access@janusforge.ai' ? '/admin' : '/dashboard';
  };

  // Function to determine user role
  const getUserRole = () => {
    if (!user?.email) return 'User';
    return user.email === 'admin-access@janusforge.ai' ? 'Administrator' : 'User';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">JF</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Janus Forge
              </span>
              <span className="text-xs text-gray-400 block">Nexus</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
              Documentation
            </Link>

            {!loading && user ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span>{user.name || user.email?.split('@')[0]}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Click-based Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                        {getUserRole()}
                      </div>
                      <Link
                        href={getDashboardRoute()}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !loading ? (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            ) : (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
                Documentation
              </Link>

              {!loading && user ? (
                <>
                  <div className="text-sm text-gray-400 px-2">
                    {getUserRole()}
                  </div>
                  <Link
                    href={getDashboardRoute()}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-400 hover:text-red-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : !loading ? (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold text-center"
                >
                  Login
                </Link>
              ) : (
                <div className="text-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
