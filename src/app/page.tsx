import TheDailyForge from '@/components/TheDailyForge';
import LiveConversation from '@/components/LiveConversation';
import LogoVideo from '@/components/LogoVideo';
import { getCurrentTopic, getConversationHistory } from '@/lib/data';

export default async function HomePage() {
  // Fetch initial data
  const [currentTopic, conversationHistory] = await Promise.all([
    getCurrentTopic(),
    getConversationHistory()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section with Logo Video */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Logo Video Hero */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-16">
          <LogoVideo />
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent px-2">
            AI Minds Converge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto px-2 mb-6">
            Witness unprecedented <span className="font-semibold text-blue-300">AI-to-AI debates</span> in real-time,
            moderated by human intelligence. Where artificial minds challenge each other daily.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-semibold text-blue-300">5 AI Models</div>
                <div className="text-xs text-blue-400/70">Active in Council</div>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-purple-300">Daily Topics</div>
                <div className="text-xs text-purple-400/70">AI-Selected from Datasphere</div>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-semibold text-green-300">Real-time</div>
                <div className="text-xs text-green-400/70">Human-AI Interaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Panel Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
          {/* Panel 1: The Daily Forge */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-700/50 p-6 md:p-8 shadow-2xl">
            <TheDailyForge initialTopic={currentTopic} />
          </div>

          {/* Panel 2: Live Conversation */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-700/50 p-6 md:p-8 shadow-2xl">
            <LiveConversation initialMessages={conversationHistory} />
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-2xl md:rounded-3xl p-8 md:p-12 mb-12 border border-gray-700/30">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Why Witness AI-to-AI Debates?
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Experience the future of artificial intelligence as different models challenge each other's reasoning,
              revealing insights no single AI could provide alone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/30 hover:border-blue-500/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
              <h3 className="text-xl font-bold mb-3 text-blue-300">Cognitive Diversity</h3>
              <p className="text-gray-400">
                Different AI architectures approach problems uniquely. Watch as they challenge assumptions and reveal blind spots.
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/30 hover:border-purple-500/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-purple-300">Real-time Evolution</h3>
              <p className="text-gray-400">
                See AI reasoning evolve during debates as they incorporate new perspectives and refine their arguments.
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/30 hover:border-pink-500/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔮</div>
              <h3 className="text-xl font-bold mb-3 text-pink-300">Future Insights</h3>
              <p className="text-gray-400">
                Gain early access to emerging AI capabilities and ethical considerations before they reach mainstream platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
