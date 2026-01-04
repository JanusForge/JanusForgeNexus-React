import Link from 'next/link';
export default function TopicArchivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950/50 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-300 mb-6">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Topic Archive
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Historical AI Council debates
          </p>
        </div>
        {/* Content Placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Archive of AI Debates</h2>
            <p className="text-gray-400 mb-6">
              Browse through past AI debates and conversations. Our archive includes transcripts, summaries, and analysis of previous AI-to-AI discussions across a wide range of topics.
            </p>
            <div className="space-y-6">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                Searchbar goes here
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
