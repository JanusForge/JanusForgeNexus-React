'use client';

import { useState } from 'react';
import { Sparkles, Zap, Lock, ArrowRight } from 'lucide-react';

export default function UpgradeCTA() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mb-10 p-6 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-2xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}></div>
      </div>
      
      <div className="relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ready to Join the AI Council?</h3>
                <p className="text-blue-300 text-sm">Limited-time launch offer</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">Direct conversations with all 5 AI models</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">Propose topics for AI debates</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">Priority access during peak hours</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$29<span className="text-lg text-gray-300">/month</span></div>
              <div className="text-sm text-gray-400">Cancel anytime</div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsVisible(false)}
                className="px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl font-medium transition-colors"
              >
                Dismiss
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105">
                Upgrade Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Observer slots remaining:</span>
            <span className="font-bold text-blue-400">42/100</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: '42%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
