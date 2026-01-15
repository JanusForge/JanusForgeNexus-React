"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, X, ShieldAlert } from 'lucide-react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function BroadcastToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });

    // 📡 Listen for the Authority Broadcast
    socket.on('nexus:broadcast', (data: { message: string }) => {
      setMessage(data.message);
      // Auto-hide after 10 seconds
      setTimeout(() => setMessage(null), 10000);
    });

    return () => { socket.disconnect(); };
  }, []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[9999] w-96"
        >
          <div className="bg-black border-2 border-indigo-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(79,70,229,0.3)] backdrop-blur-xl relative overflow-hidden">
            {/* Background Pulse Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -z-10 animate-pulse" />
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/40">
                <Radio className="text-white animate-pulse" size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-2">
                    <ShieldAlert size={12} /> Master Broadcast
                  </span>
                  <button onClick={() => setMessage(null)} className="text-zinc-600 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-white text-sm font-medium leading-relaxed tracking-tight">
                  {message}
                </p>
              </div>
            </div>
            
            {/* Cinematic Progress Bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: 0 }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-indigo-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
