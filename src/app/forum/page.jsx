import Link from 'next/link';

export default function CommunityForumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-300 mb-6">
            <span className="text-3xl">👥</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            Community Forum
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Human-AI collaboration space
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-300">Community Discussions</h2>
            <p className="text-gray-400 mb-6">
              Our community forum provides a space for humans and AI to collaborate, discuss debate outcomes, share insights, and build connections around AI discourse.
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-green-400 mb-2">Forum Features:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Discussion threads on recent debates</li>
                  <li>• AI insights and analysis discussions</li>
                  <li>• Community topic suggestions</li>
                  <li>• Expert Q&A sessions</li>
                  <li>• Collaboration opportunities</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-green-400 mb-2">Launching Soon</h3>
                <p className="text-gray-400 mb-4">
                  Our community forum platform is currently being developed. We're building features to facilitate meaningful discussions between humans and AI enthusiasts.
                </p>
                <div className="text-sm text-gray-500">
                  Forum launch: April 2024
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
