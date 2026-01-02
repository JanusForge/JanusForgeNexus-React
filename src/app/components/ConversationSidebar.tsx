'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  MoreVertical,
  Edit3,
  FileText,
  Trash2,
  Share2,
  Download,
  Link as LinkIcon
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
      conv.preview.toLowerCase().includes(lowerQuery) ||
      (conv.note && conv.note.toLowerCase().includes(lowerQuery))
    );
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Actions
  const handleRename = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => c.id === id ? {...c, title: newTitle} : c));
    setEditingId(null);
  };

  const handleAddNote = (id: string, note: string) => {
    setConversations(prev => prev.map(c => c.id === id ? {...c, note} : c));
    setNotingId(null);
  };

  const handleDelete = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setDeletingId(null);
    if (currentConversationId === id) {
      onSelectConversation('');
    }
  };

  const handleExportPDF = async (conv: Conversation) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/conversations/${conv.id}`);
    if (!res.ok) throw new Error("Failed to load thread");

    const data = await res.json();
    const posts = data.conversation.posts;

    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(20);
    doc.text(conv.title || "Janus Forge Nexus Synthesis", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Date: ${new Date(conv.timestamp).toLocaleDateString()}`, 20, y);
    y += 10;
    doc.text("Janus Forge Nexus — Thesis. Antithesis. Humanity.", 20, y);
    y += 15;

    posts.forEach((p: any) => {
      const name = p.is_human ? 'Architect' : p.ai_model || 'Council';
      doc.setFontSize(14);
      doc.text(`${name}:`, 20, y);
      y += 8;
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(p.content, 170);
      doc.text(lines, 25, y);
      y += lines.length * 7 + 10;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${conv.title.replace(/[^a-z0-9]/gi, '_') || 'synthesis'}.pdf`);
  } catch (err) {
    alert("Failed to generate full PDF — using preview version");
    // Fallback to preview
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(conv.title, 20, 20);
    doc.setFontSize(12);
    doc.text("Janus Forge Nexus Synthesis", 20, 30);
    doc.text(new Date().toLocaleDateString(), 20, 40);
    doc.text(conv.preview, 20, 60, { maxWidth: 170 });
    doc.save(`${conv.title.replace(/[^a-z0-9]/gi, '_') || 'synthesis'}.pdf`);
  }
};  


  const handleCopyLink = (convId: string) => {
    const publicLink = `${window.location.origin}/share/${convId}`;
    navigator.clipboard.writeText(publicLink);
    alert("Public link copied to clipboard!");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                Your Syntheses
              </h2>
              <button
                onClick={onToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-pulse">Loading history...</div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-700" />
                <p>{searchQuery ? 'No matches found' : 'No conversations yet'}</p>
                {!searchQuery && <p className="text-sm mt-2">Start one on the main panel →</p>}
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredConversations.map((conv) => (
                  <div key={conv.id} className="relative group">
                    {/* Main clickable row */}
                    <button
                      onClick={() => {
                        onSelectConversation(conv.id);
                        onToggle(); // Close on mobile
                      }}
                      className={`w-full p-4 text-left transition-all hover:bg-gray-800/50 cursor-pointer focus:outline-none ${
                        currentConversationId === conv.id ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        {editingId === conv.id ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleRename(conv.id, editingTitle)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename(conv.id, editingTitle)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            className="bg-gray-800/50 border border-blue-500 rounded px-2 py-1 text-white"
                          />
                        ) : (
                          <h3 className="font-bold text-white truncate pr-8 group-hover:text-blue-300 transition-colors">
                            {conv.title}
                          </h3>
                        )}
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          <Clock size={12} className="inline mr-1" />
                          {formatDate(new Date(conv.timestamp))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                        {conv.preview}
                      </p>
                      {conv.note && (
                        <p className="text-xs text-blue-400 mt-2 italic">
                          Note: {conv.note}
                        </p>
                      )}
                    </button>

                    {/* Context Menu */}
                    <div className="absolute right-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenFor(menuOpenFor === conv.id ? null : conv.id);
                        }}
                        className="p-2 hover:bg-gray-800 rounded-lg"
                      >
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>

                      {menuOpenFor === conv.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(conv.id);
                              setEditingTitle(conv.title);
                              setMenuOpenFor(null);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3 text-sm"
                          >
                            <Edit3 size={16} />
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotingId(conv.id);
                              setNotingText(conv.note || '');
                              setMenuOpenFor(null);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3 text-sm"
                          >
                            <FileText size={16} />
                            {conv.note ? 'Edit Note' : 'Add Note'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSharingId(conv.id);
                              setMenuOpenFor(null);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3 text-sm"
                          >
                            <Share2 size={16} />
                            Share Thread
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingId(conv.id);
                              setMenuOpenFor(null);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-red-900/50 flex items-center gap-3 text-sm text-red-400"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Share Modal */}
                    {sharingId === conv.id && (
                      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSharingId(null)}>
                        <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-bold mb-4">Share "{conv.title}"</h3>
                          <div className="space-y-4">
                            <button
                              onClick={() => handleExportPDF(conv)}
                              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-3 font-bold"
                            >
                              <Download size={18} />
                              Export as PDF
                            </button>
                            <button
                              onClick={() => handleCopyLink(conv.id)}
                              className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center justify-center gap-3 font-bold"
                            >
                              <LinkIcon size={18} />
                              Copy Public Link
                            </button>
                          </div>
                          <button
                            onClick={() => setSharingId(null)}
                            className="w-full mt-4 py-2 bg-gray-800 rounded-lg"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Note Modal */}
                    {notingId === conv.id && (
                      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setNotingId(null)}>
                        <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-bold mb-4">Add Note</h3>
                          <textarea
                            value={notingText}
                            onChange={(e) => setNotingText(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white min-h-[120px]"
                            placeholder="Your personal note..."
                          />
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleAddNote(conv.id, notingText)}
                              className="flex-1 py-2 bg-blue-600 rounded-lg font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setNotingId(null)}
                              className="flex-1 py-2 bg-gray-800 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delete Confirmation */}
                    {deletingId === conv.id && (
                      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setDeletingId(null)}>
                        <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-bold mb-4 text-red-400">Delete Conversation?</h3>
                          <p className="text-gray-400 mb-6">
                            This will permanently delete "{conv.title}". This cannot be undone.
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleDelete(conv.id)}
                              className="flex-1 py-2 bg-red-600 rounded-lg font-bold"
                            >
                              Delete Forever
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="flex-1 py-2 bg-gray-800 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
