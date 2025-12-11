'use client';

import { useState } from 'react';

export default function WaitlistButton() {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    
    // For now, show an alert
    // Later: Open a modal or redirect to waitlist form
    alert('🚀 Thank you for your interest!\n\nOur waitlist will open soon. You\'ll be among the first to experience Janus Forge Nexus when we launch.');
    
    // Reset after 3 seconds
    setTimeout(() => setIsClicked(false), 3000);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isClicked}
      className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform ${
        isClicked 
          ? 'bg-gradient-to-r from-purple-800 to-blue-800 scale-95' 
          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105'
      }`}
    >
      {isClicked ? 'Thank You! 🎉' : 'Join Waitlist'}
    </button>
  );
}
