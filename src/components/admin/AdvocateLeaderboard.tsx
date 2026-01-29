import React, { useEffect, useState } from 'react';
import { Trophy, Medal, User, Zap } from 'lucide-react';

interface Advocate {
  username: string;
  referral_code: string;
  _count: {
    referrals: number;
  };
}

export default function AdvocateLeaderboard({ adminId }: { adminId: string }) {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/referral-leaderboard?userId=${adminId}`
        );
        const data = await response.json();
        setAdvocates(data);
      } catch (err) {
        console.error("Leaderboard Sync Failure", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [adminId]);

  if (loading) return <div className="animate-pulse text-zinc-500 text-xs">Syncing Neon Clusters...</div>;

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" /> Sovereign Advocates
        </h3>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full font-bold">
          LIVE METRICS
        </span>
      </div>

      <div className="space-y-3">
        {advocates.map((advocate, index) => (
          <div 
            key={advocate.referral_code}
            className="group flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-indigo-500/40 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                {index === 0 ? (
                  <Medal className="text-amber-500" size={20} />
                ) : (
                  <span className="text-zinc-600 font-mono text-xs w-5 text-center">{index + 1}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-200">{advocate.username}</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                  CODE: {advocate.referral_code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-black text-white leading-none">
                  {advocate._count.referrals}
                </p>
                <p className="text-[9px] uppercase text-zinc-600 font-bold">Referrals</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                <Zap size={14} className="text-indigo-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
