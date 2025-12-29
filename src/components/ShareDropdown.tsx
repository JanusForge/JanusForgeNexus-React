import React, { useState } from 'react';
import { 
  Share2, FileText, Printer, Mail, Twitter, Linkedin, 
  Facebook, MessageCircle, Link, Globe 
} from 'lucide-react';

const ShareDropdown = ({ conversationText, username }) => {
  const referralLink = "https://www.janusforge.ai";
  const [copied, setCopied] = useState(false);

  const handleShare = (platform) => {
    const shareText = `Architect ${username} just forged a new decree at the Janus Forge Nexus. \n\n`;
    const encodedText = encodeURIComponent(shareText + referralLink);
    const encodedUrl = encodeURIComponent(referralLink);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent("Decree from Janus Forge")}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle border border-blue-500/20 hover:border-blue-400 transition-all">
        <Share2 className="w-5 h-5 text-blue-400" />
      </label>
      
      <ul tabIndex={0} className="dropdown-content menu p-3 shadow-2xl bg-slate-900 rounded-xl w-64 border border-blue-500/40 z-[100]">
        <li className="menu-title text-blue-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Transmit to the World</li>
        
        {/* Social Grid */}
        <div className="grid grid-cols-2 gap-1 mb-2">
          <li><button onClick={() => handleShare('twitter')} className="text-xs py-2"><Twitter className="w-4 h-4 text-sky-400"/> X / Twitter</button></li>
          <li><button onClick={() => handleShare('linkedin')} className="text-xs py-2"><Linkedin className="w-4 h-4 text-blue-600"/> LinkedIn</button></li>
          <li><button onClick={() => handleShare('facebook')} className="text-xs py-2"><Facebook className="w-4 h-4 text-blue-500"/> Facebook</button></li>
          <li><button onClick={() => handleShare('whatsapp')} className="text-xs py-2"><MessageCircle className="w-4 h-4 text-green-500"/> WhatsApp</button></li>
          <li><button onClick={() => handleShare('reddit')} className="text-xs py-2"><Globe className="w-4 h-4 text-orange-500"/> Reddit</button></li>
          <li><button onClick={copyToClipboard} className="text-xs py-2">
            <Link className="w-4 h-4 text-gray-400"/> {copied ? 'Copied!' : 'Copy Link'}
          </button></li>
        </div>

        <div className="divider my-1 opacity-20"></div>
        <li className="menu-title text-gray-500 uppercase text-[10px] tracking-widest mb-1">Archive Decree</li>
        
        <li><button onClick={() => window.print()} className="text-xs"><Printer className="w-4 h-4"/> Print / PDF</button></li>
        {/* We'll hook the docx logic we discussed earlier into this button */}
        <li><button className="text-xs"><FileText className="w-4 h-4 text-green-500"/> Export .DOCX</button></li>
        <li><a href={`mailto:?subject=Nexus Decree&body=${encodeURIComponent(conversationText)}`} className="text-xs">
          <Mail className="w-4 h-4"/> Email Transcript
        </a></li>
      </ul>
    </div>
  );
};

export default ShareDropdown;
