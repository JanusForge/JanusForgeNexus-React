"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Download, Printer, FileText, Image as ImageIcon } from 'lucide-react'; // ✅ New icons
import html2canvas from 'html2canvas'; // ✅ Ensure you run: npm install html2canvas

export default function PublicSynthesisReport() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await fetch(`https://janusforgenexus-backend.onrender.com/api/nexus/public/${slug}`);
        const result = await res.json();
        if (res.ok) setData(result);
      } catch (err) {
        console.error("Link recovery failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [slug]);

  /**
   * 🖼️ SAVE TO DEVICE: High-Fidelity Image Export
   */
  const handleImageExport = async () => {
    const element = document.getElementById('report-capture-area');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 2, // Higher resolution for professional sharing
      logging: false,
      useCORS: true
    });
    
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `JanusForge-Nexus-Report-${slug}.png`;
    link.click();
  };

  /**
   * 📄 PRINT & PDF PROTOCOL: Native System Dialogue
   */
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-zinc-500 uppercase tracking-widest">Synchronizing...</div>;
  if (!data) return <div className="h-screen bg-black flex items-center justify-center text-red-500 uppercase tracking-widest">Link Invalid</div>;

  return (
    <main className="min-h-screen bg-black text-white py-20 px-8 flex flex-col items-center overflow-y-auto">
      
      {/* 🛠️ CONTROL SUITE: Hidden during print */}
      <div className="flex flex-wrap justify-center gap-4 mb-16 no-print">
        <button onClick={handleImageExport} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-indigo-500/20 transition-all group">
          <ImageIcon size={16} className="text-indigo-400" />
          <span className="text-[9pt] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-200">Save Image</span>
        </button>

        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-indigo-500/20 transition-all group">
          <Printer size={16} className="text-indigo-400" />
          <span className="text-[9pt] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-200">Print / Save PDF</span>
        </button>
      </div>

      {/* 🏛️ REPORT CAPTURE AREA: What actually gets saved/printed */}
      <div id="report-capture-area" className="w-full max-w-5xl flex flex-col items-center bg-black p-4 md:p-10 rounded-[3rem]">
        
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-12 bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
          Janus Forge Nexus® Report
        </h2>

        <div className="w-full max-w-4xl bg-zinc-900/40 border border-white/5 p-12 rounded-[2.5rem] backdrop-blur-3xl mb-16 text-center shadow-2xl">
          <p className="text-zinc-500 uppercase tracking-[0.5em] text-[10pt] mb-4 italic">Strategic Objective</p>
          <h1 className="text-2xl font-light text-white italic">"{data.prompt}"</h1>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.results.map((res: any, i: number) => (
            <div key={i} className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] backdrop-blur-3xl shadow-2xl">
              <h3 className="text-[9pt] font-black uppercase tracking-[0.3em] text-indigo-400 italic mb-4">
                {res.model} Protocol
              </h3>
              <p className="text-zinc-300 font-light leading-relaxed text-sm whitespace-pre-wrap">
                {res.response}
              </p>
            </div>
          ))}
        </div>

        <footer className="mt-20 opacity-30 text-[8pt] font-black uppercase tracking-widest text-center">
          Generated via Janus Forge Nexus® Synthesis Engine<br/>
          <span className="mt-2 block text-[6pt]">Authentication ID: {data._id}</span>
        </footer>
      </div>

      {/* CSS Boundary for Print Mode */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          #report-capture-area { background: white !important; padding: 0 !important; box-shadow: none !important; }
          .backdrop-blur-3xl { backdrop-filter: none !important; background: #f4f4f5 !important; border: 1px solid #e4e4e7 !important; }
          h2, h1 { color: black !important; background: none !important; -webkit-text-fill-color: initial !important; }
          .text-indigo-400 { color: #4338ca !important; }
          .text-zinc-300, .text-zinc-500 { color: #3f3f46 !important; }
        }
      `}</style>
    </main>
  );
}
