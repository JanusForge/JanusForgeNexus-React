"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
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
  }
});

export default function MermaidViewer({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!chart) return;
      try {
        setIsRendering(true);
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvg(renderedSvg);
          setIsRendering(false);
        }
      } catch (err) {
        console.error("Mermaid Error:", err);
        if (isMounted) {
          setError(true);
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

  if (error) return <div className="text-[10px] text-red-500 p-4 border border-red-500/20 bg-red-500/5 rounded-xl">Visual Synthesis Syntax Error</div>;

  return (
    <div className="group relative my-4 w-full bg-black/40 p-6 rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-indigo-500/30">
      {isRendering ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-indigo-500" size={24} />
        </div>
      ) : (
        <>
          <button 
            onClick={handleDownload}
            className="absolute top-4 right-4 p-2 bg-zinc-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-[10px] text-zinc-400 hover:text-white"
          >
            <Download size={14} /> Export SVG
          </button>
          <div 
            className="flex justify-center overflow-x-auto custom-scrollbar"
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        </>
      )}
    </div>
  );
}
