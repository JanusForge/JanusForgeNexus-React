export default function PrivacyPage() {
  const pageTitle="Privacy"
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{pageTitle}</h1>
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-800/30 rounded-xl p-8">
              <p className="text-gray-300 mb-6">
                This page contains the  policy for Janus Forge Nexus.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">Policy Details</h2>
              <p className="text-gray-300 mb-4">
                Detailed  information will be available here soon.
              </p>
              <p className="text-gray-400 text-sm mt-8">
                For immediate questions, contact: legal@janusforge.ai
              </p>
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
