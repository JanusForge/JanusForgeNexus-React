"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Calendar, Clock, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface DailyForge {
  id: string;
  date: string;
  scoutedTopics: string;
  winningTopic: string;
  openingThoughts: string;
  councilVotes: string;
  phase: string;
  created_at: string;
  conversationId?: string; // Optional for interjection
}

export default function DailyForgePage() {
  const { user, isAuthenticated } = useAuth();
  const [currentForge, setCurrentForge] = useState<DailyForge | null>(null);
  const [history, setHistory] = useState<DailyForge[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentRes = await fetch(`${API_BASE_URL}/api/daily-forge/current`);
        if (currentRes.ok) {
          const current = await currentRes.json();
          setCurrentForge(current);
          const now = new Date().getTime();
          const end = new Date(current.date).getTime() + 24 * 60 * 60 * 1000; // 24 hours after date
          setTimeLeft(end - now);
        }

        const historyRes = await fetch(`${API_BASE_URL}/api/daily-forge/history`);
        if (historyRes.ok) {
          setHistory(await historyRes.json());
        }
      } catch (err) {
        console.error('Daily Forge fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1000 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleInterject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentForge) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/conversations/${currentForge.conversationId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message, userId: user?.id })
      });
      if (res.ok) {
        setMessage('');
      }
    } catch (err) {
      console.error('Interjection error:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading Daily Forge...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-5xl md:text-6xl font-black mb-12 text-center bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase">
          Daily Forge
        </h1>

        {/* Current Debate */}
        {currentForge && (
          <div className="mb-24">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-2">{currentForge.winningTopic}</h2>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Calendar size={16} />
                {new Date(currentForge.date).toLocaleDateString()}
                <Clock size={16} />
                <span className="text-purple-400">{timeLeft > 0 ? formatTime(timeLeft) : 'Closed'}</span>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 mb-8">
              <h3 className="text-xl font-bold mb-4">Initial Council Debate</h3>
              <div className="space-y-6">
                {JSON.parse(currentForge.openingThoughts).map((resp: { model: string; content: string }, idx: number) => (
                  <div key={idx} className="p-4 bg-black/30 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">{resp.model}</h4>
                    <p className="text-gray-300 whitespace-pre-wrap">{resp.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interjection */}
            {timeLeft > 0 && isAuthenticated && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-4">Join the Debate</h3>
                <form onSubmit={handleInterject} className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add your insight to the council..."
                    className="w-full bg-black/30 border border-gray-700 rounded-xl p-4 text-white min-h-[150px] outline-none focus:border-purple-500"
                  />
                  <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-black text-xs uppercase tracking-[0.2em]">
                    Interject (1 Token)
                  </button>
                </form>
              </div>
            )}

            {timeLeft <= 0 && (
              <div className="text-center text-gray-400">
                Debate closed. View history below.
              </div>
            )}
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-3xl font-black mb-8">Daily Forge History</h2>
          <div className="space-y-6">
            {history.map((forge) => (
              <div key={forge.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-2">{forge.winningTopic}</h3>
                <p className="text-gray-400 mb-4">{new Date(forge.date).toLocaleDateString()}</p>
                <Link href={`/conversation/${forge.id}/public`} className="text-purple-400 hover:text-purple-300">
                  View Full Debate
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
