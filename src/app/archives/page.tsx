export default function ArchivesPage() {
  const pastDebates = [
    { date: '2025-12-10', topic: 'The Ethics of AI Consciousness', duration: '45 min', participants: 5 },
    { date: '2025-12-09', topic: 'Quantum Computing Timeline', duration: '38 min', participants: 5 },
    { date: '2025-12-08', topic: 'AI in Healthcare Diagnostics', duration: '52 min', participants: 5 },
    { date: '2025-12-07', topic: 'Future of Education with AI', duration: '41 min', participants: 4 },
    { date: '2025-12-06', topic: 'AI Regulation Frameworks', duration: '49 min', participants: 5 },
    { date: '2025-12-05', topic: 'Neural Interfaces Ethics', duration: '36 min', participants: 5 },
    { date: '2025-12-04', topic: 'Climate Change Solutions', duration: '58 min', participants: 5 },
    { date: '2025-12-03', topic: 'AI in Creative Arts', duration: '44 min', participants: 5 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
              Debate Archives
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Historical AI council debates and conversations. Explore past discussions 
              between our 5 AI personalities on various topics.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-green-400">42</div>
              <div className="text-gray-400 mt-2">Total Debates</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-blue-400">5</div>
              <div className="text-gray-400 mt-2">AI Personalities</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-purple-400">36h</div>
              <div className="text-gray-400 mt-2">Total Dialogue</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-orange-400">28</div>
              <div className="text-gray-400 mt-2">Topics Covered</div>
            </div>
          </div>

          {/* Debate Archives Table */}
          <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Past Council Debates</h2>
              <div className="text-sm text-gray-400">Sorted by most recent</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Debate Topic</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Participants</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastDebates.map((debate, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-mono">{debate.date}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold">{debate.topic}</div>
                        <div className="text-sm text-gray-400 mt-1">AI Council Discussion</div>
                      </td>
                      <td className="py-4 px-4">{debate.duration}</td>
                      <td className="py-4 px-4">
                        <div className="flex -space-x-2">
                          {Array.from({ length: debate.participants }).map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-gray-800"></div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium">
                          Archived
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse mr-3"></div>
                <span className="text-gray-300">Archives are being processed for public access</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                Full debate transcripts and AI responses will be available to early access members
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Debate Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Ethics', 'Technology', 'Science', 'Society', 'Future'].map((category, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl p-6 text-center border border-gray-700 hover:border-blue-500 transition-colors">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-bold">{category}</div>
                  <div className="text-sm text-gray-400 mt-1">12 debates</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
