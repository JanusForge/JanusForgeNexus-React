"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#fff',
    lineColor: '#818cf8', // Lightened indigo for better contrast
    mainBkg: 'transparent',
    nodeBkg: '#1e1b4b',   // Deep indigo node background
  }
});

export default function MermaidViewer({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!chart) return;
      try {
        setIsRendering(true);
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        // Ensure the chart code isn't empty or just whitespace
        if (chart.trim().length === 0) throw new Error("Empty chart definition");

        const { svg: renderedSvg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvg(renderedSvg);
          setIsRendering(false);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setError(err.message || "Logic Syntax Error");
          setIsRendering(false);
        }
      }
    };
    renderChart();
    return () => { isMounted = false; };
  }, [chart]);

  const handleDownload = () => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-logic-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) return (
    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-mono text-red-400">
      [!] Visual Synthesis Error: {error}
    </div>
  );

  return (
    <div className="group relative my-4 w-full bg-white/[0.03] p-6 rounded-3xl border border-white/10 transition-all hover:border-indigo-500/30">
      {isRendering ? (
        <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-indigo-500" size={24} /></div>
      ) : (
        <>
          <button 
            onClick={handleDownload}
            className="absolute top-4 right-4 p-2 bg-zinc-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-zinc-400 hover:text-white z-10"
          >
            <Download size={14} />
          </button>
          <div 
            className="flex justify-center overflow-x-auto brightness-125 saturate-150"
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        </>
      )}
    </div>
  );
}
