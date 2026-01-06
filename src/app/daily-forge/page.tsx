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
      // Placeholder — replace with actual socket emit when ready
      alert("Interjection sent! The council is preparing a response...");
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
        <p className="text-2xl">Forging today's debate...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-6xl md:text-8xl font-black text-center mb-16 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent uppercase">
          Daily Forge
        </h1>

        {/* Current Debate */}
        {current && (
          <div className="mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight max-w-4xl mx-auto">
                {current.winningTopic}
              </h2>
              <div className="flex items-center justify-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  {new Date(current.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span className="text-purple-400 font-bold text-xl">{timeLeft}</span>
                </div>
              </div>
            </div>

            <div className="space-y-12 mb-16">
              <h3 className="text-2xl font-black text-center mb-8">Initial Council Debate</h3>
              {JSON.parse(current.openingThoughts).map((resp: { model: string; content: string }, i: number) => (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-black text-lg">
                      {resp.model[0]}
                    </div>
                    <h4 className="text-2xl font-black text-purple-400">{resp.model}</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">{resp.content}</p>
                </div>
              ))}
            </div>

            {/* Interjection */}
            {timeLeft !== "Debate Closed" && isAuthenticated && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-3xl p-12">
                  <h3 className="text-3xl font-black text-center mb-8">Interject into the Debate</h3>
                  <form onSubmit={handleInterject} className="space-y-6">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Challenge the council. Add your insight. Shape the synthesis... (costs 1 token)"
                      className="w-full bg-black/50 border border-gray-700 rounded-2xl p-6 text-white min-h-[200px] outline-none focus:border-purple-500 resize-none text-lg"
                      required
                    />
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={sending || !message.trim()}
                        className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 rounded-2xl font-black text-xl uppercase tracking-wider transition-all shadow-2xl shadow-purple-900/50"
                      >
                        <Zap size={24} />
                        {sending ? "Sending..." : "Interject (1 Token)"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {timeLeft === "Debate Closed" && (
              <div className="text-center py-16">
                <p className="text-3xl text-gray-500">This Daily Forge is now closed.</p>
                <p className="text-xl text-gray-400 mt-4">A new debate begins tomorrow at midnight.</p>
              </div>
            )}
          </div>
        )}

        {/* History */}
        <div className="mt-32">
          <h2 className="text-5xl font-black text-center mb-16">Daily Forge History</h2>
          {history.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500">No past debates yet.</p>
              <p className="text-xl text-gray-400 mt-4">The first Daily Forge begins soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((forge) => (
                <Link
                  key={forge.id}
                  href={`/conversation/${forge.id}/public`}
                  className="block bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all group"
                >
                  <h3 className="text-xl font-bold mb-4 line-clamp-3 group-hover:text-purple-400 transition-colors">
                    {forge.winningTopic}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {new Date(forge.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-purple-400 font-bold group-hover:text-purple-300 transition-colors">
                    View Debate →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
