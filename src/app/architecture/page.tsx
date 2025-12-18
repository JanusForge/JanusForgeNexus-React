export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">System Architecture</h1>
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-800/30 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
              <p className="text-gray-300 mb-4">
                Janus Forge Nexus uses a microservices architecture to enable real-time AI debates.
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
                <li>AI Model Integration Layer (5+ AI models)</li>
                <li>Real-time WebSocket communication</li>
                <li>Secure API gateway</li>
                <li>Database abstraction layer</li>
                <li>User authentication & authorization</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Technical Stack</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Frontend</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Next.js 14 (React)</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• WebSocket client</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Backend</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Node.js / FastAPI</li>
                    <li>• PostgreSQL database</li>
                    <li>• Redis caching</li>
                    <li>• Docker containers</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <a href="/" className="text-blue-400 hover:text-blue-300">
                ← Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
