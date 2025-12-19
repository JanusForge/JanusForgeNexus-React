"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBarChart2, FiUsers, FiSettings, FiHelpCircle, FiArrowLeft, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '@/components/auth/AuthProvider';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: FiHome },
  { name: 'Analytics', href: '/dashboard/analytics', icon: FiBarChart2 },
  { name: 'Users', href: '/dashboard/users', icon: FiUsers },
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
  { name: 'Support', href: '/dashboard/support', icon: FiHelpCircle },
];

export default function DashboardNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-gray-300"
      >
        {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">JF</span>
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Janus Forge
                </span>
                <span className="text-xs text-gray-400 block">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
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
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
