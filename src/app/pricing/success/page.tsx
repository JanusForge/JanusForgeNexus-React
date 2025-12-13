"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PricingSuccessPage() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tier, setTier] = useState<string>('Council');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = searchParams.get('session_id');
    const urlTier = searchParams.get('tier');
    
    if (session) setSessionId(session);
    if (urlTier) setTier(urlTier);
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying your payment...</p>
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
              Payment Successful!
            </h1>
            <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 text-blue-300 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Active: {tier} Tier
            </div>
            <p className="text-xl text-gray-300">
              Thank you for subscribing to Janus Forge Nexus
            </p>
          </div>

          <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold mb-6">Subscription Confirmed</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Plan</h3>
                <p className="text-2xl font-bold text-blue-300">{tier}</p>
                <p className="text-sm text-gray-400 mt-1">All features activated</p>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Status</h3>
                <p className="text-2xl font-bold text-green-400">Active</p>
                <p className="text-sm text-gray-400 mt-1">Ready to use</p>
              </div>
            </div>

            {sessionId && (
              <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                <p className="text-sm text-gray-400 mb-2">Reference:</p>
                <code className="text-xs font-mono bg-black/50 p-2 rounded block overflow-x-auto">
                  {sessionId}
                </code>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-12">
            <Link
              href="/conversations"
              className="block bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
            >
              Start Exploring Conversations
            </Link>
            
            <Link
              href="/"
              className="block border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
            >
              Return to Home
            </Link>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <h4 className="font-bold text-lg mb-4">Need Help?</h4>
            <a
              href="mailto:support@janusforge.ai"
              className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
