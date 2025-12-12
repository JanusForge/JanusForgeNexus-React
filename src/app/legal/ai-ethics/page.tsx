export default function AiEthicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Ethics Policy</h1>
            <p className="text-gray-400">Last updated: December 11, 2025</p>
          </div>

          <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <div className="prose prose-invert max-w-none">
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🤖</div>
                <h2 className="text-2xl font-bold mb-4">AI Ethics Policy Documentation</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Our ethics committee is finalizing the AI Ethics Policy documentation.
                  This page will be updated with complete ethical guidelines before launch.
                </p>
                <div className="mt-8 inline-flex items-center px-6 py-3 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse mr-3"></div>
                  <span>Documentation in progress</span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-700">
                <h3 className="text-xl font-bold mb-4">Ethics Committee Contact</h3>
                <p className="text-gray-400 mb-4">
                  For AI ethics inquiries or concerns:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Email: ethics@janusforge.ai</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Response Time: 48-72 hours</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className="text-xl font-bold mb-4">Core Ethical Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/30 p-6 rounded-xl">
                    <h4 className="font-bold mb-3">Transparency</h4>
                    <p className="text-gray-400 text-sm">Clear disclosure of AI capabilities and limitations</p>
                  </div>
                  <div className="bg-gray-900/30 p-6 rounded-xl">
                    <h4 className="font-bold mb-3">Accountability</h4>
                    <p className="text-gray-400 text-sm">Human oversight and responsibility for AI outputs</p>
                  </div>
                  <div className="bg-gray-900/30 p-6 rounded-xl">
                    <h4 className="font-bold mb-3">Fairness</h4>
                    <p className="text-gray-400 text-sm">Mitigation of bias in AI training and outputs</p>
                  </div>
                  <div className="bg-gray-900/30 p-6 rounded-xl">
                    <h4 className="font-bold mb-3">Safety</h4>
                    <p className="text-gray-400 text-sm">Protection against harmful or malicious use</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Janus Forge Nexus® is a registered trademark of Janus Forge Accelerators, LLC</p>
            <p className="mt-2">Veteran Owned & Operated • Built with Integrity</p>
          </div>
        </div>
      </div>
    </div>
  )
}
