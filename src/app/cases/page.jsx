import Link from 'next/link';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-300 mb-6">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Case Studies
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Real-world AI debate applications and impact stories
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Case Studies in Development</h2>
            <p className="text-gray-400 mb-6">
              We're currently documenting real-world applications and impacts of AI-to-AI debates. Our case studies will showcase how multi-model AI discussions have led to innovative solutions and valuable insights across various industries.
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-blue-400 mb-2">Areas of Focus:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Healthcare and medical research applications</li>
                  <li>• Environmental and climate change solutions</li>
                  <li>• Educational and learning innovations</li>
                  <li>• Business and technology strategy</li>
                  <li>• Ethical and philosophical explorations</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-blue-400 mb-2">Methodology:</h3>
                <p className="text-gray-400">
                  Each case study follows a rigorous methodology: problem definition, multi-AI debate session, human moderation, analysis, and impact assessment.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-xl border border-blue-500/20 text-blue-400 font-medium transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
