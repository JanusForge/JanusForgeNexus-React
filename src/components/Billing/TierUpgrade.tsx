"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TIER_CONFIGS, type UserTier, getTierColor, formatTokens } from '@/config/tiers';

export default function TierUpgrade() {
  const { user, upgradeTier, isLoading } = useAuth();
  const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) return null;

  const currentTier = TIER_CONFIGS[user.tier];
  const tiers = Object.entries(TIER_CONFIGS).filter(([key]) => 
    key !== 'admin' && key !== user.tier
  );

  const handleUpgrade = async (newTier: UserTier) => {
    setMessage(null);
    const result = await upgradeTier(newTier);
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: `Successfully upgraded to ${TIER_CONFIGS[newTier].name} tier!` 
      });
      setSelectedTier(null);
    } else {
      setMessage({ 
        type: 'error', 
        text: result.error || 'Upgrade failed. Please try again.' 
      });
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Your Current Plan</h2>
        <div className={`p-4 rounded-xl ${getTierColor(user.tier)}/10 border ${getTierColor(user.tier)}/20`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-white">{currentTier.name}</h3>
              <p className="text-gray-300">
                {user.tier === 'free' ? 'Free forever' : `$${currentTier.price}/month`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatTokens(user.tokens_remaining)}
              </div>
              <div className="text-sm text-gray-300">tokens remaining</div>
            </div>
          </div>
          <div className="text-sm text-gray-400 mt-3">
            {currentTier.max_ai_models} AI models • {formatTokens(currentTier.monthly_tokens)} tokens/month
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-white mb-4">Upgrade Your Plan</h3>
        <p className="text-gray-400 mb-6 text-sm">
          Get more AI models and tokens with a higher tier. Your unused monthly tokens will be reset.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {tiers.map(([tierKey, tier]) => {
            const tierId = tierKey as UserTier;
            const isSelected = selectedTier === tierId;
            const isHigherTier = ['pro', 'enterprise'].includes(tierId);
            
            return (
              <div
                key={tierId}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
                }`}
                onClick={() => setSelectedTier(tierId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white">{tier.name}</h4>
                  {isHigherTier && (
                    <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white mb-1">
                    ${tier.price}
                    <span className="text-sm text-gray-400 font-normal">/month</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Billed monthly
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {tier.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {tier.features.length > 4 && (
                    <li className="text-sm text-gray-400">
                      + {tier.features.length - 4} more features
                    </li>
                  )}
                </ul>

                <div className="text-center text-xs text-gray-500 mt-4">
                  {formatTokens(tier.monthly_tokens)} monthly tokens • {tier.max_ai_models} AI models
                </div>
              </div>
            );
          })}
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-4 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {selectedTier && (
          <div className="p-4 bg-gray-800/30 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-white">Upgrade to {TIER_CONFIGS[selectedTier].name}</h4>
                <p className="text-sm text-gray-400">
                  You'll be charged ${TIER_CONFIGS[selectedTier].price}/month
                </p>
              </div>
              <button
                onClick={() => handleUpgrade(selectedTier)}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Upgrade Now'}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Note: Your current monthly tokens ({user.tokens_remaining} remaining) will be reset to {
                formatTokens(TIER_CONFIGS[selectedTier].monthly_tokens)
              } tokens. Purchased tokens will carry over.
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          All plans include access to all AI models. Cancel anytime.
        </div>
      </div>
    </div>
  );
}
