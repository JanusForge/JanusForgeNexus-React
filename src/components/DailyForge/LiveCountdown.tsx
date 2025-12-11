'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LiveCountdownProps {
  resetTime?: string; // "00:00:00" UTC
}

export default function LiveCountdown({ resetTime = "00:00:00" }: LiveCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  function calculateTimeLeft() {
    const now = new Date();
    const [hours, minutes, seconds] = resetTime.split(':').map(Number);
    
    const reset = new Date(now);
    reset.setUTCHours(hours, minutes, seconds, 0);
    
    if (reset < now) {
      reset.setUTCDate(reset.getUTCDate() + 1);
    }
    
    return reset.getTime() - now.getTime();
  }

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [resetTime]);

  if (!isClient) {
    return (
      <div className="h-32 bg-gray-900/50 rounded-xl animate-pulse" />
    );
  }

  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const timeUnits = [
    { value: hours, label: 'Hours', color: 'from-orange-500 to-orange-600' },
    { value: minutes, label: 'Minutes', color: 'from-purple-500 to-purple-600' },
    { value: seconds, label: 'Seconds', color: 'from-blue-500 to-blue-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Next Topic In</h3>
          <p className="text-gray-400 text-sm">Daily reset at {resetTime} UTC</p>
        </div>
        <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
          <span className="text-xs font-semibold">LIVE</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 md:gap-8">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`text-5xl md:text-7xl font-bold bg-gradient-to-b ${unit.color} bg-clip-text text-transparent`}>
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-gray-400 text-sm mt-2">{unit.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            <span>Topic selected by AI Council</span>
          </div>
          <div className="mx-4">•</div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <span>Based on datasphere trends</span>
          </div>
        </div>
      </div>
    </div>
  );
}
