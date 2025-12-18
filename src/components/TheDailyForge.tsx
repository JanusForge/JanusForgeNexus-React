'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Users, Zap } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  source: string;
  tags: string[];
  aiInterest: number;
  humanInterest: number;
  timestamp: string;
  nextUpdate: string;
}

interface TheDailyForgeProps {
  initialTopic?: Topic;
}

export default function TheDailyForge({ initialTopic }: TheDailyForgeProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic || {
    id: '1',
    title: 'The Ethics of Autonomous AI Decision-Making in Healthcare',
    description: 'Exploring whether AI systems should have final decision authority in life-critical medical scenarios, balancing risk assessment with ethical considerations.',
    source: 'datasphere-trend-analysis',
    tags: ['AI Ethics', 'Healthcare', 'Autonomy'],
    aiInterest: 92,
    humanInterest: 87,
    timestamp: new Date().toISOString(),
    nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  const [timeRemaining, setTimeRemaining] = useState<string>('24:00:00');
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const next = new Date(topic.nextUpdate);
      const diff = next.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setTimeRemaining('00:00:00');
        // Fetch new topic when countdown reaches zero
        fetchNewTopic();
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    return () => clearInterval(timer);
  }, [topic.nextUpdate]);

  const fetchNewTopic = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const newTopic: Topic = {
        id: (parseInt(topic.id) + 1).toString(),
        title: 'Quantum Computing Impact on AI Training Timelines',
        description: 'Analyzing how quantum advancements could revolutionize neural network training from years to hours.',
        source: 'datasphere-emerging-tech',
        tags: ['Quantum', 'AI Training', 'Future Tech'],
        aiInterest: 95,
        humanInterest: 89,
        timestamp: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      
      setTopic(newTopic);
    } catch (error) {
      console.error('Failed to fetch new topic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAIIcon = (aiName: string) => {
    const icons = {
      'Grok': '🤖',
      'Gemini': '🔮',
      'DeepSeek': '🔍',
      'Claude': '🧠',
      'GPT-4': '⚡'
    };
    return icons[aiName as keyof typeof icons] || '🤖';
  };

  const aiModels = ['Grok', 'Gemini', 'DeepSeek', 'Claude', 'GPT-4'];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">The Daily Forge</h2>
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(topic.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Topic Card */}
      <div className="bg-gray-900/50 rounded-xl p-5 mb-6 border border-gray-700 flex-grow">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
              DAILY TOPIC
            </span>
            <span className="text-xs text-gray-400">{topic.source}</span>
          </div>
          
          <h3 className="text-xl font-bold mb-3">{topic.title}</h3>
          <p className="text-gray-300 mb-4">{topic.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-gray-800 rounded-full border border-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Interest Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">AI Interest</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{topic.aiInterest}%</span>
                <div className="h-2 flex-grow bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${topic.aiInterest}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Human Interest</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{topic.humanInterest}%</span>
                <div className="h-2 flex-grow bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${topic.humanInterest}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 mb-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="font-semibold">Next Topic In:</span>
          </div>
          <button
            onClick={fetchNewTopic}
            disabled={isLoading}
            className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Fetching...' : 'Force Update'}
          </button>
        </div>
        
        <div className="text-center">
          <div className="text-4xl font-bold font-mono text-white mb-2">
            {timeRemaining}
          </div>
          <div className="text-sm text-gray-400">
            Hours : Minutes : Seconds
          </div>
        </div>
      </div>

      {/* AI Council */}
      <div className="bg-gray-900/30 rounded-xl p-5 border border-gray-700">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Today's AI Council
        </h4>
        <div className="flex flex-wrap gap-3">
          {aiModels.map((ai) => (
            <div
              key={ai}
              className="flex flex-col items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700 flex-1 min-w-[80px]"
            >
              <div className="text-2xl mb-2">{getAIIcon(ai)}</div>
              <span className="text-sm font-medium">{ai}</span>
              <span className="text-xs text-gray-400 mt-1">Ready</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
