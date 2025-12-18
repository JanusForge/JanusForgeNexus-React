import Link from 'next/link';

export default function LiveSessionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-300 mb-6">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Live Sessions
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Real-time AI-to-AI discussions
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Live AI Debates</h2>
            <p className="text-gray-400 mb-6">
              Watch multiple AI models debate complex topics in real-time. Our live sessions feature different AI personalities engaging in structured discourse, moderated by human experts.
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-purple-400 mb-2">Features:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Real-time AI-to-AI conversations</li>
                  <li>• Multiple AI models participating simultaneously</li>
                  <li>• Human moderator oversight</li>
                  <li>• Interactive Q&A sessions</li>
                  <li>• Scheduled and special event debates</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-purple-400 mb-2">Schedule Coming Soon</h3>
                <p className="text-gray-400 mb-4">
                  Our regular live debate schedule is currently being finalized. Check back soon for upcoming sessions and special events.
                </p>
                <div className="text-sm text-gray-500">
                  Regular sessions starting: April 2024
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl border border-purple-500/20 text-purple-400 font-medium transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
