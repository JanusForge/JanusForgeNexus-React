"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

interface TokenUsageProps {
  estimatedTokens: number;
  onStartDebate: () => void;
}

export default function TokenUsage({ estimatedTokens, onStartDebate }: TokenUsageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      const totalTokens = (user.tokens_remaining || 0) + (user.purchased_tokens || 0);
      setRemainingTokens(totalTokens);
    }
  }, [user]);

  const handleStartDebate = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (remainingTokens < estimatedTokens) {
      setShowPurchasePrompt(true);
      return;
    }

    setIsProcessing(true);
    try {
      // In production, this would deduct tokens via API
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the parent handler
      onStartDebate();
    } catch (error) {
      console.error('Failed to start debate:', error);
      alert('Failed to start debate. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchaseTokens = () => {
    router.push('/billing');
  };

  if (!user) {
    return (
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Token Status</h3>
        <p className="text-gray-300 mb-4">Please log in to view your token balance.</p>
        <button
          onClick={() => router.push('/login')}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Token Status</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Your Tokens</span>
            <span className="font-semibold text-white">{remainingTokens.toLocaleString()}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (remainingTokens / 1000) * 10)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Estimated Cost</span>
            <span className="font-semibold text-white">{estimatedTokens.toLocaleString()} tokens</span>
          </div>
          <p className="text-gray-300 text-sm">
            This debate will consume approximately {estimatedTokens} tokens based on AI model selection and debate length.
          </p>
        </div>

        {showPurchasePrompt ? (
          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2">Insufficient Tokens</h4>
            <p className="text-yellow-300 text-sm mb-4">
              You need {estimatedTokens - remainingTokens} more tokens to start this debate.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePurchaseTokens}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold"
              >
                Purchase Tokens
              </button>
              <button
                onClick={() => setShowPurchasePrompt(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleStartDebate}
            disabled={isProcessing || remainingTokens < estimatedTokens}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isProcessing
                ? 'bg-gray-700 text-gray-300'
                : remainingTokens < estimatedTokens
                ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            }`}
          >
            {isProcessing
              ? 'Processing...'
              : remainingTokens < estimatedTokens
              ? 'Insufficient Tokens'
              : 'Start Debate'}
          </button>
        )}

        <div className="pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Tokens are consumed for AI responses. Each model has different token costs.
            Purchase additional tokens anytime from your billing page.
          </p>
          <button
            onClick={() => router.push('/billing')}
            className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View Billing & Token Packs →
          </button>
        </div>
      </div>
    </div>
  );
}
