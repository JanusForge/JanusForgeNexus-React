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
    lineColor: '#6366f1',
    mainBkg: 'transparent', // 🏛️ DEEPSEEK FIX: Prevents black-on-black nullification
    tertiaryColor: '#1e1b4b'
  }
});

export default function MermaidViewer({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<string | null>(null); // 🏛️ GEMINI FIX: Surfacing specific errors

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!chart) return;
      try {
        setIsRendering(true);
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        // Pre-validate syntax as suggested by Gemini
        await mermaid.parse(chart);
        
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvg(renderedSvg);
          setIsRendering(false);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setError(err.message || "Syntax Error in Mermaid Logic");
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
    <div className="flex flex-col gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
        <AlertCircle size={14} /> Visual Synthesis Failure
      </div>
      <p className="text-[10px] font-mono leading-tight bg-black/40 p-2 rounded border border-red-500/10">
        {error}
      </p>
    </div>
  );

  return (
    <div className="group relative my-4 w-full bg-indigo-500/5 p-6 rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-indigo-500/30">
      {isRendering ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-indigo-500" size={24} />
        </div>
      ) : (
        <>
          <button 
            onClick={handleDownload}
            className="absolute top-4 right-4 p-2 bg-zinc-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-[10px] text-zinc-400 hover:text-white z-10"
          >
            <Download size={14} /> Export SVG
          </button>
          <div 
            className="flex justify-center overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800"
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        </>
      )}
    </div>
  );
}
