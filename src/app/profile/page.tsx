"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS, getTierColor } from '@/config/tiers';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const currentTier = user?.tier || 'free';
  const tierConfig = TIER_CONFIGS[currentTier];
  
  // Calculate tokens used based on monthly_tokens and tokens_remaining
  const tokensUsed = tierConfig.monthly_tokens - (user?.tokens_remaining || 0);
  const tokenUsagePercent = Math.min(100, (tokensUsed / tierConfig.monthly_tokens) * 100);
  const totalTokens = (user?.tokens_remaining || 0) + (user?.purchased_tokens || 0);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      // In production, this would call an API endpoint
      alert('In production: Profile would be updated via API call');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
            <p className="text-gray-400">Manage your account and subscription</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Card */}
              <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Account Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-400 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <div className="text-xl font-semibold">{user?.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <div className="text-xl font-semibold">{user?.email}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Account Tier</label>
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-full ${getTierColor(currentTier)} text-white font-semibold`}>
                        {tierConfig.name}
                      </div>
                      {user?.isAdmin && (
                        <div className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded-full text-sm font-medium">
                          Administrator
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saveLoading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                      >
                        {saveLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Token Usage */}
              <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8">
                <h2 className="text-2xl font-bold mb-6">Token Usage</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Monthly Usage</span>
                      <span className="font-semibold">{tokensUsed} / {tierConfig.monthly_tokens} tokens</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${tokenUsagePercent}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-400 mt-1">
                      {tokenUsagePercent.toFixed(1)}% used
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-gray-400 mb-1">Total Available</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {totalTokens}
                      </div>
                      <div className="text-gray-300 text-sm mt-2">
                        {user?.tokens_remaining || 0} monthly + {user?.purchased_tokens || 0} purchased
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-gray-400 mb-1">Purchased Tokens</div>
                      <div className="text-3xl font-bold text-white">
                        {user?.purchased_tokens || 0}
                      </div>
                      <div className="text-gray-300 text-sm mt-2">
                        Never expire • Use anytime
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => router.push('/billing')}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
                    >
                      Manage Tokens & Billing
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-8">
              {/* Account Actions */}
              <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold mb-6">Account Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => router.push('/billing')}
                    className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium">Upgrade Tier</div>
                    <div className="text-sm text-gray-400">Get more tokens and features</div>
                  </button>

                  <button
                    onClick={() => router.push('/conversations')}
                    className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium">Your Conversations</div>
                    <div className="text-sm text-gray-400">View your debate history</div>
                  </button>

                  {user?.isAdmin && (
                    <button
                      onClick={() => router.push('/admin')}
                      className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-left transition-colors"
                    >
                      <div className="font-medium text-red-400">Admin Dashboard</div>
                      <div className="text-sm text-red-400/70">System management</div>
                    </button>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-gray-800/30 rounded-2xl border border-red-800/50 p-6">
                <h3 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h3>
                <div className="space-y-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 bg-red-600/20 hover:bg-red-600/30 border border-red-600 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-red-400">Sign Out</div>
                    <div className="text-sm text-red-400/70">Log out of your account</div>
                  </button>

                  <button
                    onClick={() => alert('In production: Account deletion would be processed via API with confirmation')}
                    className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-gray-300">Delete Account</div>
                    <div className="text-sm text-gray-500">Permanently remove your account</div>
                  </button>
                </div>
              </div>

              {/* Production Note */}
              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Production Environment</h4>
                <p className="text-gray-300 text-sm">
                  This is a production platform. All data is persisted in PostgreSQL and actions have real consequences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
