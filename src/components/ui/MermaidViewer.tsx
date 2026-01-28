"use client";
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize with your brand's Indigo/Zinc aesthetic
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#fff',
    lineColor: '#888',
    mainBkg: '#18181b', // zinc-900
  }
});

interface MermaidProps {
  chart: string;
}

const MermaidViewer: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      // This tells Mermaid to re-scan the div for new code
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid-container my-6 w-full flex justify-center bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800 shadow-2xl">
      <div key={chart} className="mermaid overflow-x-auto" ref={ref}>
        {chart}
      </div>
    </div>
  );
};

export default MermaidViewer;
