"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { Download, Printer, Share2, Search, Calendar, Upload, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface ArchiveEntry {
  id: string;
  date: string;
  winningTopic: string;
  openingThoughts: string;
}

export default function TopicArchivePage() {
  const { user, isAuthenticated } = useAuth();
  const isGodMode = (user as any)?.role === 'GOD_MODE';

  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [filtered, setFiltered] = useState<ArchiveEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/daily-forge/history`)
      .then(res => res.json())
      .then(data => {
        setArchives(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load archives", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      archives.filter((a: ArchiveEntry) =>
        a.winningTopic.toLowerCase().includes(lower)
      )
    );
  }, [search, archives]);

  const handleSavePDF = (entry: ArchiveEntry) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Janus Forge Archive", 20, 20);
    doc.setFontSize(16);
    doc.text(new Date(entry.date).toLocaleDateString(), 20, 35);
    doc.text(entry.winningTopic, 20, 50);

    let y = 70;
    try {
      const thoughts = JSON.parse(entry.openingThoughts);
      thoughts.forEach((t: any) => {
        doc.setFontSize(14);
        doc.text(`${t.model || 'Council'}:`, 20, y);
        y += 10;
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(t.content || "", 170);
        doc.text(lines, 25, y);
        y += lines.length * 7 + 10;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    } catch (e) {
      doc.text("Full transcript available on site.", 20, y);
    }

    doc.save(`Forge_Archive_${new Date(entry.date).toISOString().split('T')[0]}.pdf`);
  };

  const shareEntry = (entry: ArchiveEntry) => {
    const url = `https://janusforge.ai/archive/${entry.id}`;
    const text = `Janus Forge Archive: ${entry.winningTopic}`;
    if (navigator.share) {
      navigator.share({ title: text, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Archive link copied to clipboard!");
    }
  };

  const handleAdminUpload = async () => {
    if (!newTopic.trim() || !newContent.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-forge/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          winningTopic: newTopic,
          openingThoughts: newContent
        })
      });

      if (response.ok) {
        alert("Archive entry added!");
        setNewTopic("");
        setNewContent("");
        setShowUpload(false);
        // Refresh archives
        fetch(`${API_BASE_URL}/api/daily-forge/history`)
          .then(res => res.json())
          .then(data => setArchives(data));
      }
    } catch (err) {
      alert("Failed to add archive entry");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950/50 via-gray-900 to-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-300 mb-6">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Topic Archive
          </h1>
          <p className="text-xl text-gray-300">Historical AI Council debates</p>
        </div>

        {/* Admin Upload (GodMode only) */}
        {isGodMode && (
          <div className="mb-12 text-right">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-2 mx-auto md:mx-0"
            >
              <Upload size={18} />
              Add Manual Archive Entry
            </button>

            {showUpload && (
              <div className="mt-6 bg-gray-900/80 border border-purple-500/50 rounded-2xl p-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-purple-400">Manual Archive Entry</h3>
                  <button onClick={() => setShowUpload(false)} className="text-gray-500 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Topic Title"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 text-white"
                />
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste full conversation transcript (JSON array of {model, content} objects)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 h-64 text-white font-mono text-sm"
                />
                <button
                  onClick={handleAdminUpload}
                  className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg"
                >
                  Save to Archive
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past debates..."
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-6 py-4 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Archive List */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No archives match your search.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filtered.map((entry) => (
              <div key={entry.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                    <Calendar size={16} />
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => window.print()} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                      <Printer size={16} />
                    </button>
                    <button onClick={() => handleSavePDF(entry)} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                      <Download size={16} />
                    </button>
                    <button onClick={() => shareEntry(entry)} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
                <Link href={`/daily-forge/archive/${entry.id}`}>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors cursor-pointer">
                    {entry.winningTopic}
                  </h3>
                </Link>
                <p className="text-gray-400 mt-3 line-clamp-2">
                  {(() => {
                    try {
                      const thoughts = JSON.parse(entry.openingThoughts);
                      return thoughts[0]?.content || "Council debate transcript";
                    } catch {
                      return "Council debate transcript";
                    }
                  })()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
