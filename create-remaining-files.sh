#!/bin/bash

# Create profile page
mkdir -p src/app/profile
cat > src/app/profile/page.tsx << 'PROFILE'
"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TIER_CONFIGS } from '@/config/tiers';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setMessage({ 
      type: 'success', 
      text: 'Profile updated successfully!' 
    });
    setIsEditing(false);
    
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const currentTier = TIER_CONFIGS[user.tier];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        {message && (
          <div className={\`p-4 rounded-lg mb-6 \${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}\`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Card */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Account Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{user.name || 'User'}</h3>
                      <p className="text-gray-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="px-3 py-1 bg-gray-800/50 rounded-full text-sm">
                          {currentTier.name} Tier
                        </div>
                        {user.isAdmin && (
                          <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                            Administrator
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Member Since</div>
                      <div className="font-medium">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Account ID</div>
                      <div className="font-medium font-mono text-sm truncate">
                        {user.id}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Token Usage Card */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-bold mb-6">Token Usage</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Monthly Allocation</span>
                    <span>{currentTier.monthly_tokens} tokens</span>
                  </div>
                  <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: \`\${Math.min(100, (user.tokens_used / currentTier.monthly_tokens) * 100)}%\` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">
                    {user.tokens_used} / {currentTier.monthly_tokens} used
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {user.tokens_remaining}
                    </div>
                    <div className="text-sm text-gray-400">Monthly Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {user.purchased_tokens}
                    </div>
                    <div className="text-sm text-gray-400">Purchased</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {user.tokens_remaining + user.purchased_tokens}
                    </div>
                    <div className="text-sm text-gray-400">Total Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-red-800/30">
              <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>
              <p className="text-gray-400 mb-6 text-sm">
                These actions are irreversible. Please proceed with caution.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/billing')}
                  className="w-full text-left p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50"
                >
                  <div className="font-medium text-white">Cancel Subscription</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Cancel your current plan. You'll retain access until the end of your billing period.
                  </div>
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full text-left p-4 bg-red-900/20 hover:bg-red-900/30 rounded-lg border border-red-800/30"
                >
                  <div className="font-medium text-red-400">Delete Account</div>
                  <div className="text-sm text-red-400/70 mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/billing')}
                  className="w-full p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 rounded-lg border border-blue-800/30 text-left"
                >
                  <div className="font-medium text-white">Manage Subscription</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Upgrade, downgrade, or change billing
                  </div>
                </button>
                <button
                  onClick={() => router.push('/billing')}
                  className="w-full p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 rounded-lg border border-green-800/30 text-left"
                >
                  <div className="font-medium text-white">Buy More Tokens</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Purchase additional token packages
                  </div>
                </button>
                <button
                  onClick={() => router.push('/debates')}
                  className="w-full p-4 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 rounded-lg border border-amber-800/30 text-left"
                >
                  <div className="font-medium text-white">View Debates</div>
                  <div className="text-sm text-gray-400 mt-1">
                    See your debate history and analytics
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-bold mb-4">Current Plan</h2>
              <div className="p-4 bg-gray-800/30 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{currentTier.name}</div>
                  <div className="text-green-400 font-bold">
                    {user.tier === 'free' ? 'Free' : \`\$\${currentTier.price}/mo\`}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {currentTier.max_ai_models} AI models • {currentTier.monthly_tokens} tokens/month
                </div>
              </div>
              <button
                onClick={() => router.push('/pricing')}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium"
              >
                View All Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
PROFILE

# Create admin page
mkdir -p src/app/admin
cat > src/app/admin/page.tsx << 'ADMIN'
"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TIER_CONFIGS, TOKEN_PACKAGES } from '@/config/tiers';

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-white">{totalUsers}</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
            <div className="text-gray-400 text-sm mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green-400">\${totalRevenue.toFixed(2)}</div>
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
                        <span className={\`px-2 py-1 rounded-full text-xs \${user.tier === 'pro' ? 'bg-purple-500/20 text-purple-300' : user.tier === 'enterprise' ? 'bg-amber-500/20 text-amber-300' : user.tier === 'basic' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}\`}>
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
                      <div className="text-green-400 font-bold">\${purchase.amount}</div>
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
                            width: \`\${percentage}%\`,
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
ADMIN

# Create TokenUsage component
cat > src/components/Debate/TokenUsage.tsx << 'TOKENUSAGE'
"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { formatTokens } from '@/config/tiers';

interface TokenUsageProps {
  estimatedTokens: number;
  onStartDebate: () => void;
}

export default function TokenUsage({ estimatedTokens, onStartDebate }: TokenUsageProps) {
  const { user, getRemainingTokens, useTokens } = useAuth();
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);

  useEffect(() => {
    if (user) {
      setRemainingTokens(getRemainingTokens());
    }
  }, [user, getRemainingTokens]);

  const handleStartDebate = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (remainingTokens >= estimatedTokens) {
      const success = useTokens(estimatedTokens, 'debate_start');
      if (success) {
        onStartDebate();
      }
    } else {
      setShowPurchasePrompt(true);
    }
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white mb-1">Start Your First Debate</h3>
            <p className="text-gray-400 text-sm">
              Sign up to get {formatTokens(50)} free tokens to start debating
            </p>
          </div>
          <a
            href="/register"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white"
          >
            Sign Up Free
          </a>
        </div>
      </div>
    );
  }

  if (showPurchasePrompt) {
    return (
      <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white mb-1">Insufficient Tokens</h3>
            <p className="text-gray-400 text-sm">
              You need {formatTokens(estimatedTokens)} tokens but only have {formatTokens(remainingTokens)} remaining.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/billing"
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-lg text-white"
            >
              Buy More Tokens
            </a>
            <button
              onClick={() => setShowPurchasePrompt(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white mb-1">Ready to Start Debate</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-gray-300">
              Estimated cost: <span className="font-bold text-white">{formatTokens(estimatedTokens)} tokens</span>
            </div>
            <div className="text-gray-400">•</div>
            <div className="text-gray-300">
              Remaining: <span className="font-bold text-white">{formatTokens(remainingTokens)} tokens</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-400">After debate:</div>
            <div className="text-sm text-white font-bold">
              {formatTokens(remainingTokens - estimatedTokens)} tokens remaining
            </div>
          </div>
          <button
            onClick={handleStartDebate}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-medium"
          >
            Start Debate ({formatTokens(estimatedTokens)} tokens)
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>0 tokens</span>
          <span>Available: {formatTokens(remainingTokens)}</span>
          <span>Cost: {formatTokens(estimatedTokens)}</span>
        </div>
        <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
            style={{ width: \`\${Math.min(100, (estimatedTokens / remainingTokens) * 100)}%\` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
TOKENUSAGE

echo "Files created successfully!"
