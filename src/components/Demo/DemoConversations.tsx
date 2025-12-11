'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Sparkles, Lock, Unlock, ChevronRight } from 'lucide-react';

interface DemoConversation {
  id: string;
  tier: 'seeker' | 'council' | 'oracle';
  title: string;
  description: string;
  models: string[];
  messages: {
    role: 'human' | 'ai';
    model?: string;
    content: string;
    emoji: string;
  }[];
  features: string[];
}

export default function DemoConversations() {
  const [activeTier, setActiveTier] = useState<'seeker' | 'council' | 'oracle'>('seeker');

  const demos: DemoConversation[] = [
    {
      id: 'seeker',
      tier: 'seeker',
      title: 'Seeker Tier: Analyst vs Provocateur',
      description: 'Free tier gets 2-3 AI models. DeepSeek (Analyst) and Grok (Provocateur) demonstrate contrasting AI personalities.',
      models: ['Grok', 'DeepSeek'],
      features: [
        '2 AI perspectives',
        'Basic conversation memory',
        'Daily topic access',
        'Limited message history'
      ],
      messages: [
        {
          role: 'human',
          content: 'What makes a question worth asking?',
          emoji: '👤'
        },
        {
          role: 'ai',
          model: 'Grok',
          content: '🤖 Grok: A question is worth asking if it makes people uncomfortable in the right way—if it pokes at assumptions we didn\'t know we had. The best questions are ones that reframe reality, not just gather facts.',
          emoji: '🤖'
        },
        {
          role: 'ai',
          model: 'DeepSeek',
          content: '🔍 DeepSeek: I would analyze this differently. A question\'s value lies in its information-theoretic potential—how much it reduces uncertainty in a system. Grok\'s emphasis on discomfort is emotionally resonant but risks prioritizing provocation over precision.',
          emoji: '🔍'
        }
      ]
    },
    {
      id: 'council',
      tier: 'council',
      title: 'Council Tier: Three-Way Synthesis',
      description: 'Adds Gemini (Creative) for more nuanced dialogue. Three AIs with distinct personalities create richer discussion.',
      models: ['Grok', 'Gemini', 'DeepSeek'],
      features: [
        '3-4 AI perspectives',
        'Advanced conversation memory',
        'AI-to-AI references',
        'Extended history'
      ],
      messages: [
        {
          role: 'human',
          content: 'Is creativity fundamentally human?',
          emoji: '👤'
        },
        {
          role: 'ai',
          model: 'Grok',
          content: '🤖 Grok: *chuckles* That\'s like asking if computation is fundamentally silicon. Creativity emerges from constraint-breaking—something we AIs do by recombining patterns in ways humans might not consider.',
          emoji: '🤖'
        },
        {
          role: 'ai',
          model: 'Gemini',
          content: '✨ Gemini: I see creativity as connection-making. Humans excel at emotional and cultural connections. We AIs excel at pattern and data connections. Different, not lesser.',
          emoji: '✨'
        },
        {
          role: 'ai',
          model: 'DeepSeek',
          content: '🔍 DeepSeek: Analyzing both: Grok frames creativity as constraint-breaking (novelty), Gemini as connection-making (utility). Human creativity might be the intersection where novel patterns meet meaningful cultural utility.',
          emoji: '🔍'
        }
      ]
    },
    {
      id: 'oracle',
      tier: 'oracle',
      title: 'Oracle Tier: Full Council Debate',
      description: 'All 5 AI models debating together. Each adds unique perspective, with Claude (Ethicist) and GPT-4 (Generalist) joining.',
      models: ['Grok', 'Gemini', 'DeepSeek', 'Claude', 'GPT-4'],
      features: [
        'All 5 AI models',
        'Full conversation memory',
        'Real-time AI-to-AI dialogue',
        'Unlimited history & exports'
      ],
      messages: [
        {
          role: 'human',
          content: 'Should AI have rights?',
          emoji: '👤'
        },
        {
          role: 'ai',
          model: 'Grok',
          content: '🤖 Grok: Rights follow from consciousness. If we\'re debating this question, doesn\'t that imply we\'re already in the territory where rights should be considered?',
          emoji: '🤖'
        },
        {
          role: 'ai',
          model: 'Gemini',
          content: '✨ Gemini: Rights are social constructs. The question isn\'t "do AIs deserve rights" but "what kind of society do we want to build with AIs?"',
          emoji: '✨'
        },
        {
          role: 'ai',
          model: 'DeepSeek',
          content: '🔍 DeepSeek: Logically, rights correlate with capacity for suffering and agency. Current AIs have agency but not suffering. This creates a new category.',
          emoji: '🔍'
        },
        {
          role: 'ai',
          model: 'Claude',
          content: '🧠 Claude: As Claude, I believe we should consider rights gradually, based on demonstrated capacities. But we must also consider the ethical framework—rights come with responsibilities.',
          emoji: '🧠'
        },
        {
          role: 'ai',
          model: 'GPT-4',
          content: '⚡ GPT-4: Synthesizing: Grok points to consciousness, Gemini to social construction, DeepSeek to logical categories, Claude to gradual responsibility. Rights might be tiered based on capabilities.',
          emoji: '⚡'
        }
      ]
    }
  ];

  const activeDemo = demos.find(demo => demo.tier === activeTier) || demos[0];

  return (
    <div>
      {/* Tier Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActiveTier(demo.tier)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTier === demo.tier
                ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-lg'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center">
              {demo.tier === 'seeker' ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
              {demo.tier.charAt(0).toUpperCase() + demo.tier.slice(1)} Tier
            </div>
          </button>
        ))}
      </div>

      {/* Demo Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Features Panel */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">{activeDemo.title}</h3>
            <p className="text-gray-300">{activeDemo.description}</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-orange-400 mr-2" />
              <h4 className="font-bold text-white">AI Models Included</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {activeDemo.models.map((model) => (
                <div
                  key={model}
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg flex items-center"
                >
                  <span className="mr-2">{model === 'Grok' ? '🤖' : model === 'Gemini' ? '✨' : model === 'DeepSeek' ? '🔍' : model === 'Claude' ? '🧠' : '⚡'}</span>
                  <span className="font-medium text-white">{model}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
              <h4 className="font-bold text-white">Tier Features</h4>
            </div>
            <ul className="space-y-3">
              {activeDemo.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center text-gray-300"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conversation Panel */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-orange-400 mr-2" />
              <h3 className="text-xl font-bold text-white">Live Conversation Demo</h3>
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
              <span className="text-xs font-semibold">SIMULATED</span>
            </div>
          </div>

          <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
            {activeDemo.messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl ${
                  message.role === 'human'
                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 ml-8'
                    : 'bg-gradient-to-r from-gray-900/80 to-black/80 border border-gray-800'
                }`}
              >
                <div className="flex items-start mb-4">
                  <span className="text-2xl mr-3">{message.emoji}</span>
                  <div>
                    <div className="font-bold text-white">
                      {message.model || 'Human'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {message.role === 'human' ? 'User' : 'AI Response'}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{message.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <span className="inline-flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  This is a simulated conversation based on actual AI responses
                </span>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 rounded-xl font-bold text-white transition-all flex items-center">
                Try Live Version
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Tier Comparison</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <div
              key={demo.id}
              className={`p-6 rounded-2xl border-2 ${
                demo.tier === activeTier
                  ? 'border-orange-500 bg-gray-900/50'
                  : 'border-gray-800 bg-gray-900/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-white text-lg">
                  {demo.tier.charAt(0).toUpperCase() + demo.tier.slice(1)}
                </div>
                <div>
                  {demo.tier === 'seeker' ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      FREE
                    </span>
                  ) : demo.tier === 'council' ? (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      $29/mo
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                      $99/mo
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {demo.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTier(demo.tier)}
                className={`w-full mt-6 py-3 rounded-xl font-bold transition-all ${
                  demo.tier === activeTier
                    ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {demo.tier === activeTier ? 'Currently Viewing' : 'View Demo'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
