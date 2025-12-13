"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock user data - In reality, you'd fetch this from your backend/Stripe
const mockUser = {
  name: 'Cassandra Williamson',
  email: 'cassandra@janusforge.ai',
  tier: 'Council',
  status: 'active',
  joinDate: '2024-12-01',
  nextBilling: '2025-01-01',
};

// Mock subscription features based on tier
const tierFeatures = {
  Council: ['5 AI Models Access', 'Daily Debate Archive', 'Topic Voting', 'Email Support'],
  Oracle: ['All Council Features', 'Grok AI Access', 'Advanced Analytics', 'API Access (Limited)', 'Priority Chat'],
  Visionary: ['All Oracle Features', 'Unlimited API', 'Custom Training', 'Dedicated Support', 'SLA 99.9%'],
};

// In your DashboardPage component, update the useEffect:

useEffect(() => {
  const fetchUserData = async () => {
    try {
      // TODO: Replace with real customer ID from your auth system
      const customerId = 'cus_placeholder'; // This will return mock data
      const response = await fetch(`/api/user/subscription?customer_id=${customerId}`);
      const data = await response.json();
      
      if (data.success) {
        setUser({
          name: data.customer.name || 'User',
          email: data.customer.email || '',
          tier: data.subscription?.tier || 'No Active Subscription',
          status: data.subscription?.status || 'inactive',
          joinDate: '2024-12-01', // You'd get this from Stripe customer creation date
          nextBilling: data.subscription?.current_period_end 
            ? new Date(data.subscription.current_period_end).toISOString().split('T')[0]
            : '2025-01-01',
          subscriptionId: data.subscription?.id,
          amount: data.subscription?.amount ? data.subscription.amount / 100 : 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchUserData();
}, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700">
                <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">{user.tier} Tier • {user.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Subscription Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subscription Card */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Subscription</h2>
                  <p className="text-gray-400">Manage your plan and billing</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-3xl font-bold">
                    {user.tier === 'Council' ? '$9' : user.tier === 'Oracle' ? '$29' : '$99'}
                    <span className="text-lg text-gray-400">/month</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-300 mb-2">Status</h3>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xl font-bold capitalize">{user.status}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Since {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-300 mb-2">Next Billing</h3>
                  <p className="text-xl font-bold">{new Date(user.nextBilling).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400 mt-1">Auto-renewal enabled</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
                  Manage Subscription
                </button>
                <button className="flex-1 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
                  Update Payment Method
                </button>
                <button className="flex-1 border border-red-800/50 text-red-400 hover:text-red-300 hover:border-red-700 font-bold py-3 px-6 rounded-lg transition-all duration-200">
                  Cancel Plan
                </button>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Your {user.tier} Tier Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tierFeatures[user.tier as keyof typeof tierFeatures]?.map((feature, index) => (
                  <div key={index} className="flex items-start p-3 bg-gray-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Links & Stats */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/conversations" className="flex items-center p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg transition-all duration-200 group">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-900/50">
                    <span className="text-blue-400">💬</span>
                  </div>
                  <div>
                    <p className="font-medium">AI Conversations</p>
                    <p className="text-sm text-gray-400">Join live debates</p>
                  </div>
                </Link>
                
                <Link href="/daily-forge" className="flex items-center p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg transition-all duration-200 group">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-900/50">
                    <span className="text-purple-400">🔥</span>
                  </div>
                  <div>
                    <p className="font-medium">Daily Forge</p>
                    <p className="text-sm text-gray-400">Today's AI council</p>
                  </div>
                </Link>
                
                <Link href="/archives" className="flex items-center p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg transition-all duration-200 group">
                  <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-900/50">
                    <span className="text-green-400">📚</span>
                  </div>
                  <div>
                    <p className="font-medium">Debate Archives</p>
                    <p className="text-sm text-gray-400">Past conversations</p>
                  </div>
                </Link>
                
                <Link href="/pricing" className="flex items-center p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg transition-all duration-200 group">
                  <div className="w-10 h-10 bg-orange-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-900/50">
                    <span className="text-orange-400">⚡</span>
                  </div>
                  <div>
                    <p className="font-medium">Upgrade Plan</p>
                    <p className="text-sm text-gray-400">Access more features</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Account</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Customer ID</p>
                  <p className="font-mono text-sm bg-black/30 p-2 rounded">cus_••••••••</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-800">
                <button className="w-full border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📊</div>
            <p>Your activity will appear here soon</p>
            <p className="text-sm mt-2">Debates joined, topics submitted, etc.</p>
          </div>
        </div>
      </div>
    </div>


