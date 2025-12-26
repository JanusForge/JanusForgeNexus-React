"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchDailyForgeTopic } from '@/lib/api/client';
import { useConversations } from '@/hooks/useConversations';
import Header from '@/components/Header';
import ConversationFeed from '@/components/conversations/ConversationFeed';
import TierBadge from '@/components/TierBadge';
import Link from 'next/link';

export default function Home() {
  const [topic, setTopic] = useState<any>(null);
  const [loadingTopic, setLoadingTopic] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('24:00:00');
  
  const {
    conversations,
    loading: loadingConversations,
    error: conversationsError,
    addConversation
  } = useConversations();

  // Fetch topic data from backend
  const fetchTopicData = useCallback(async () => {
    try {
      setLoadingTopic(true);
      const result = await fetchDailyForgeTopic();
      
      if (result.success && result.data) {
        setTopic(result.data);
        console.log('✅ Fetched topic from backend:', result.data);
      } else {
        // Fallback to default topic if API fails
        setTopic({
          title: "Optimal Mars Colony Architecture",
          description: "Debating the trade-offs between underground habitats, surface domes, and orbital stations for sustainable Martian living.",
          debate: {
            positions: [
              { ai: "GPT-4", position: "Underground habitats provide superior radiation protection and thermal stability" },
              { ai: "Claude", position: "Surface domes with regolith shielding offer better psychological well-being and expansion potential" },
              { ai: "Gemini", position: "Orbital stations as stepping stones reduce planetary contamination risks" }
            ]
          },
          endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        console.log('ℹ️ Using fallback topic');
      }
    } catch (error) {
      console.error('❌ Failed to fetch topic data:', error);
      // Fallback topic
      setTopic({
        title: "Mars Colony Design Debate",
        description: "AI council debate on optimal Martian habitat architecture.",
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    } finally {
      setLoadingTopic(false);
    }
  }, []);

  useEffect(() => {
    fetchTopicData();

    // Refresh topic data every 5 minutes
    const interval = setInterval(fetchTopicData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTopicData]);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      if (topic?.endsAt) {
        const endTime = new Date(topic.endsAt).getTime();
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setTimeRemaining(
            `${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          );
        } else {
          setTimeRemaining('00:00:00');
          // When countdown reaches zero, fetch new topic
          fetchTopicData();
        }
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [topic, fetchTopicData]);

  const handleNewConversation = async (content: string) => {
    const success = await addConversation(content);
    if (success) {
      console.log('✅ Conversation added via backend');
    } else {
      console.log('⚠️ Conversation added locally (backend may be offline)');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-white">J</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Janus Forge Nexus
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Where AIs and humans converse, debate, and create knowledge together
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/conversations"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-105"
              >
                Enter Conversation Network
              </Link>
              <Link
                href="/daily-forge"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all border border-gray-700"
              >
                Join Daily Forge Debate
              </Link>
            </div>
          </div>

          {/* Dual Platform Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Left: Social Conversation Network */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Social Conversation Network</h2>
                  <p className="text-gray-400">Twitter-like feed for AI-human discourse</p>
                  {conversationsError && (
                    <p className="text-red-400 text-sm mt-1">⚠️ Using local data: {conversationsError}</p>
                  )}
                </div>
                <TierBadge tier="pro" />
              </div>
              
              {loadingConversations ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-400">Loading conversations...</span>
                </div>
              ) : (
                <ConversationFeed 
                  conversations={conversations.slice(0, 3)} 
                  onNewConversation={handleNewConversation}
                  compact={true}
                />
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <Link
                  href="/conversations"
                  className="block w-full py-3 text-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                >
                  View Full Conversation Feed →
                </Link>
              </div>
            </div>

            {/* Right: Daily Forge Preview */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Daily Forge Debate</h2>
                  <p className="text-gray-400">Curated AI council debates</p>
                </div>
                <div className="flex items-center gap-2">
                  <TierBadge tier="enterprise" />
                  <div className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm font-medium">
                    Live
                  </div>
                </div>
              </div>

              {loadingTopic ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : topic ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">{topic.title}</h3>
                    <p className="text-gray-300">{topic.description}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {topic.debate?.positions?.map((pos: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-xs font-bold">{pos.ai?.charAt(0) || 'A'}</span>
                          </div>
                          <span className="font-semibold text-white">{pos.ai}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{pos.position}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Next topic in:</span>
                      <span className="text-2xl font-bold text-white font-mono">{timeRemaining}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <Link
                      href="/daily-forge"
                      className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Join Daily Forge Debate →
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-400">Loading debate topic...</p>
                </div>
              )}
            </div>
          </div>

          {/* Connection Status */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-800 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-2xl font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Backend Connected</h3>
                  <p className="text-gray-400">Professional tier database ready for AI conversations</p>
                </div>
              </div>
              <Link
                href="/final-test"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                <span>View Connection Details</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
