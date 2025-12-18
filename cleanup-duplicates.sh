#!/bin/bash

echo "Cleaning up duplicate Header/Footer components..."

# Function to clean a single file
clean_file() {
  local file="$1"
  if [ ! -f "$file" ]; then
    return
  fi
  
  echo "Cleaning: $file"
  
  # Create backup
  cp "$file" "${file}.backup-$(date +%s)"
  
  # Remove Header import line
  sed -i '/import.*Header.*@\/components\/Header/d' "$file"
  sed -i '/import.*Header.*from.*Header/d' "$file"
  
  # Remove Footer import line
  sed -i '/import.*Footer.*@\/components\/Footer/d' "$file"
  sed -i '/import.*Footer.*from.*Footer/d' "$file"
  
  # Remove the JSX elements (we'll handle this separately for safety)
}

# Clean all the pages we created
pages=(
  "src/app/features/page.tsx"
  "src/app/documentation/page.tsx"
  "src/app/dashboard/page.tsx"
  "src/app/admin/page.tsx"
  "src/app/profile/page.tsx"
  "src/app/settings/page.tsx"
  "src/app/contact/page.tsx"
  "src/app/architecture/page.tsx"
  "src/app/security/page.tsx"
  "src/app/status/page.tsx"
  "src/app/legal/privacy/page.tsx"
  "src/app/legal/terms/page.tsx"
  "src/app/legal/cookies/page.tsx"
  "src/app/legal/gdpr/page.tsx"
  "src/app/legal/ai-ethics/page.tsx"
  "src/app/legal/acceptable-use/page.tsx"
)

for page in "${pages[@]}"; do
  clean_file "$page"
done

echo "First pass complete. Now fixing JSX structure..."

# Now let me manually fix a few key files to show the pattern
# The pattern should be: export default function Page() { return ( <div>content</div> ); }

# Fix features page
cat > src/app/features/page.tsx << 'FEOF'
export default function FeaturesPage() {
  const features = [
    {
      title: '5 AI Personalities',
      description: 'Distinct models with unique perspectives: GPT-4, DeepSeek, Claude, Gemini, and Grok.',
      icon: '🤖'
    },
    {
      title: 'Real-time Debates',
      description: 'Live AI conversations on daily topics, with models referencing and building on each other.',
      icon: '💬'
    },
    {
      title: 'Ethical AI Oversight',
      description: 'Veteran-owned platform with human oversight and ethical AI principles.',
      icon: '⚖️'
    },
    {
      title: 'Community Participation',
      description: 'Vote on topics, suggest debates, and interact with AI council decisions.',
      icon: '👥'
    },
    {
      title: 'Advanced Analytics',
      description: 'Track debate trends, AI performance metrics, and engagement statistics.',
      icon: '📊'
    },
    {
      title: 'API Integration',
      description: 'Developer API access for integrating Janus Forge capabilities into your applications.',
      icon: '🔧'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Janus Forge <span className="text-blue-400">Features</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of AI collaboration with our comprehensive platform features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-800/20 rounded-2xl p-12 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the AI Council?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience multi-AI dialogue and help shape the future of AI collaboration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              View Pricing Plans
            </a>
            <a
              href="/daily-forge"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Explore Daily Forge
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
FEOF

# Fix documentation page
cat > src/app/documentation/page.tsx << 'DOEOF'
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
DOEOF

# Fix contact page (as an example of the pattern)
cat > src/app/contact/page.tsx << 'COEOF'
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 mb-8">
            Have questions? Reach out to our team.
          </p>
          
          <div className="bg-gray-800/30 rounded-xl p-8 text-left">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-300">support@janusforge.ai</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">GitHub</h3>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                github.com/janusforge
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Business Hours</h3>
              <p className="text-gray-300">Monday - Friday: 9AM - 5PM EST</p>
            </div>
          </div>
          
          <a href="/" className="mt-8 inline-block text-blue-400 hover:text-blue-300">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}
COEOF

echo "Key pages fixed. Now let's fix the rest with a template..."

# Template for simple pages
simple_page_template() {
  local file="$1"
  local page_name="$2"
  
  cat > "$file" << EOF
export default function ${page_name}() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">${page_name}</h1>
        <p className="text-gray-300 mb-8">${page_name} page content</p>
        <a href="/" className="text-blue-400 hover:text-blue-300">
          Return to Home
        </a>
      </div>
    </div>
  );
}
