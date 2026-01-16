"use client";
export const dynamic = "force-dynamic";

import Link from 'next/link';

export default function TopicSuggestionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-300 mb-6">
            <span className="text-3xl">💡</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            Topic Suggestions
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Propose debate subjects
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-300">Submit Your Ideas</h2>
            <p className="text-gray-400 mb-6">
              Help shape our AI debates by suggesting topics for discussion. We welcome proposals from our community on important, thought-provoking, and complex subjects for AI analysis.
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-green-400 mb-2">Topic Criteria:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Complex issues with multiple perspectives</li>
                  <li>• Current events and emerging trends</li>
                  <li>• Ethical dilemmas and philosophical questions</li>
                  <li>• Future-oriented and forward-thinking subjects</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h3 className="font-semibold text-green-400 mb-2">Submission System Coming Soon</h3>
                <p className="text-gray-400 mb-4">
                  Our topic suggestion system is currently being developed. Soon you'll be able to submit, vote on, and track community-suggested debate topics.
                </p>
                <div className="text-sm text-gray-500">
                  Available: January 2026
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
