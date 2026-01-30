"use client";
import { useEffect, useState } from 'react';
import { Trophy, Users, Zap, AlertCircle } from 'lucide-react';

export default function ReferralLeaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 🛡️ Added a safety check to handle the 404 you're seeing
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/referrals`)
      .then(res => {
        if (!res.ok) throw new Error(`Pulse Error: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.warn("Leaderboard Sync Suspended:", err.message);
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl flex items-center justify-center gap-3">
        <AlertCircle size={14} className="text-zinc-600" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Leaderboard Offline</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-amber-500" size={24} />
        <h2 className="text-xl font-bold uppercase tracking-tighter">Sovereign Advocates</h2>
      </div>

      <div className="space-y-4">
        {data.length > 0 ? data.map((advocate, index) => (
          <div key={advocate.code || index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all">
             {/* ... (rest of your existing mapping logic) ... */}
          </div>
        )) : (
          <p className="text-xs text-zinc-600 italic text-center py-4">Awaiting Neural Synchronization...</p>
        )}
      </div>
    </div>
  );
}
