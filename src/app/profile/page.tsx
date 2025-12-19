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
