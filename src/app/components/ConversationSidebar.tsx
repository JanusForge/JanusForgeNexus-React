'use client';
import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Clock,
  ChevronLeft,
  Search,
  MoreVertical,
  Edit3,
  FileText,
  Trash2,
  Share2,
  Download,
  Link as LinkIcon,
  Printer,
  FileCode
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import jsPDF from 'jspdf';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  note?: string;
}

export default function ConversationSidebar({
  onSelectConversation,
  currentConversationId,
  isOpen,
  onToggle
}: {
  onSelectConversation: (id: string) => void;
  currentConversationId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Menu & modal state
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [notingId, setNotingId] = useState<string | null>(null);
  const [notingText, setNotingText] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/conversations/user?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
          setFilteredConversations(data);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user]);

  // Live search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = conversations.filter(conv =>
      conv.title.toLowerCase().includes(lowerQuery) ||
      conv.preview.toLowerCase().includes(lowerQuery)
    );
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  // === NEW ACTION: RAW TXT DOWNLOAD ===
  const handleDownloadTxt = async (conv: Conversation) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/conversations/${conv.id}`);
      const data = await res.json();
      const content = data.conversation.posts.map((p: any) => 
        `[${p.is_human ? 'ARCHITECT' : p.ai_model || 'COUNCIL'}]\n${p.content}\n`
      ).join('\n---\n\n');
      
      const element = document.createElement("a");
      const file = new Blob([content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Janus-Synthesis-${conv.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  // === NEW ACTION: PRINT ===
  const handlePrint = () => {
    window.print();
  };

  const handleRename = async (id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => c.id === id ? {...c, title: newTitle} : c));
    await fetch(`${API_BASE_URL}/api/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    await fetch(`${API_BASE_URL}/api/conversations/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    if (currentConversationId === id) onSelectConversation('');
  };

  const handleExportPDF = async (conv: Conversation) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/conversations/${conv.id}`);
      const data = await res.json();
      const posts = data.conversation.posts;
      const doc = new jsPDF();
      let y = 20;
      doc.setFontSize(22);
      doc.text(conv.title, 20, y);
      y += 15;
      posts.forEach((p: any) => {
        const name = p.is_human ? 'Architect' : p.ai_model || 'Council';
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`${name}:`, 20, y);
        y += 7;
        doc.setTextColor(0);
        const lines = doc.splitTextToSize(p.content, 170);
        doc.text(lines, 25, y);
        y += lines.length * 7 + 10;
        if (y > 270) { doc.addPage(); y = 20; }
      });
      doc.save(`${conv.title}.pdf`);
    } catch (err) { console.error(err); }
  };

  const handleCopyLink = (convId: string) => {
    const publicLink = `${window.location.origin}/share/${convId}`;
    navigator.clipboard.writeText(publicLink);
    alert("Public link copied!");
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={onToggle} />}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Neural History</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredConversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => { onSelectConversation(conv.id); onToggle(); }}
                  className={`w-full p-4 text-left rounded-xl transition-all border ${currentConversationId === conv.id ? 'bg-blue-600/10 border-blue-500/40' : 'bg-transparent border-transparent hover:bg-zinc-900'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-xs truncate pr-6">{conv.title}</h3>
                    <span className="text-[9px] text-zinc-600 uppercase font-mono">{formatDate(conv.timestamp)}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">{conv.preview}</p>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpenFor(menuOpenFor === conv.id ? null : conv.id); }}
                  className="absolute right-2 top-4 p-1 text-zinc-600 hover:text-white"
                >
                  <MoreVertical size={14} />
                </button>

                {menuOpenFor === conv.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-2 text-[10px] font-black uppercase tracking-tighter">
                    <button onClick={() => { setEditingId(conv.id); setEditingTitle(conv.title); setMenuOpenFor(null); }} className="flex items-center gap-3 w-full p-2 hover:bg-zinc-800 rounded-lg text-zinc-400"><Edit3 size={12} /> Rename</button>
                    <button onClick={() => handlePrint()} className="flex items-center gap-3 w-full p-2 hover:bg-zinc-800 rounded-lg text-zinc-400"><Printer size={12} /> Print Synthesis</button>
                    <button onClick={() => { setSharingId(conv.id); setMenuOpenFor(null); }} className="flex items-center gap-3 w-full p-2 hover:bg-zinc-800 rounded-lg text-blue-400"><Share2 size={12} /> Share / Save</button>
                    <div className="h-[1px] bg-zinc-800 my-1" />
                    <button onClick={() => setDeletingId(conv.id)} className="flex items-center gap-3 w-full p-2 hover:bg-red-950 text-red-500 rounded-lg"><Trash2 size={12} /> Delete</button>
                  </div>
                )}

                {/* SHARE MODAL */}
                {sharingId === conv.id && (
                  <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setSharingId(null)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
                      <Share2 className="mx-auto mb-4 text-blue-500" size={32} />
                      <h3 className="text-lg font-black uppercase italic mb-6">Distribute Synthesis</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => handleExportPDF(conv)} className="flex items-center justify-center gap-3 bg-zinc-800 p-4 rounded-2xl hover:bg-zinc-700 transition-all text-[10px] font-black uppercase tracking-widest"><Download size={16} /> Export PDF</button>
                        <button onClick={() => handleDownloadTxt(conv)} className="flex items-center justify-center gap-3 bg-zinc-800 p-4 rounded-2xl hover:bg-zinc-700 transition-all text-[10px] font-black uppercase tracking-widest"><FileCode size={16} /> Download .TXT</button>
                        <button onClick={() => handleCopyLink(conv.id)} className="flex items-center justify-center gap-3 bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 transition-all text-[10px] font-black uppercase tracking-widest"><LinkIcon size={16} /> Copy Public Link</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
