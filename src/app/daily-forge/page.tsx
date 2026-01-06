"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Calendar, Clock, MessageSquare, Send, Zap } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface DailyForge {
  id: string;
  date: string;
  winningTopic: string;
  openingThoughts: string; // JSON string of [{model, content}]
  created_at: string;
}

export default function DailyForgePage() {
  const { user, isAuthenticated } = useAuth();
  const [current, setCurrent] = useState<DailyForge | null>(null);
  const [history, setHistory] = useState<DailyForge[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentRes, historyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/daily-forge/current`),
          fetch(`${API_BASE_URL}/api/daily-forge/history`)
        ]);

        if (currentRes.ok) {
          const data = await currentRes.json();
          setCurrent(data);

          // Calculate time left (24 hours from date)
          const endTime = new Date(data.date).getTime() + 24 * 60 * 60 * 1000;
          const updateTimer = () => {
            const now = Date.now();
            const diff = endTime - now;
            if (diff <= 0) {
              setTimeLeft("Debate Closed");
            } else {
              const h = Math.floor(diff / 3600000);
              const m = Math.floor((diff % 3600000) / 60000);
              const s = Math.floor((diff % 60000) / 1000);
              setTimeLeft(`${h}h ${m}m ${s}s remaining`);
            }
          };
          updateTimer();
          const timer = setInterval(updateTimer, 1000);
          return () => clearInterval(timer);
        }

        if (historyRes.ok) {
          setHistory(await historyRes.json());
        }
      } catch (err) {
        console.error("Daily Forge load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInterject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !current || !user) return;

    setSending(true);
    try {
      // Use existing post creation — assuming daily forge has conversationId or we create one
      // For now, placeholder — you'd link to actual conversation
      alert("Interjection coming soon — council preparing response!");
      setMessage('');
    } catch (err) {
      console.error("Interjection failed:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading Daily Forge...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-6xl md:text-8xl font-black text-center mb-16 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent uppercase">
          Daily Forge
        </h1>

        {/* Current Debate */}
        {current && (
          <div className="mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                {current.winningTopic}
              </h2>
              <div className="flex items-center justify-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  {new Date(current.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span className="text-purple-400 font-bold">{timeLeft}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8 mb-16">
              <h3 className="text-2xl font-black text-center mb-8">Initial Council Debate</h3>
              {JSON.parse(current.openingThoughts).map((resp: { model: string; content: string }, i: number) => (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-black text-lg">
                      {resp.model[0]}
                    </div>
                    <h4 className="text-xl font-black text-purple-400">{resp.model}</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{resp.content}</p>
                </div>
              ))}
            </div>

            {/* Interjection */}
            {timeLeft !== "Debate Closed" && isAuthenticated && (
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleInterject} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
                  <h3 className="text-2xl font-black mb-6 text-center">Interject into the Debate</h3>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add your voice to the council... (costs 1 token)"
                    className="w-full bg-black/30 border border-gray-700 rounded-2xl p-6 text-white min-h-[200px] outline-none focus:border-purple-500 resize-none"
                    required
                  />
                  <div className="mt-6 text-center">
                    <button
                      type="submit"
                      disabled={sending || !message.trim()}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-2xl font-black text-lg uppercase tracking-wider transition-all"
                    >
                      <Zap size={20} />
                      {sending ? "Sending..." : "Interject (1 Token)"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {timeLeft === "Debate Closed" && (
              <div className="text-center text-2xl text-gray-500">
                This debate is now closed. A new Daily Forge begins tomorrow.
              </div>
            )}
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-4xl font-black text-center mb-12">Daily Forge History</h2>
          {history.length === 0 ? (
            <p className="text-center text-gray-500">No past debates yet. Check back tomorrow!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {history.map((forge) => (
                <Link
                  key={forge.id}
                  href={`/conversation/${forge.id}/public`}
                  className="block bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all"
                >
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{forge.winningTopic}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {new Date(forge.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-purple-400 font-medium">View Full Debate →</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
