"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TIER_CONFIGS, TOKEN_PACKAGES } from '@/config/tiers';

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
  const averageTokensUsed = mockUsers.reduce((sum, user) => sum + user.tokens_used, 0) / totalUsers;

  const tierDistribution = mockUsers.reduce((acc, user) => {
    acc[user.tier] = (acc[user.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">
                Manage users, monitor revenue, and configure system settings
              </p>
            </div>
            <div className="px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-sm">
              Administrator Mode
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-white">{totalUsers}</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green-400">${totalRevenue.toFixed(2)}</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">Avg Tokens Used</div>
            <div className="text-3xl font-bold text-blue-400">{averageTokensUsed.toFixed(0)}</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">Active Today</div>
            <div className="text-3xl font-bold text-purple-400">{Math.floor(totalUsers * 0.3)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">User Management</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm">
                Add User
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="text-left py-3 px-2 text-gray-400 text-sm">User</th>
                    <th className="text-left py-3 px-2 text-gray-400 text-sm">Tier</th>
                    <th className="text-left py-3 px-2 text-gray-400 text-sm">Tokens</th>
                    <th className="text-left py-3 px-2 text-gray-400 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800/30">
                      <td className="py-3 px-2">
                        <div className="font-medium">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.createdAt}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.tier === 'pro' ? 'bg-purple-500/20 text-purple-300' :
                          user.tier === 'enterprise' ? 'bg-amber-500/20 text-amber-300' :
                          user.tier === 'basic' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {TIER_CONFIGS[user.tier as keyof typeof TIER_CONFIGS]?.name || user.tier}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm">
                          <div className="text-gray-300">{user.tokens_remaining} remaining</div>
                          <div className="text-gray-500 text-xs">{user.tokens_used} used</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs">
                            Edit
                          </button>
                          <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs">
                            Ban
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-bold mb-6">Recent Purchases</h2>
              
              <div className="space-y-4">
                {mockTokenPurchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="font-medium">{purchase.userEmail}</div>
                      <div className="text-sm text-gray-400">
                        {TOKEN_PACKAGES.find(p => p.id === purchase.package)?.name || purchase.package}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">${purchase.amount}</div>
                      <div className="text-xs text-gray-500">{purchase.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-bold mb-6">Tier Distribution</h2>
              
              <div className="space-y-4">
                {Object.entries(tierDistribution).map(([tier, count]) => {
                  const percentage = (count / totalUsers) * 100;
                  const tierConfig = TIER_CONFIGS[tier as keyof typeof TIER_CONFIGS];
                  
                  return (
                    <div key={tier} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{tierConfig?.name || tier}</span>
                        <span className="text-gray-400">{count} users ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${percentage}%`,
                            background: tierConfig?.color === 'purple' ? 'linear-gradient(to right, #9333ea, #3b82f6)' :
                                      tierConfig?.color === 'amber' ? 'linear-gradient(to right, #f59e0b, #f97316)' :
                                      tierConfig?.color === 'blue' ? 'linear-gradient(to right, #3b82f6, #06b6d4)' :
                                      'linear-gradient(to right, #6b7280, #9ca3af)'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
          <h2 className="text-xl font-bold mb-6">System Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Default Free Tokens</label>
              <input
                type="number"
                defaultValue={50}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Token Expiration (Days)</label>
              <input
                type="number"
                defaultValue={90}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Monthly Reset Date</label>
              <select className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white">
                <option>1st of each month</option>
                <option>User signup date</option>
                <option>Fixed calendar day</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">AI Cost Multiplier</label>
              <input
                type="number"
                step="0.01"
                defaultValue="2.0"
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium">
              Save Changes
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
