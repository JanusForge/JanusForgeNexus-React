"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Admin dashboard needs to be dynamic as it shows live data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mock data for demonstration
const mockUsers = [
  { id: 1, email: 'user1@example.com', tier: 'pro', tokens_remaining: 750, tokens_used: 250, createdAt: '2024-01-15' },
  { id: 2, email: 'user2@example.com', tier: 'basic', tokens_remaining: 125, tokens_used: 125, createdAt: '2024-01-20' },
  { id: 3, email: 'user3@example.com', tier: 'free', tokens_remaining: 30, tokens_used: 20, createdAt: '2024-02-01' },
  { id: 4, email: 'user4@example.com', tier: 'enterprise', tokens_remaining: 3500, tokens_used: 1500, createdAt: '2024-02-05' },
  { id: 5, email: 'user5@example.com', tier: 'pro', tokens_remaining: 500, tokens_used: 500, createdAt: '2024-02-10' },
];

const mockTokenPurchases = [
  { id: 1, userEmail: 'user1@example.com', package: 'token-1000', amount: 29.99, date: '2024-02-15' },
  { id: 2, userEmail: 'user4@example.com', package: 'token-5000', amount: 129.99, date: '2024-02-14' },
  { id: 3, userEmail: 'user2@example.com', package: 'token-250', amount: 9.99, date: '2024-02-12' },
  { id: 4, userEmail: 'user5@example.com', package: 'token-1000', amount: 29.99, date: '2024-02-10' },
];

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  // Calculate stats
  const totalUsers = mockUsers.length;
  const totalRevenue = mockTokenPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const activeUsers = mockUsers.filter(u => u.tokens_used > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name || 'Admin'}</p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{totalUsers}</p>
            <p className="text-gray-400 text-sm">Registered users</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Active Users</h3>
            <p className="text-3xl font-bold">{activeUsers}</p>
            <p className="text-gray-400 text-sm">Used tokens this month</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
            <p className="text-gray-400 text-sm">Lifetime revenue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Tier</th>
                    <th className="p-4 text-left">Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          user.tier === 'enterprise' ? 'bg-purple-900/30 text-purple-400' :
                          user.tier === 'pro' ? 'bg-blue-900/30 text-blue-400' :
                          user.tier === 'basic' ? 'bg-green-900/30 text-green-400' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {user.tier}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span>{user.tokens_remaining}</span>
                          <span className="text-gray-500">/</span>
                          <span>{user.tokens_remaining + user.tokens_used}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Token Purchases */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Recent Purchases</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left">Package</th>
                    <th className="p-4 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTokenPurchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                      <td className="p-4">{purchase.userEmail}</td>
                      <td className="p-4">{purchase.package}</td>
                      <td className="p-4">${purchase.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-gray-800/30 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span>Backend API</span>
              <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span>Database</span>
              <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span>AI Services</span>
              <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">4/5 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
