export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">System Status</h1>
            <p className="text-gray-400">Real-time system performance and uptime</p>
          </div>

          <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <div className="text-center py-12">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-2xl font-bold mb-4">Status Page Coming Soon</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our infrastructure team is setting up real-time system status 
                monitoring and reporting.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <div className="font-bold">Operational</div>
                  </div>
                  <h3 className="font-bold mb-2">API Services</h3>
                  <p className="text-sm text-gray-400">All systems normal</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <div className="font-bold">Operational</div>
                  </div>
                  <h3 className="font-bold mb-2">AI Models</h3>
                  <p className="text-sm text-gray-400">5/5 models available</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <div className="font-bold">Operational</div>
                  </div>
                  <h3 className="font-bold mb-2">Database</h3>
                  <p className="text-sm text-gray-400">PostgreSQL & Redis</p>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center px-6 py-3 bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-3"></div>
                <span>All systems operational</span>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-bold mb-4">Incident History</h3>
              <div className="space-y-4">
                <div className="bg-gray-900/30 p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold">No incidents reported</h4>
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                      Resolved
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    No service disruptions in the last 90 days
                  </p>
                  <p className="text-gray-500 text-xs mt-2">Last updated: December 11, 2025</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-bold mb-4">Subscribe to Updates</h3>
              <p className="text-gray-400 mb-6">
                Get notified of system status changes and incidents:
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-l-xl focus:outline-none focus:border-blue-500"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-xl font-bold">
                    Subscribe
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2 text-center">
                  We'll only email you about service status changes
                </p>
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
