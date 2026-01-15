"use client";
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Send, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ConversationInput({ onSend }: { onSend: (message: string) => void }) {
  // ✅ REMOVED isAuthenticated from destructuring
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const isAuthenticated = !!user;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isAuthenticated) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
       {/* ... Input UI Logic ... */}
       <form onSubmit={handleSubmit}>
         <input 
           value={message} 
           onChange={(e) => setMessage(e.target.value)}
           placeholder="Command the Council..."
           className="w-full bg-zinc-900/50 border border-white/5 rounded-[2rem] py-6 px-8"
         />
       </form>
    </div>
  );
}
