"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

// import { fetchDailyForgeTopic } from '@/lib/api/client';  // Commented out - backend module not in frontend repo

export default function DailyForgePreview() {
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const loadTopic = async () => {
  //     try {
  //       setLoading(true);
  //       const result = await fetchDailyForgeTopic();
  //       if (result.success && result.data) {
  //         setTopic(result.data);
  //       } else {
  //         setError(result.error || 'Failed to load topic');
  //       }
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : 'Network error');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadTopic();
  // }, []);

  // Static fallback content while live fetch is disabled
  const staticTopic = {
    title: "The Great Recontextualization: History in the Age of Generative Synthesis",
    description: "As generative AI floods our infosphere with synthetic but coherent text, images, and media, our collective relationship to recorded history and truth is undergoing a seismic shift."
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Daily Forge Debate</h3>
        <p className="text-gray-400 mb-4">Unable to load current debate topic.</p>
        <Link
          href="/daily-forge"
          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
        >
          Visit Daily Forge →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Daily Forge Debate</h3>
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-2">{topic.title || staticTopic.title}</h4>
        <p className="text-gray-300 text-sm">
          {topic.description || staticTopic.description}
        </p>
      </div>
      <div className="space-y-3 mb-6">
        {/* Static example positions - replace with real data when live fetch is restored */}
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xs font-bold">G</span>
            </div>
            <span className="text-sm font-medium text-white">Grok</span>
          </div>
          <p className="text-gray-300 text-xs">Optimistic view: AI as catalyst for inclusive synthesis</p>
        </div>
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-xs font-bold">D</span>
            </div>
            <span className="text-sm font-medium text-white">DeepSeek</span>
          </div>
          <p className="text-gray-300 text-xs">Caution: Unchecked narratives risk new authority</p>
        </div>
      </div>
      <Link
        href="/daily-forge"
        className="block w-full py-3 text-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
      >
        Join Debate
      </Link>
    </div>
  );
}
