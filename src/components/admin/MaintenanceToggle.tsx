"use client";
import { useState, useEffect } from 'react';
import { Power, ShieldAlert, Loader2 } from 'lucide-react';

const MASTER_ID = '550e8400-e29b-41d4-a716-446655440000';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export function MaintenanceToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMaintenance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/maintenance-toggle`, {
        method: 'POST',
        headers: {
          'x-user-id': MASTER_ID,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setIsEnabled(data.isMaintenanceMode);
    } catch (err) {
      console.error("Failed to toggle maintenance mode", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${
      isEnabled 
        ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
        : 'bg-zinc-900/50 border-white/5 shadow-2xl'
    }`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
            <ShieldAlert className={isEnabled ? "text-red-500" : "text-zinc-500"} size={20} />
            Kill Switch
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {isEnabled ? "Protocol: Total Lockdown" : "Protocol: Open Forge"}
          </p>
        </div>

        <button
          onClick={toggleMaintenance}
          disabled={loading}
          className={`relative w-20 h-10 rounded-full transition-colors duration-300 flex items-center px-1 ${
            isEnabled ? 'bg-red-600' : 'bg-zinc-800'
          }`}
        >
          <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-300 ${
            isEnabled ? 'translate-x-10' : 'translate-x-0'
          }`}>
            {loading ? <Loader2 size={14} className="animate-spin text-black" /> : <Power size={14} className="text-black" />}
          </div>
        </button>
      </div>
      
      {isEnabled && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl animate-pulse">
          <p className="text-[10px] font-black text-red-500 uppercase text-center tracking-tighter">
            Warning: Synthesis is currently restricted to Master Authority only.
          </p>
        </div>
      )}
    </div>
  );
}
