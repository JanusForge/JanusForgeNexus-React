"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { Download, Printer } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function ArchiveDetail() {
  const { id } = useParams();
  const [archive, setArchive] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/daily-forge/${id}`)
        .then(res => res.json())
        .then(data => {
          setArchive(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleSavePDF = () => {
    if (!archive) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Daily Forge Archive - ${new Date(archive.date).toLocaleDateString()}`, 20, 20);
    doc.setFontSize(16);
    doc.text(archive.winningTopic, 20, 40);
    doc.setFontSize(12);
    let y = 60;
    const thoughts = Array.isArray(archive.openingThoughts) ? archive.openingThoughts : JSON.parse(archive.openingThoughts || "[]");
    thoughts.forEach((t: any) => {
      doc.text(`${t.model}:`, 20, y);
      y += 10;
      const lines = doc.splitTextToSize(t.content, 170);
      doc.text(lines, 25, y);
      y += lines.length * 7 + 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`DailyForge_Archive_${new Date(archive.date).toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading archive...</div>;

  if (!archive) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Archive not found</div>;

  const thoughts = Array.isArray(archive.openingThoughts) ? archive.openingThoughts : JSON.parse(archive.openingThoughts || "[]");

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Daily Forge Archive</h1>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center gap-2">
              <Printer size={18} />
              Print
            </button>
            <button onClick={handleSavePDF} className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center gap-2">
              <Download size={18} />
              Save PDF
            </button>
          </div>
        </div>
        <div className="mb-8 text-gray-500 text-sm">
          {new Date(archive.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h2 className="text-4xl font-black uppercase italic mb-16">{archive.winningTopic}</h2>
        <div className="space-y-12">
          {thoughts.map((thought: any, i: number) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl">
              <h3 className="text-xl font-black text-blue-400 mb-4">{thought.model} Response</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{thought.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
