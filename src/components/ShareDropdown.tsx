"use client";

import React from 'react';
import {
  Twitter, Facebook, Linkedin, MessageCircle, Globe, Link, Printer, FileText, Mail, X
} from 'lucide-react';

interface ShareDropdownProps {
  conversationText: string;
  username: string;
  setIsOpen: (val: boolean) => void; // Parent controls this now
}

const ShareDropdown = ({ conversationText, username, setIsOpen }: ShareDropdownProps) => {
  const referralLink = "https://www.janusforge.ai";

  const handleShare = (platform: string) => {
    const shareText = `Architect ${username} just forged a new decree at the Janus Forge Nexus. \n\n`;
    const encodedText = encodeURIComponent(shareText + referralLink);
    const shareLinks: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
      reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent(shareText)}`
    };
    if (shareLinks[platform]) window.open(shareLinks[platform], '_blank');
  };

  const handleEmailShare = () => {
    const safeBody = conversationText.length > 1500 ? conversationText.substring(0, 1500) + "..." : conversationText;
    window.location.href = `mailto:?subject=Nexus Decree&body=${encodeURIComponent(safeBody)}`;
  };

  return (
    <div className="h-full bg-slate-900 border-l border-blue-500/20 p-4 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
        <span className="text-blue-400 uppercase text-[10px] font-black tracking-widest">Transmit Hub</span>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
          <X size={16}/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => handleShare('twitter')} className="flex items-center gap-3 text-[11px] py-2 px-3 bg-white/5 hover:bg-blue-500/20 rounded-lg text-white transition-all"><Twitter size={14} className="text-sky-400"/> X / Twitter</button>
          <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 text-[11px] py-2 px-3 bg-white/5 hover:bg-green-500/20 rounded-lg text-white transition-all"><MessageCircle size={14} className="text-green-500"/> WhatsApp</button>
          <button onClick={() => handleShare('reddit')} className="flex items-center gap-3 text-[11px] py-2 px-3 bg-white/5 hover:bg-orange-500/20 rounded-lg text-white transition-all"><Globe size={14} className="text-orange-400"/> Reddit</button>
        </div>

        <div className="border-t border-white/10 my-2"></div>
        <span className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Archive</span>

        <div className="flex flex-col gap-2">
          <button onClick={handleEmailShare} className="flex items-center gap-3 text-[11px] py-2 px-3 bg-white/5 hover:bg-purple-500/20 rounded-lg text-white transition-all"><Mail size={14} className="text-purple-400"/> Email</button>
          <button onClick={() => window.print()} className="flex items-center gap-3 text-[11px] py-2 px-3 bg-white/5 hover:bg-gray-500/20 rounded-lg text-white transition-all"><Printer size={14}/> Print PDF</button>
          <button className="flex items-center gap-3 text-[11px] py-2 px-3 bg-white/5 hover:bg-green-500/20 rounded-lg text-white transition-all"><FileText size={14} className="text-green-500"/> DOCX</button>
        </div>
      </div>
    </div>
  );
};

export default ShareDropdown;
