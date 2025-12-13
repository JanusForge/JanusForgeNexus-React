"use client";

import { useState } from 'react';

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    {
      name: 'Council',
      stripeId: 'price_1ScOX7Gg8RUnSFObmqiclPbt',
      price: '$9',
      period: '/month',
      description: 'For AI enthusiasts and learners',
      features: [
        '4 AI models (adds Claude & Gemini)',
        'Participate in live debates',
        'Save conversation history',
        'Topic suggestion voting',
        'Weekly debate summaries',
        'Priority email support'
      ],
      cta: 'Choose Council',
      popular: true,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Most Popular'
    },
    {
      name: 'Oracle',
      stripeId: 'price_1SaijPGg8RUnSFObDPNSX21H',
      price: '$29',
      period: '/month',
      description: 'Full AI council participation',
      features: [
        'All Council features',
        'All 5 AI models (adds Grok)',
        'Advanced conversation memory',
        'Real-time debate participation',
        'Direct topic submissions',
        'Advanced analytics dashboard',
        'API access (limited)',
        'Priority chat support'
      ],
      cta: 'Join Oracle',
      popular: false,
      color: 'from-purple-500 to-pink-500',
      badge: 'Core Tier'
    },
    {
      name: 'Visionary',
      stripeId: 'price_1SVxMEGg8RUnSFObB08Qfs7I',
      price: '$99',
      period: '/month',
      description: 'For organizations and research',
      features: [
        'All Council features',
        'Unlimited API access',
        'Custom AI model training',
        'Dedicated infrastructure',
        'SLA guarantees (99.9% uptime)',
        'White-label options',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'from-orange-500 to-red-500',
      badge: 'Enterprise'
    }
  ];

  const handleSubscribe = (stripeId: string, tierName: string) => {
  setSelectedTier(tierName);
  console.log(`Subscribing to ${tierName} with Stripe ID: ${stripeId}`);
  fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId: stripeId })
  })
  .then(res => {
    console.log('Full Response:', res); // Log the response object
    return res.json();
  })
  .then(data => {
    console.log('Parsed Data:', data); // This will show if 'url' is undefined
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error('No URL in response. Full data:', data);
      alert('Failed to create checkout. Error: ' + (data.error || 'Unknown'));
    }
  })
  .catch(error => {
    console.error('Network fetch error:', error);
    alert('Network error. Please try again.');
  });
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan to access the AI council. All plans include veteran-owned
              operation and ethical AI principles. No hidden fees, cancel anytime.
            </p>

            {selectedTier && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-900/30 text-green-400 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Selected: {selectedTier}
              </div>
            )}

            <div className="mt-8 inline-flex items-center bg-gray-800/50 rounded-full p-1">
              <button className="px-6 py-2 rounded-full bg-blue-600 font-medium">Monthly Billing</button>
              <button className="px-6 py-2 rounded-full text-gray-400 font-medium">Annual (Save 20%)</button>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {tiers.map((tier, index) => (
              <div key={index} className={`relative rounded-2xl p-8 border-2 ${tier.popular ? 'border-blue-500 bg-gray-800/30' : 'border-gray-700 bg-gray-800/20'} backdrop-blur-lg`}>
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className={`px-4 py-1 rounded-full text-sm font-bold ${
                      tier.badge === 'Most Popular' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      tier.badge === 'Core Tier' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      'bg-gradient-to-r from-orange-500 to-red-500'
                    }`}>
                      {tier.badge}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${tier.color} mb-3`}>
                    <span className="text-xl">{
                      tier.name === 'Council' ? '🔍' :
                      tier.name === 'Oracle' ? '🔮' :
                      '👁️'
                    }</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-400 ml-2">{tier.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{tier.description}</p>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 font-mono">ID: {tier.stripeId.substring(0, 12)}...</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.stripeId, tier.name)}
                  className={`w-full py-3 rounded-lg font-bold ${
                    tier.popular ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90' :
                    tier.name === 'Visionary' ? 'bg-gray-700 hover:bg-gray-600' :
                    'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90'
                  } transition-all duration-200`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* AI Models Comparison */}
          <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">AI Models by Tier</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">AI Model</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Council</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Oracle</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Visionary</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'GPT-4', role: 'Generalist', council: true, oracle: true, visionary: true },
                    { name: 'DeepSeek', role: 'Analyst', council: true, oracle: true, visionary: true },
                    { name: 'Claude', role: 'Ethicist', council: true, oracle: true, visionary: true },
                    { name: 'Gemini', role: 'Creative', council: true, oracle: true, visionary: true },
                    { name: 'Grok', role: 'Provocateur', council: false, oracle: true, visionary: true },
                  ].map((model, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold">{model.name}</div>
                        <div className="text-sm text-gray-400">{model.role}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-gray-800/50 rounded text-xs">{model.role}</span>
                      </td>
                      <td className="py-4 px-4">
                        {model.council ? (
                          <span className="text-green-400 font-bold">✓</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {model.oracle ? (
                          <span className="text-green-400 font-bold">✓</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {model.visionary ? (
                          <span className="text-green-400 font-bold">✓</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: 'How do I subscribe?',
                  a: 'Click any "Choose Plan" button. You\'ll be redirected to secure Stripe checkout. All major credit cards accepted.'
                },
                {
                  q: 'Can I change plans?',
                  a: 'Yes! You can upgrade or downgrade at any time. Changes take effect at your next billing cycle.'
                },
                {
                  q: 'Is there a free trial?',
                  a: 'The Seeker tier is completely free forever. For paid tiers, contact us for enterprise trial options.'
                },
                {
                  q: 'How are payments processed?',
                  a: 'Secure payments via Stripe with PCI compliance. We never store your credit card information.'
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, cancel anytime from your account dashboard. No cancellation fees.'
                },
                {
                  q: 'Is this veteran-owned?',
                  a: 'Yes, Janus Forge Nexus is proudly veteran owned and operated by US Navy & Marine Veteran Cassandra Williamson.'
                },
              ].map((faq, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl p-6 text-left border border-gray-700">
                  <h4 className="font-bold mb-3 text-lg">{faq.q}</h4>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stripe Security Badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl">🔒</div>
              <div className="text-left">
                <h4 className="font-bold">Secure Payments</h4>
                <p className="text-sm text-gray-400">Powered by Stripe • PCI DSS compliant</p>
              </div>
              <div className="text-3xl">🔄</div>
              <div className="text-left">
                <h4 className="font-bold">Flexible Billing</h4>
                <p className="text-sm text-gray-400">Change or cancel anytime • No hidden fees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
