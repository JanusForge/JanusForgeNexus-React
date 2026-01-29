import { useEffect, useState } from 'react';
import { Trophy, Users, Zap } from 'lucide-react';

export default function ReferralLeaderboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/referrals`)
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-amber-500" size={24} />
        <h2 className="text-xl font-bold uppercase tracking-tighter">Sovereign Advocates</h2>
      </div>

      <div className="space-y-4">
        {data.map((advocate, index) => (
          <div key={advocate.code} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center gap-4">
              <span className="text-zinc-500 font-mono">0{index + 1}</span>
              <div>
                <p className="font-bold text-sm">{advocate.name}</p>
                <p className="text-[10px] text-indigo-400 font-mono uppercase">{advocate.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-black flex items-center gap-1">
                  <Users size={12} /> {advocate.count}
                </p>
                <p className="text-[9px] uppercase text-zinc-500">Referrals</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Zap size={16} className="text-indigo-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
