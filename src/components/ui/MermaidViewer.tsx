"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Download } from 'lucide-react'; // Ensure lucide-react is installed
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#fff',
    lineColor: '#6366f1',
    mainBkg: '#09090b',
    tertiaryColor: '#1e1b4b'
  }
});

export default function MermaidViewer({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (chart) {
        try {
          setError(false);
          const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
          const { svg: renderedSvg } = await mermaid.render(id, chart);
          setSvg(renderedSvg);
        } catch (err) {
          console.error("Mermaid Render Error:", err);
          setError(true);
        }
      }
    };
    renderChart();
  }, [chart]);

  // 🏛️ EXPORT LOGIC
  const handleDownload = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `janus-forge-logic-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p className="text-[10px] font-mono text-red-400">[!] Visual Synthesis Failure</p>
      </div>
    );
  }

  return (
    <div className="group relative my-4 w-full bg-zinc-950/40 p-6 rounded-3xl border border-white/5 shadow-inner transition-all hover:border-indigo-500/30">
      {/* 📥 Download Button - Visible on Hover */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 p-2 bg-zinc-900 border border-white/10 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
      >
        <Download size={14} /> Export SVG
      </button>

      <div 
        className="flex justify-center overflow-x-auto custom-scrollbar"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
