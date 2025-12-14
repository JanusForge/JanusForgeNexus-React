"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { 
  FiUser, 
  FiCreditCard, 
  FiCalendar, 
  FiDollarSign, 
  FiActivity,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiCheck,
  FiArrowUp,
  FiBarChart2,
  FiStar,
  FiZap,
  FiShield,
  FiGlobe,
  FiCpu
} from 'react-icons/fi';

// Tier features
const tierFeatures = {
  council: [
    { icon: <FiCpu />, text: '5 AI Models Access' },
    { icon: <FiBarChart2 />, text: 'Daily Debate Archive' },
    { icon: <FiUsers />, text: 'Topic Voting Rights' },
    { icon: <FiHelpCircle />, text: 'Email Support' }
  ],
  oracle: [
    { icon: <FiCpu />, text: 'All Council Features' },
    { icon: <FiZap />, text: 'Grok AI Access' },
    { icon: <FiTrendingUp />, text: 'Advanced Analytics Dashboard' },
    { icon: <FiGlobe />, text: 'API Access (Limited)' },
    { icon: <FiActivity />, text: 'Priority Chat Support' }
  ],
  visionary: [
    { icon: <FiCpu />, text: 'All Oracle Features' },
    { icon: <FiShield />, text: 'Unlimited API Requests' },
    { icon: <FiStar />, text: 'Custom Model Training' },
    { icon: <FiUser />, text: 'Dedicated Account Manager' },
    { icon: <FiCheck />, text: 'SLA 99.9% Uptime' }
  ],
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [revenueData] = useState([
    { month: 'Jan', revenue: 3200 },
    { month: 'Feb', revenue: 4200 },
    { month: 'Mar', revenue: 5100 },
    { month: 'Apr', revenue: 5800 },
    { month: 'May', revenue: 6200 },
    { month: 'Jun', revenue: 7300 },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        
        // For Phase 1: Always fetch the Cassandra user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            *,
            subscriptions (*)
          `)
          .eq('email', 'cassandra@janusforge.ai')
          .single();

        if (userError) throw userError;

        if (userData) {
          const activeSub = userData.subscriptions?.find((s: any) => 
            s.status === 'active' || s.status === 'trialing'
          );
          
          const userTier = activeSub?.tier || userData.tier || 'free';
          
          setUser({
            name: userData.name || 'User',
            email: userData.email || '',
            tier: userTier.charAt(0).toUpperCase() + userTier.slice(1),
            rawTier: userTier,
            status: activeSub?.status || userData.status || 'inactive',
            joinDate: new Date(userData.created_at).toISOString().split('T')[0],
            nextBilling: activeSub?.current_period_end 
              ? new Date(activeSub.current_period_end).toISOString().split('T')[0]
              : '2026-01-13',
            subscriptionId: activeSub?.stripe_subscription_id || '',
            amount: activeSub?.amount ? activeSub.amount / 100 : 0,
            userId: userData.id,
            stripeCustomerId: userData.stripe_customer_id,
          });
          
          setIsRealData(true);
          console.log('✅ Loaded real user data from Supabase');
        }
      } catch (err) {
        console.error('Failed to fetch real user data:', err);
        
        // Fallback to mock data
        setUser({
          name: 'Cassandra Williamson',
          email: 'cassandra@janusforge.ai',
          tier: 'Council',
          rawTier: 'council',
          status: 'active',
          joinDate: '2024-12-01',
          nextBilling: '2026-01-13',
          subscriptionId: 'sub_cus_JF_001',
          amount: 9,
          userId: '1',
          stripeCustomerId: 'cus_JF_001',
        });
        setIsRealData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpgrade = (tier: string) => {
    alert(`Upgrade to ${tier} tier selected! This would redirect to Stripe checkout.`);
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      alert('Subscription cancellation request sent.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">
            {isRealData ? 'Fetching real user data' : 'Using demo data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Data Source Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${isRealData ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'}`}>
          {isRealData ? '✅ Live Data' : '⚠️ Demo Data'}
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700">
                <div className={`w-2 h-2 rounded-full mr-2 ${user?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">{user?.tier} Tier • {user?.status}</span>
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <FiSettings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold mt-2">${user?.amount || 0}</p>
                  </div>
                  <FiDollarSign className="w-8 h-8 text-green-400" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <FiTrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400">+12.5%</span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Next Billing</p>
                    <p className="text-2xl font-bold mt-2">{user?.nextBilling}</p>
                  </div>
                  <FiCalendar className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-500 text-sm mt-2">Auto-renewal enabled</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Account Status</p>
                    <p className="text-2xl font-bold mt-2 capitalize">{user?.status}</p>
                  </div>
                  <FiUser className="w-8 h-8 text-purple-400" />
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: user?.status === 'active' ? '100%' : '50%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Revenue Overview</h2>
                <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-sm">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                  <option>All time</option>
                </select>
              </div>
              <div className="h-64 flex items-end space-x-2">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${(item.revenue / 8000) * 100}%` }}
                    ></div>
                    <span className="text-gray-400 text-sm mt-2">{item.month}</span>
                    <span className="text-xs text-gray-500">${item.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Details */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Subscription Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <FiCreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-gray-400">{user?.tier} Tier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${user?.amount}/month</p>
                    <p className="text-sm text-gray-400">Billed monthly</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <div className="flex items-center">
                    <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Next Billing Date</p>
                      <p className="text-sm text-gray-400">{user?.nextBilling}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                    Change Date
                  </button>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center">
                    <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Customer ID</p>
                      <p className="text-sm text-gray-400">{user?.stripeCustomerId || 'Not available'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded-lg text-sm transition-colors border border-red-800"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tier Features & Upgrade */}
          <div className="space-y-8">
            {/* Current Tier Features */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Your {user?.tier} Tier Features</h2>
              <div className="space-y-4">
                {(tierFeatures[user?.rawTier as keyof typeof tierFeatures] || tierFeatures.council).map((feature, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-blue-400 mr-3">
                      {feature.icon}
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Options */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Upgrade Your Plan</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${user?.rawTier === 'oracle' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-gray-600 transition-colors'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">Oracle Tier</h3>
                      <p className="text-gray-400 text-sm">Advanced features for power users</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">$29<span className="text-gray-400 text-sm">/month</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUpgrade('oracle')}
                    className={`w-full mt-4 py-2 rounded-lg font-medium ${user?.rawTier === 'oracle' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    disabled={user?.rawTier === 'oracle'}
                  >
                    {user?.rawTier === 'oracle' ? 'Current Plan' : 'Upgrade to Oracle'}
                  </button>
                </div>

                <div className={`p-4 rounded-lg border-2 ${user?.rawTier === 'visionary' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 hover:border-gray-600 transition-colors'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">Visionary Tier</h3>
                      <p className="text-gray-400 text-sm">Enterprise-grade with full access</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">$99<span className="text-gray-400 text-sm">/month</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUpgrade('visionary')}
                    className={`w-full mt-4 py-2 rounded-lg font-medium ${user?.rawTier === 'visionary' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                    disabled={user?.rawTier === 'visionary'}
                  >
                    {user?.rawTier === 'visionary' ? 'Current Plan' : 'Upgrade to Visionary'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg flex flex-col items-center justify-center transition-colors">
                  <FiActivity className="w-6 h-6 text-blue-400 mb-2" />
                  <span className="text-sm">View Usage</span>
                </button>
                <button className="p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg flex flex-col items-center justify-center transition-colors">
                  <FiUsers className="w-6 h-6 text-green-400 mb-2" />
                  <span className="text-sm">Invite Team</span>
                </button>
                <button className="p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg flex flex-col items-center justify-center transition-colors">
                  <FiSettings className="w-6 h-6 text-yellow-400 mb-2" />
                  <span className="text-sm">Settings</span>
                </button>
                <button className="p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg flex flex-col items-center justify-center transition-colors">
                  <FiHelpCircle className="w-6 h-6 text-purple-400 mb-2" />
                  <span className="text-sm">Support</span>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="font-medium">{user?.joinDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">User ID</p>
                  <p className="font-medium text-sm font-mono">{user?.userId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              <p>JanusForge AI Platform • v2.1.4 • {isRealData ? 'Connected to production database' : 'Using demonstration data'}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white text-sm transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
