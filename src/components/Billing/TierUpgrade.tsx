"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS, UserTier } from '@/config/tiers';

export default function TierUpgrade() {
  const { user, isLoading } = useAuth();
  const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpgrade = async (tier: UserTier) => {
    setSelectedTier(tier);
    setMessage(null);
    
    try {
      // In production, this would call the backend API
      // For now, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: `Successfully upgraded to ${TIER_CONFIGS[tier].name} tier!`
      });
      
      // In production, we would refresh user data here
      alert(`In production: Would redirect to payment processing for ${TIER_CONFIGS[tier].name} tier`);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to process upgrade. Please try again.'
      });
    } finally {
      setSelectedTier(null);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentTier = user.tier;
  const availableTiers = Object.keys(TIER_CONFIGS).filter(tier => 
    tier !== currentTier && tier !== 'admin'
  ) as UserTier[];

  return (
    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Upgrade Your Tier</h3>
      
      <div className="mb-6">
        <div className="text-gray-400 mb-2">Current Tier:</div>
        <div className="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold">
          {TIER_CONFIGS[currentTier].name}
        </div>
      </div>

      <div className="space-y-4">
        {availableTiers.map((tier) => {
          const tierConfig = TIER_CONFIGS[tier];
          return (
            <div
              key={tier}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-white">{tierConfig.name}</h4>
                  <div className="text-gray-300 text-sm mt-1">
                    ${tierConfig.price}/month • {tierConfig.monthly_tokens.toLocaleString()} tokens
                  </div>
                </div>
                <button
                  onClick={() => handleUpgrade(tier)}
                  disabled={selectedTier === tier}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedTier === tier ? 'Processing...' : 'Upgrade'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'}`}>
          <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          Tier upgrades are processed through secure payment systems. Your new tier and tokens will be available immediately after payment.
        </p>
      </div>
    </div>
  );
}
