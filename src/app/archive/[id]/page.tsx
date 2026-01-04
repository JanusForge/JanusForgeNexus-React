"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { Download, Printer, Calendar } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function ArchiveDetailPage() {
  const { id } = useParams();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/archives/${id}`)
      .then(res => res.json())
      .then(data => {
        setEntry(data);
        setLoading(false);
      });
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
        doc.text(`${t.model}:`, 20, y);
        y += 10;
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(t.content, 170);
        doc.text(lines, 25, y);
        y += lines.length * 7 + 10;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    } catch {
      doc.text("Transcript available on site.", 20, y);
    }

    doc.save(`Forge_${entry.winningTopic.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!entry) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Not found</div>;

  const thoughts = JSON.parse(entry.openingThoughts);

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-black mb-8">{entry.winningTopic}</h1>
        <p className="text-gray-500 mb-12 flex items-center gap-2">
          <Calendar size={16} />
          {new Date(entry.date).toLocaleDateString()}
        </p>
        <div className="flex gap-4 mb-12">
          <button onClick={() => window.print()} className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <Printer size={18} />
            Print
          </button>
          <button onClick={handleSavePDF} className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 flex items-center gap-2">
            <Download size={18} />
            Save PDF
          </button>
        </div>
        <div className="space-y-8">
          {thoughts.map((t: any, i: number) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-purple-400 mb-4">{t.model} Response</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{t.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
