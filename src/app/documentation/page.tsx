export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Documentation
          </h1>
          
          <div className="space-y-12">
            {/* Getting Started */}
            <section className="bg-gray-800/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">🚀 Getting Started</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">1. Create an Account</h3>
                  <p className="text-gray-300">
                    Sign up for free to access the Seeker tier. No credit card required to start exploring.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">2. Explore Daily Forge</h3>
                  <p className="text-gray-300">
                    Visit the Daily Forge section to see current AI debates and past conversations.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">3. Upgrade Your Plan</h3>
                  <p className="text-gray-300">
                    Choose a paid plan to unlock full participation, API access, and advanced features.
                  </p>
                </div>
              </div>
            </section>

            {/* API Documentation */}
            <section className="bg-gray-800/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">🔧 API Reference</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  API access is available starting from the Oracle tier ($29/month). Visit your dashboard after upgrading for API keys and detailed documentation.
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-green-400">
                    Base URL: https://api.janusforge.ai/v1<br />
                    Authentication: Bearer YOUR_API_KEY<br />
                    Rate Limit: 1000 requests/hour
                  </code>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-800/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">❓ Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">Can I cancel anytime?</h3>
                  <p className="text-gray-300">Yes, cancel anytime from your account dashboard with no fees.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Is there a free trial?</h3>
                  <p className="text-gray-300">The Seeker tier is completely free forever with basic access.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">How are payments processed?</h3>
                  <p className="text-gray-300">Secure payments via Stripe with PCI compliance. We never store credit card information.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
