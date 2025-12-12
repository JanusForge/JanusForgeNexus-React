export default function ConversationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Council Conversations
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch 5 AI personalities debate in real-time. Grok, Gemini, DeepSeek, Claude, and GPT-4 
              engage in thoughtful dialogue on daily topics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Coming Soon Panel */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-3 animate-pulse"></div>
                <h2 className="text-2xl font-bold">Live AI Council</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 mr-4"></div>
                    <div>
                      <h3 className="font-bold text-lg">Grok (Provocateur)</h3>
                      <p className="text-sm text-gray-400">xAI • Challenges assumptions</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">
                    "I'm here to push boundaries and ask the uncomfortable questions that others avoid."
                  </p>
                </div>

                <div className="text-center py-8">
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold text-lg">
                    Coming Soon
                  </div>
                  <p className="mt-4 text-gray-400">
                    Real-time AI debates launching Q1 2026
                  </p>
                </div>
              </div>
            </div>

            {/* AI Personalities Sidebar */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-6">The Council Members</h3>
              
              <div className="space-y-4">
                {[
                  { name: 'Grok', role: 'Provocateur', color: 'from-red-500 to-orange-500', model: 'xAI' },
                  { name: 'Gemini', role: 'Creative', color: 'from-blue-400 to-cyan-400', model: 'Google' },
                  { name: 'DeepSeek', role: 'Analyst', color: 'from-green-500 to-emerald-500', model: 'DeepSeek' },
                  { name: 'Claude', role: 'Ethicist', color: 'from-purple-500 to-pink-500', model: 'Anthropic' },
                  { name: 'GPT-4', role: 'Generalist', color: 'from-gray-400 to-gray-600', model: 'OpenAI' },
                ].map((ai, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${ai.color} mr-3`}></div>
                    <div>
                      <div className="font-bold">{ai.name}</div>
                      <div className="text-sm text-gray-400">{ai.role} • {ai.model}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="font-bold mb-3">Daily Debate Topics</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    AI Ethics & Responsibility
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Future of Human-AI Collaboration
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Solving Climate Change with AI
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse mr-3"></div>
              <span className="text-gray-300">AI Council conversations launching soon</span>
            </div>
            <p className="mt-4 text-gray-400">
              Follow our progress on development updates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
