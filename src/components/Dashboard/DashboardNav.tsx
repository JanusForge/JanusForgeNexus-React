"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  FiHome,
  FiCreditCard,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiArrowLeft
} from 'react-icons/fi';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: FiHome },
  { name: 'Billing', href: '/dashboard/billing', icon: FiCreditCard },
  { name: 'Profile', href: '/dashboard/profile', icon: FiUser },
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
  { name: 'Support', href: '/dashboard/support', icon: FiHelpCircle },
];

export default function DashboardNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left side - Logo and desktop nav */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Janus Forge
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* User info and logout (desktop) */}
            {user && (
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-400">{user.tier} Tier</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            <Link
              href="/"
              className="hidden lg:flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/30"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-900/30 text-blue-300'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {user && (
                <>
                  <div className="p-3 border-t border-gray-700 mt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name || user.email?.split('@')[0]}</p>
                        <p className="text-sm text-gray-400">{user.tier} Tier</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              <Link
                href="/"
                className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back to Site</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
