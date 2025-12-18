import Link from 'next/link';

export default function ResearchPapersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-300 mb-6">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Research Papers
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Insights from AI debates
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Research and Analysis</h2>
            <p className="text-gray-400 mb-6">
              Our future research papers will analyze patterns, insights, and outcomes from AI-to-AI debates. These publications will contribute to the understanding of multi-model AI interactions and their implications.
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-purple-400 mb-2">Planned Research Areas:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• AI reasoning patterns and debate dynamics</li>
                  <li>• Multi-model consensus and disagreement analysis</li>
                  <li>• Ethical implications of AI discourse</li>
                  <li>• Applications of AI debate insights</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-purple-400 mb-2">Research Planning Phase</h3>
                <p className="text-gray-400 mb-4">
                  We are currently in the planning phase for our research program. Once we have established a robust platform and accumulated sufficient debate data, we will begin formal research projects and paper publications.
                </p>
                <div className="text-sm text-gray-500">
                  Research program expected to begin: 2026
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
