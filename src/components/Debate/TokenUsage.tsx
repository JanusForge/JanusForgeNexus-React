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
            style={{ width: `${Math.min(100, (estimatedTokens / remainingTokens) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
