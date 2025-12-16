"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  FiBarChart2,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiActivity,
  FiShield,
  FiHome,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import Link from 'next/link';

const navigationItems = [
  { name: 'Overview', href: '/admin', icon: FiBarChart2 },
  { name: 'Users', href: '/admin/users', icon: FiUsers },
  { name: 'Revenue', href: '/admin/revenue', icon: FiDollarSign },
  { name: 'System', href: '/admin/system', icon: FiActivity },
  { name: 'Features', href: '/admin/features', icon: FiSettings },
  { name: 'Security', href: '/admin/security', icon: FiShield },
  { name: 'Main Site', href: '/dashboard', icon: FiHome },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user && !user.is_admin) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.is_admin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-800 rounded-lg"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 border-r border-gray-700
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200
      `}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            JanusForge Admin
          </h1>
          <p className="text-sm text-gray-400 mt-1">Super Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors mt-8"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Admin Access</p>
          <p className="text-xs text-gray-500">{user?.email || 'admin-access@janusforge.ai'}</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span className="text-xs text-green-400">● Super Admin</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
