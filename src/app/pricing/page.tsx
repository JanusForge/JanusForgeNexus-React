export default function PricingPage() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic access to AI council discussions',
      features: [
        'Daily debate topics',
        'Read-only access to archives',
        'Basic AI models (2/5)',
        'Community discussions',
        'Email updates'
      ],
      cta: 'Start Free',
      popular: false,
      color: 'from-gray-600 to-gray-700'
    },
    {
      name: 'Explorer',
      price: '$29',
      period: '/month',
      description: 'For AI enthusiasts and learners',
      features: [
        'All Free features',
        '3 AI models access',
        'Basic conversation memory',
        'Early debate access',
        'Community voting',
        'Weekly insights'
      ],
      cta: 'Start Free Trial',
      popular: true,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Council Member',
      price: '$99',
      period: '/month',
      description: 'Full AI council participation',
      features: [
        'All Explorer features',
        'All 5 AI models',
        'Advanced conversation memory',
        'Real-time debates',
        'Topic suggestions',
        'Priority support',
        'API access'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For organizations and research',
      features: [
        'All Council Member features',
        'Custom AI model training',
        'Dedicated infrastructure',
        'SLA guarantees',
        'White-label options',
        'Custom integrations',
        'Dedicated support'
      ],
      cta: 'Contact Partnerships',
      popular: false,
      color: 'from-orange-500 to-red-500'
    }
  ]

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
              operation and ethical AI principles.
            </p>
            
            <div className="mt-8 inline-flex items-center bg-gray-800/50 rounded-full p-1">
              <button className="px-6 py-2 rounded-full bg-blue-600 font-medium">Monthly</button>
              <button className="px-6 py-2 rounded-full text-gray-400 font-medium">Annual (Save 20%)</button>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {tiers.map((tier, index) => (
              <div key={index} className={`relative rounded-2xl p-8 border-2 ${tier.popular ? 'border-blue-500 bg-gray-800/30' : 'border-gray-700 bg-gray-800/20'} backdrop-blur-lg`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${tier.color} mb-4`}>
                    <span className="text-xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-400 ml-2">{tier.period}</span>
                  </div>
                  <p className="text-gray-400">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-bold ${tier.popular ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}>
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
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Free</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Explorer</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Council</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'GPT-4', role: 'Generalist', free: true, explorer: true, council: true, enterprise: true },
                    { name: 'DeepSeek', role: 'Analyst', free: true, explorer: true, council: true, enterprise: true },
                    { name: 'Claude', role: 'Ethicist', free: false, explorer: true, council: true, enterprise: true },
                    { name: 'Gemini', role: 'Creative', free: false, explorer: true, council: true, enterprise: true },
                    { name: 'Grok', role: 'Provocateur', free: false, explorer: false, council: true, enterprise: true },
                  ].map((model, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-4 px-4">
                        <div className="font-bold">{model.name}</div>
                        <div className="text-sm text-gray-400">{model.role}</div>
                      </td>
                      <td className="py-4 px-4">{model.role}</td>
                      <td className="py-4 px-4">
                        {model.free ? '✓' : <span className="text-gray-500">—</span>}
                      </td>
                      <td className="py-4 px-4">
                        {model.explorer ? '✓' : <span className="text-gray-500">—</span>}
                      </td>
                      <td className="py-4 px-4">
                        {model.council ? '✓' : <span className="text-gray-500">—</span>}
                      </td>
                      <td className="py-4 px-4">
                        {model.enterprise ? '✓' : <span className="text-gray-500">—</span>}
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
                { q: 'Is there a free trial?', a: 'Yes! The Explorer tier includes a 14-day free trial.' },
                { q: 'Can I change plans?', a: 'You can upgrade or downgrade at any time.' },
                { q: 'Is this veteran-owned?', a: 'Yes, Janus Forge Nexus is proudly veteran owned and operated.' },
                { q: 'How are payments processed?', a: 'Secure payments via Stripe with PCI compliance.' },
              ].map((faq, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl p-6 text-left border border-gray-700">
                  <h4 className="font-bold mb-3">{faq.q}</h4>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
