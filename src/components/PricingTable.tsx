import React from 'react';

const tiers = [
  {
    name: "Spark Pack",
    tokens: 50,
    priceId: "price_1SjqQsGg8RUnSFObmCiJWcDY",
    price: "$5.00",
    description: "50 Full Council Summonings. Perfect for testing the Forge.",
  },
  {
    name: "Ignition Pack",
    tokens: 150,
    priceId: "price_1SjqQsGg8RUnSFObmCiJWcDY",
    price: "$12.00",
    description: "150 Deliberations. The sweet spot for active Architects.",
    popular: true,
  },
  {
    name: "Supernova Pack",
    tokens: 500,
    priceId: "price_1SjqQsGg8RUnSFObmCiJWcDY",
    price: "$35.00",
    description: "500 High-Level Syntheses. Maximum power for the serious seeker.",
  }
];

interface PricingTableProps {
  userId?: string; // Optional so it doesn't crash if user isn't logged in
}

export const PricingTable: React.FC<PricingTableProps> = ({ userId }) => {
  
  const handlePurchase = async (priceId: string, tokens: number, name: string) => {
    if (!userId) {
      alert("Please login to the Nexus to refuel your forge.");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/v1/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId,
          tokens,
          packageName: name,
          mode: 'payment'
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url; // The Great Leap to Stripe
      } else {
        console.error("Stripe Session Error:", data.error);
        alert("The Forge is currently cool. Try again shortly.");
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Connection to Nexus Core failed.");
    }
  };

  return (
    <section className="py-20 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black mb-4 tracking-tighter text-blue-500">REFUEL THE FORGE</h2>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm">Convert Currency into Council Energy</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`p-10 rounded-3xl border transition-all duration-300 ${
                tier.popular 
                ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]' 
                : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-600'
              } flex flex-col`}
            >
              {tier.popular && (
                <span className="bg-blue-500 text-black text-xs font-bold px-3 py-1 rounded-full w-max mb-6">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black">{tier.price}</span>
                <span className="text-zinc-500 text-sm">/ {tier.tokens} tokens</span>
              </div>
              <p className="text-zinc-400 mb-10 leading-relaxed flex-grow">
                {tier.description}
              </p>
              <button 
                onClick={() => handlePurchase(tier.priceId, tier.tokens, tier.name)}
                className="w-full py-4 bg-white text-black hover:bg-blue-500 hover:text-white font-black rounded-xl transition-all uppercase tracking-tight"
              >
                Acquire {tier.tokens} Tokens
              </button>
            </div>
          ))}
        </div>
        
        <p className="mt-12 text-center text-zinc-600 text-xs max-w-2xl mx-auto">
          Tokens are non-refundable and represent a unit of compute for the Janus Forge Pentarchy. 
          Unused tokens remain in your vault indefinitely.
        </p>
      </div>
    </section>
  );
};
