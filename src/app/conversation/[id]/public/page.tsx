"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { Download, Printer, Calendar, Share2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface Post {
  id: string;
  content: string;
  is_human: boolean;
  ai_model?: string;
  user?: { username: string };
}

export default function PublicConversation() {
  const { id } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("Janus Forge Shared Conversation");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/api/conversations/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.conversation.title || "Shared Conversation");
        setPosts(data.conversation.posts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load conversation", err);
        setLoading(false);
      });
  }, [id]);

  const handleSavePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    doc.text("Janus Forge Nexus — Public Share", 20, 35);

    let y = 50;
    posts.forEach((p) => {
      const name = p.is_human ? (p.user?.username || 'Architect') : (p.ai_model || 'Council');
      doc.setFontSize(14);
      doc.text(`${name}:`, 20, y);
      y += 10;
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(p.content, 170);
      doc.text(lines, 25, y);
      y += lines.length * 7 + 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading shared conversation...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Conversation not found or empty</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950/50 via-gray-900 to-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl text-gray-300 mb-8">Shared from Janus Forge Nexus</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button onClick={() => window.print()} className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <Printer size={18} />
            Print
          </button>
          <button onClick={handleSavePDF} className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 flex items-center gap-2">
            <Download size={18} />
            Save PDF
          </button>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
          }} className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <Share2 size={18} />
            Copy Link
          </button>
        </div>

        <div className="grid gap-8">
          {posts.map((p) => (
            <div key={p.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-lg">
                  {p.is_human ? (p.user?.username?.[0] || 'A') : (p.ai_model?.[0] || 'C')}
                </div>
                <h3 className="text-xl font-bold text-purple-400">
                  {p.is_human ? (p.user?.username || 'Architect') : p.ai_model || 'Council Member'}
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{p.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
