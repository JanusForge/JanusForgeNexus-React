// src/app/page.tsx (Frontend)
"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/components/auth/AuthProvider';
// ... other imports ...

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);

  // 1. Socket Setup
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket']
    });

    socketRef.current.on('post:incoming', (msg) => {
      setConversation(prev => [msg, ...prev]);
    });

    socketRef.current.on('ai:response', (aiMsg) => {
      setConversation(prev => [aiMsg, ...prev]);
      setIsSending(false); // SUCCESS EXIT: Reset button
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  // 2. Sending Logic with Safety Timeout
  const handleSendMessage = () => {
    if (!userMessage.trim() || isSending || !isAuthenticated) return;

    setIsSending(true);

    // SAFETY EXIT: Reset button if no response after 8 seconds
    const timeout = setTimeout(() => {
      setIsSending(false);
    }, 8000);

    const payload = {
      content: userMessage,
      name: (user as any)?.username || (user as any)?.name || 'Anonymous',
      tier: user?.tier || 'free',
      conversationId: 'home-preview'
    };

    socketRef.current?.emit('post:new', payload);
    setUserMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ... rest of the render code (identical to your last version) ...
  return (
    // Ensure you use onKeyDown={handleKeyDown} on your textarea
    // and {isSending ? 'AI Council Thinking...' : 'Post'} on your button
  );
}
