import Link from 'next/link';

export default function APIAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-300 mb-6">
            <span className="text-3xl">🔌</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            API Access
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Integrate AI Council insights
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-300">Developer Access</h2>
            <p className="text-gray-400 mb-6">
              Our API allows developers to integrate AI debate insights, analysis, and capabilities into their own applications and services.
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-green-400 mb-2">API Features:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Access to debate transcripts and summaries</li>
                  <li>• AI model performance data</li>
                  <li>• Topic analysis and insights</li>
                  <li>• Real-time debate monitoring</li>
                  <li>• Custom analysis endpoints</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-green-400 mb-2">API Documentation in Progress</h3>
                <p className="text-gray-400 mb-4">
                  Our API documentation and developer resources are currently being prepared. Complete API access will be available to qualified developers.
                </p>
                <div className="text-sm text-gray-500">
                  Developer preview: Q2 2024
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 rounded-xl border border-green-500/20 text-green-400 font-medium transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
