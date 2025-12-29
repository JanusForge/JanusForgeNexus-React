"use client";

import React, { useState } from 'react';
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Globe,
  Link,
  Printer,
  FileText,
  Mail
} from 'lucide-react';

interface ShareDropdownProps {
  conversationText: string;
  username: string;
}

const ShareDropdown = ({ conversationText, username }: ShareDropdownProps) => {
  const referralLink = "https://www.janusforge.ai";
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = (platform: string) => {
    const shareText = `Architect ${username} just forged a new decree at the Janus Forge Nexus. \n\n`;
    const encodedText = encodeURIComponent(shareText + referralLink);
    const encodedUrl = encodeURIComponent(referralLink);

    const shareLinks: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(shareText)}`
    };

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank');
    }
    setIsOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle border border-blue-500/20 hover:border-blue-400 transition-all"
        type="button"
      >
        <Share2 className="w-5 h-5 text-blue-400" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[90] bg-transparent" 
            onClick={() => setIsOpen(false)}
          ></div>

          <ul className="absolute right-0 mt-2 p-3 shadow-2xl bg-slate-900 rounded-xl w-64 border border-blue-500/40 z-[100] animate-in fade-in zoom-in duration-200">
            <li className="text-blue-400 uppercase text-[10px] tracking-widest mb-2 font-bold px-4 list-none">
              Transmit to the World
            </li>

            <div className="grid grid-cols-2 gap-1 mb-2 px-2">
              <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"><Twitter className="w-4 h-4 text-sky-400"/> X</button>
              <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"><Linkedin className="w-4 h-4 text-blue-600"/> LinkedIn</button>
              <button onClick={() => handleShare('facebook')} className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"><Facebook className="w-4 h-4 text-blue-500"/> Facebook</button>
              <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"><MessageCircle className="w-4 h-4 text-green-500"/> WhatsApp</button>
              <button onClick={() => handleShare('reddit')} className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"><Globe className="w-4 h-4 text-orange-500"/> Reddit</button>
              <button onClick={copyToClipboard} className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white">
                <Link className="w-4 h-4 text-gray-400"/> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="border-t border-white/10 my-2 mx-2"></div>
            
            <li className="text-gray-500 uppercase text-[10px] tracking-widest mb-1 px-4 list-none font-bold">Archive Decree</li>

            <div className="flex flex-col gap-1 px-2">
              <button onClick={() => window.print()} className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"><Printer className="w-4 h-4"/> Print / PDF</button>
              <button className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"><FileText className="w-4 h-4 text-green-500"/> Export .DOCX</button>
              <a href={`mailto:?subject=Nexus Decree&body=${encodeURIComponent(conversationText)}`} className="flex items-center gap-2 text-[11px] py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white">
                <Mail className="w-4 h-4"/> Email Transcript
              </a>
            </div>
          </ul>
        </>
      )}
    </div>
  );
};

export default ShareDropdown;
