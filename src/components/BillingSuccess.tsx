import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const BillingSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect back to the Nexus after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard'); 
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
      {/* The "Glow" Core */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl animate-pulse opacity-50"></div>
        <div className="relative border-4 border-blue-400 w-full h-full rounded-full flex items-center justify-center">
          <span className="text-4xl">⚡</span>
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tighter mb-2">FORGE REFUELED</h1>
      <p className="text-zinc-400 uppercase tracking-widest text-sm mb-8">Council Energy Synchronized</p>
      
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl max-w-sm text-center">
        <p className="text-zinc-300 text-sm leading-relaxed">
          Your transaction was successful. The Pentarchy has acknowledged the contribution and your tokens are being credited to your vault.
        </p>
      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="mt-10 text-blue-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
      >
        Return to Nexus Manually →
      </button>
    </div>
  );
};
