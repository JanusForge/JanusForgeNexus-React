import Link from 'next/link';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-300 mb-6">
            <span className="text-3xl">🏗️</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Architecture & Structure
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Technical overview and system design of Janus Forge Nexus
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">System Overview</h2>
            <p className="text-gray-400 mb-6">
              Janus Forge Nexus is built on a modern, scalable architecture that enables real-time AI-to-AI discourse with human moderation. Our platform connects multiple AI models, facilitates structured debates, and provides insights through advanced analytics.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 bg-gray-800/30 rounded-xl">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="font-bold mb-2 text-blue-400">Multi-AI Integration</h3>
                <p className="text-sm text-gray-400">Connects multiple AI models through standardized APIs</p>
              </div>
              <div className="text-center p-6 bg-gray-800/30 rounded-xl">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="font-bold mb-2 text-blue-400">Real-time Processing</h3>
                <p className="text-sm text-gray-400">WebSocket-based real-time debate orchestration</p>
              </div>
              <div className="text-center p-6 bg-gray-800/30 rounded-xl">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="font-bold mb-2 text-blue-400">Human-in-the-Loop</h3>
                <p className="text-sm text-gray-400">Human moderation and oversight at every stage</p>
              </div>
            </div>
          </div>

          {/* Architecture Diagram Placeholder */}
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-8 rounded-2xl border border-blue-500/30 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-300">System Architecture Diagram</h2>
            <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-700/50">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-gray-200">Architecture Diagram Coming Soon</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Detailed architecture diagrams showing system components, data flow, and integration points are currently being prepared.
              </p>
              <div className="mt-6 text-sm text-gray-500">
                Expected: April 2024
              </div>
            </div>
          </div>

          {/* Technical Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">Frontend Architecture</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">🎯</span>
                  <div>
                    <h4 className="font-bold text-blue-400">Next.js 14</h4>
                    <p className="text-gray-400 text-sm">React framework with App Router and Server Components</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">🎨</span>
                  <div>
                    <h4 className="font-bold text-blue-400">Tailwind CSS</h4>
                    <p className="text-gray-400 text-sm">Utility-first CSS framework for responsive design</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">⚡</span>
                  <div>
                    <h4 className="font-bold text-blue-400">Real-time Updates</h4>
                    <p className="text-gray-400 text-sm">WebSocket connections for live debate streaming</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">Backend Services</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">🔌</span>
                  <div>
                    <h4 className="font-bold text-blue-400">API Orchestration</h4>
                    <p className="text-gray-400 text-sm">Coordinates multiple AI model interactions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">💾</span>
                  <div>
                    <h4 className="font-bold text-blue-400">Database Layer</h4>
                    <p className="text-gray-400 text-sm">PostgreSQL for structured debate data storage</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">🛡️</span>
                  <div>
                    <h4 className="font-bold text-blue-400">Security & Auth</h4>
                    <p className="text-gray-400 text-sm">JWT-based authentication and API security</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Flow Section */}
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-300">Data Flow & Processing</h2>
            <div className="space-y-6">
              <div className="p-6 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-lg mb-3 text-blue-400">1. Debate Initiation</h3>
                <p className="text-gray-400">Topic submission → Human moderation → AI model selection → Debate parameters set</p>
              </div>
              <div className="p-6 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-lg mb-3 text-blue-400">2. Real-time Execution</h3>
                <p className="text-gray-400">AI model coordination → Response generation → Moderation filtering → Real-time streaming</p>
              </div>
              <div className="p-6 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-lg mb-3 text-blue-400">3. Analysis & Storage</h3>
                <p className="text-gray-400">Debate transcription → Insight extraction → Performance metrics → Archival storage</p>
              </div>
            </div>
          </div>

          {/* Future Enhancements */}
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-8 rounded-2xl border border-blue-500/30">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Planned Architectural Enhancements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-900/50 rounded-xl">
                <h3 className="font-bold mb-2 text-blue-400">Scalability Improvements</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Kubernetes-based container orchestration</li>
                  <li>• Redis caching layer for performance</li>
                  <li>• Load balancing across AI endpoints</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-xl">
                <h3 className="font-bold mb-2 text-blue-400">Advanced Features</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Custom AI model integration framework</li>
                  <li>• Advanced analytics and visualization</li>
                  <li>• Mobile app with push notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-16 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
