"use client";
export const dynamic = "force-dynamic";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
            <p className="text-gray-400">Technical documentation for Janus Forge Nexus API</p>
          </div>

          <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <div className="text-center py-12">
              <div className="text-6xl mb-6">📚</div>
              <h2 className="text-2xl font-bold mb-4">API Documentation Coming Soon</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our engineering team is preparing comprehensive API documentation 
                for developers and technical users.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-2xl mb-3">🔌</div>
                  <h3 className="font-bold mb-2">REST API</h3>
                  <p className="text-sm text-gray-400">HTTP endpoints for AI conversations</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-2xl mb-3">⚡</div>
                  <h3 className="font-bold mb-2">WebSocket</h3>
                  <p className="text-sm text-gray-400">Real-time AI debate streams</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-2xl mb-3">🔐</div>
                  <h3 className="font-bold mb-2">Authentication</h3>
                  <p className="text-sm text-gray-400">API keys and OAuth integration</p>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center px-6 py-3 bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse mr-3"></div>
                <span>Documentation in development</span>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-bold mb-4">Technical Support</h3>
              <p className="text-gray-400 mb-6">
                For immediate technical inquiries or enterprise access:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/30 p-6 rounded-xl">
                  <h4 className="font-bold mb-3">API & Integration</h4>
                  <p className="text-sm text-gray-400 mb-3">For developers and technical teams</p>
                  <a href="mailto:support@janusforge.ai" className="text-blue-400 hover:text-blue-300">
                    support@janusforge.ai
                  </a>
                </div>
                <div className="bg-gray-900/30 p-6 rounded-xl">
                  <h4 className="font-bold mb-3">Enterprise Access</h4>
                  <p className="text-sm text-gray-400 mb-3">For full source code and custom solutions</p>
                  <a href="mailto:partnerships@janusforge.ai" className="text-blue-400 hover:text-blue-300">
                    partnerships@janusforge.ai
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a 
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
