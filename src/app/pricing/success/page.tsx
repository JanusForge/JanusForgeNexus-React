"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type SessionData = {
  id: string;
  customer_email?: string;
  amount_total: number;
  currency: string;
  status: string;
  tier: string;
  subscription_id: string;
  customer_id: string;
};

export default function PricingSuccessPage() {
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data.success) {
          setSessionData(data.session);
        } else {
          setError(data.error || 'Failed to verify session');
        }
      } catch (err) {
        setError('Network error verifying session');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="max-w-md text-center p-8 bg-gray-800/30 rounded-2xl border border-red-800/30">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-red-300">Verification Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <p className="text-sm text-gray-400 mb-6">
            Your payment was processed, but we couldn't verify the details.
            You'll receive an email confirmation shortly.
          </p>
          <Link
            href="/conversations"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Continue to Conversations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Welcome to the Council!
            </h1>
            <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 text-blue-300 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Active: {sessionData?.tier || 'Council'} Tier
            </div>
            <p className="text-xl text-gray-300">
              Your subscription is now active
            </p>
            {sessionData?.customer_email && (
              <p className="text-gray-400 mt-2">
                Confirmation sent to {sessionData.customer_email}
              </p>
            )}
          </div>

          <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold mb-6">Subscription Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-gray-300">Plan</h3>
                <p className="text-2xl font-bold text-blue-300">{sessionData?.tier || 'Council'}</p>
                <p className="text-sm text-gray-400 mt-1">All features activated</p>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-gray-300">Amount</h3>
                <p className="text-2xl font-bold text-green-400">
                  ${sessionData?.amount_total || '9'}.00
                </p>
                <p className="text-sm text-gray-400 mt-1">Monthly subscription</p>
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <h3 className="font-bold mb-3 text-gray-300">Subscription ID</h3>
              <code className="text-xs font-mono bg-black/50 p-3 rounded block overflow-x-auto text-gray-300">
                {sessionData?.subscription_id || 'Loading...'}
              </code>
              <p className="text-xs text-gray-500 mt-2">
                Keep this for reference if you need support
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <Link
              href="/conversations"
              className="block bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
            >
              Start Exploring AI Conversations
            </Link>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/daily-forge"
                className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
              >
                View Daily Forge
              </Link>
              <Link
                href="/"
                className="block border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Return to Home
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <h4 className="font-bold text-lg mb-4">Need Help?</h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@janusforge.ai"
                className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-blue-800/50 text-blue-400 hover:text-blue-300 hover:border-blue-700 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                View Plan Details
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Thank you for supporting our veteran-owned AI platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
