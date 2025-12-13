"use client";

import { useState } from 'react';

export default function DebugPricingPage() {
  const [debug, setDebug] = useState<string[]>([]);

  const addDebug = (msg: string) => {
    setDebug(prev => [...prev, `${new Date().toISOString()}: ${msg}`]);
    console.log(msg);
  };

  const handleSubscribe = async (stripeId: string, tierName: string, isContact = false) => {
    addDebug(`Button clicked: ${tierName}, isContact: ${isContact}`);
    
    if (isContact) {
      addDebug('Opening email client...');
      window.open('mailto:sales@janusforge.ai?subject=Visionary Tier Inquiry', '_blank');
      return;
    }

    addDebug(`Starting checkout for ${tierName} with ID: ${stripeId.substring(0, 10)}...`);

    try {
      addDebug('Making fetch request to /api/create-checkout-session...');
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: stripeId })
      });

      addDebug(`Response status: ${response.status}`);
      
      const data = await response.json();
      addDebug(`Response data: ${JSON.stringify(data)}`);

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      addDebug('Redirecting to Stripe checkout...');
      window.location.href = data.url;
    } catch (error: any) {
      addDebug(`ERROR: ${error.message}`);
      alert(`Error: ${error.message}. Check console for details.`);
    }
  };

  const tiers = [
    {
      name: 'Council',
      stripeId: 'price_1ScOX7Gg8RUnSFObmqiclPbt',
      price: '$9',
      period: '/month',
      cta: 'Test Council',
      isContact: false
    },
    {
      name: 'Oracle',
      stripeId: 'price_1SVxLeGg8RUnSFObKobkPrcE',
      price: '$29',
      period: '/month',
      cta: 'Test Oracle',
      isContact: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Stripe Debug Page</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {tiers.map((tier) => (
          <button
            key={tier.name}
            onClick={() => handleSubscribe(tier.stripeId, tier.name, tier.isContact)}
            className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            {tier.cta} - {tier.price}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Debug Log:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {debug.map((msg, i) => (
            <div key={i} className="text-sm font-mono p-2 bg-gray-700 rounded">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
