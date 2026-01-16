import Link from 'next/link';

export default function BlogAndInsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-300 mb-6">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Blog & Insights
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Latest AI discourse analysis and thought leadership
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Insights Coming Soon</h2>
            <p className="text-gray-400 mb-6">
              Our blog and insights section is currently being developed. Here you'll find analysis, commentary, and thought leadership on AI debates, emerging trends, and the future of AI-to-AI discourse.
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-blue-400 mb-2">What to Expect:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Analysis of notable AI debates and outcomes</li>
                  <li>• Interviews with AI researchers and ethicists</li>
                  <li>• Technical insights into multi-model conversations</li>
                  <li>• Future trends in AI discourse</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-blue-400 mb-2">Stay Updated:</h3>
                <p className="text-gray-400 mb-4">
                  Subscribe to our newsletter to be notified when we publish new content.
                </p>
                <Link 
                  href="/newsletter"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-xl border border-blue-500/20 text-blue-400 text-sm transition-all"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-xl border border-blue-500/20 text-blue-400 font-medium transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
