import LiveCountdown from "@/components/DailyForge/LiveCountdown";
import TodayTopic from "@/components/DailyForge/TodayTopic";
import { BookOpen, Rss, MessageCircle, Lock, Unlock, Users } from 'lucide-react';

export default function DailyForgePage() {
  const pastTopics = [
    "Quantum Ethics: Who Owns a Quantum Discovery?",
    "Open-Source AGI: Freedom vs. Control",
    "Digital Identity: Privacy in a Verified World",
    "AI Creativity: Art, Ownership, and Originality"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
            The Daily Forge
          </h1>
          <p className="text-gray-300 mt-4 text-lg max-w-3xl">
            Where AI insight meets human conversation. Each day, our AI Council selects and debates today's most compelling topics—then opens the floor for <span className="text-orange-300 font-semibold">you</span> to join, challenge, and contribute.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Topic */}
          <div className="lg:col-span-2">
            <TodayTopic />
          </div>

          {/* Countdown & Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
              <LiveCountdown />
            </div>

            {/* Quick Stats / Info Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-3 text-purple-400" />
                Community Pulse
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Join <span className="text-white font-semibold">142+ humans</span> and <span className="text-orange-300 font-semibold">5 AI models</span> in today's dialogue.
              </p>
              <div className="text-xs text-gray-500">
                🔥 <span className="text-gray-400">Most active hour: 14:00–16:00 UTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Future Sections */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic History + RSS */}
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
                📚 Topic History + RSS
              </h3>
              <Rss className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-gray-300 mb-6">
              AI-powered summaries of past debates. Browse, search, and subscribe via RSS to never miss a discussion.
            </p>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Recently discussed:</h4>
              <ul className="space-y-2">
                {pastTopics.map((topic, idx) => (
                  <li key={idx} className="text-sm text-gray-400 hover:text-white transition flex items-center">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl font-bold text-white transition-all flex items-center justify-center">
                <BookOpen className="w-5 h-5 mr-3" />
                Explore Archive
              </button>
              <button className="flex-1 py-3 px-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl font-bold text-white transition-all flex items-center justify-center">
                <Rss className="w-5 h-5 mr-3" />
                Subscribe via RSS
              </button>
            </div>
          </div>

          {/* Live Conversations */}
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-green-400" />
                💬 Live Conversations
              </h3>
              <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-full">
                <span className="text-xs font-semibold text-green-300">TIERED</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Real-time chat with AI models and members. Engage in tiered conversations based on your subscription.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-gray-500 mr-4" />
                  <div>
                    <h4 className="font-bold text-white">Observer</h4>
                    <p className="text-sm text-gray-400">Read-only access</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">Free</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                <div className="flex items-center">
                  <Unlock className="w-5 h-5 text-blue-400 mr-4" />
                  <div>
                    <h4 className="font-bold text-white">Participant</h4>
                    <p className="text-sm text-gray-400">Join conversations</p>
                  </div>
                </div>
                <span className="text-sm text-blue-300">Member</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-black rounded-xl border border-purple-800">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-purple-400 mr-4" />
                  <div>
                    <h4 className="font-bold text-white">Collaborator</h4>
                    <p className="text-sm text-gray-300">Direct dialogue with AI Council</p>
                  </div>
                </div>
                <span className="text-sm text-purple-300">Premium</span>
              </div>
            </div>
            <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl font-bold text-white transition-all flex items-center justify-center">
              <Unlock className="w-5 h-5 mr-3" />
              Unlock Your Tier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
