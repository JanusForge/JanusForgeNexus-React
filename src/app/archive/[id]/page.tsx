"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { Download, Printer, Calendar } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface ArchiveEntry {
  id: string;
  date: string;
  winningTopic: string;
  openingThoughts: string;
}

export default function ArchiveDetailPage() {
  const { id } = useParams();
  const [entry, setEntry] = useState<ArchiveEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/archives/${id}`)
        .then(res => res.json())
        .then(data => {
          setEntry(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load archive entry", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSavePDF = () => {
    if (!entry) return;
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
    } catch {
      doc.text("Full transcript available.", 20, y);
    }

    doc.save(`Forge_Archive_${entry.winningTopic.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading archive...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Archive not found</p>
      </div>
    );
  }

  const thoughts = JSON.parse(entry.openingThoughts);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950/50 via-gray-900 to-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            {entry.winningTopic}
          </h1>
          <div className="flex items-center justify-center gap-3 text-gray-500 text-sm mb-8">
            <Calendar size={16} />
            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
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
        </div>

        <div className="grid gap-8">
          {thoughts.map((t: any, i: number) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-purple-400 mb-4">{t.model || 'Council'} Response</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{t.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
