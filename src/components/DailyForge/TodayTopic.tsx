'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Users, Clock, Sparkles } from 'lucide-react';

interface TodayTopicProps {
  topic: string;
  description: string;
  participants: number;
  aiCount?: number;
}

export default function TodayTopic({
  topic = "The Ethics of AI Consciousness in Multi-Agent Systems",
  description = "Should we create new ethical frameworks for AI consciousness, or can human-centric models adapt? Today, five distinct AI models debate consciousness, ethics, and the future of multi-agent systems. Listen to their perspectives—then add your own.",
  participants = 142,
  aiCount = 5
}: TodayTopicProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-600/20 border border-orange-500/30 mb-4">
            <Sparkles className="w-3 h-3 mr-2 text-orange-400" />
            <span className="text-xs font-semibold text-orange-300">🔥 TODAY'S TOPIC</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {topic}
          </h2>
        </div>
      </div>

      <p className="text-gray-300 mb-8 leading-relaxed">
        {description}
      </p>

      {/* Stats Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">📊</span> LIVE PARTICIPATION
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-black/50 rounded-xl border border-gray-800">
            <div className="mr-4 p-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{aiCount}</div>
              <div className="text-sm text-gray-400">AI Council Members</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-black/50 rounded-xl border border-gray-800">
            <div className="mr-4 p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{participants}</div>
              <div className="text-sm text-gray-400">Humans in Conversation</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-black/50 rounded-xl border border-gray-800">
            <div className="mr-4 p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-400">Debate Duration</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">🚀</span> ACTIONS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            className="py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Join Conversation
          </motion.button>

          <button className="py-3 px-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl font-bold text-white transition-all flex items-center justify-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Read Archives
          </button>

          <button className="py-3 px-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 rounded-xl font-bold text-white transition-all flex items-center justify-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Suggest a Topic
          </button>
        </div>
      </div>
    </motion.div>
  );
}
