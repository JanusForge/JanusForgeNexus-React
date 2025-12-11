'use client';

import { motion } from 'framer-motion';

export default function VeteranBadge() {
  return (
    <motion.div
      className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white text-sm font-semibold shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mr-2">🎖️</div>
      <span>Veteran Owned & Operated</span>
      <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
    </motion.div>
  );
}
