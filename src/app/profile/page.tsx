"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useState } from 'react';
import Link from 'next/link'; // ← ADDED THIS
import { Zap, User, Mail, Shield, Coins } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase">
            Your Forge Profile
          </h1>
          <p className="text-xl text-gray-400">Architect Status & Nexus Energy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Info Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-3xl font-black">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black">{user.username}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <span className="text-gray-300">Architect</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-500" />
                <span className="text-gray-300">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" />
                <span className="text-gray-300">Active Nexus Member</span>
              </div>
            </div>
          </div>

          {/* Token Balance Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
            <h3 className="text-2xl font-black mb-8">Nexus Energy</h3>
            <div className="flex items-center justify-center gap-6 mb-8">
              <Coins size={48} className="text-purple-400" />
              <div className="text-center">
                <p className="text-5xl font-black text-purple-300">
                  {user.tokens_remaining?.toLocaleString() || 0}
                </p>
                <p className="text-gray-400 uppercase tracking-widest text-sm mt-2">Tokens Remaining</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Each query consumes 1 token. Top up anytime in Pricing.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-lg transition-all"
          >
            <Zap size={20} />
            Add More Fuel
          </Link>
        </div>
      </div>
    </div>
  );
}
