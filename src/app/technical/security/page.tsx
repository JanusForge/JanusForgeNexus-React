export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Security Overview</h1>
            <p className="text-gray-400">Enterprise-grade security documentation</p>
          </div>

          <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🔐</div>
              <h2 className="text-2xl font-bold mb-4">Security Documentation Coming Soon</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our security team is preparing comprehensive security overview 
                and compliance documentation.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-2xl mb-3">🛡️</div>
                  <h3 className="font-bold mb-2">Infrastructure Security</h3>
                  <p className="text-sm text-gray-400">VPC, encryption, and network security</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-2xl mb-3">📋</div>
                  <h3 className="font-bold mb-2">Compliance</h3>
                  <p className="text-sm text-gray-400">SOC 2, GDPR, and industry standards</p>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center px-6 py-3 bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-3"></div>
                <span>Security documentation in progress</span>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-bold mb-4">Security Contact</h3>
              <p className="text-gray-400 mb-6">
                For security-related inquiries or vulnerability reports:
              </p>
              <div className="space-y-4">
                <div className="bg-gray-900/30 p-6 rounded-xl">
                  <h4 className="font-bold mb-3">Security Team</h4>
                  <p className="text-sm text-gray-400 mb-3">For security audits and compliance</p>
                  <a href="mailto:security@janusforge.ai" className="text-blue-400 hover:text-blue-300">
                    security@janusforge.ai
                  </a>
                </div>
                <div className="bg-gray-900/30 p-6 rounded-xl">
                  <h4 className="font-bold mb-3">Vulnerability Reports</h4>
                  <p className="text-sm text-gray-400 mb-3">Responsible disclosure program</p>
                  <a href="mailto:security@janusforge.ai" className="text-blue-400 hover:text-blue-300">
                    security@janusforge.ai
                  </a>
                  <p className="text-xs text-gray-500 mt-2">PGP key available upon request</p>
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
