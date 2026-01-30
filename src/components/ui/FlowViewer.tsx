"use client";
import React from 'react';
import { ReactFlow, Background, Controls, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface FlowViewerProps {
  nodes: Node[];
  edges: Edge[];
}

export default function FlowViewer({ nodes, edges }: FlowViewerProps) {
  return (
    <div className="h-[400px] w-full bg-black/40 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative group">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        colorMode="dark"
        // Prevent accidental scrolling while navigating the chat
        preventScrolling={true} 
        zoomOnScroll={false}
      >
        <Background color="#333" gap={20} />
        <Controls className="fill-indigo-500" />
      </ReactFlow>
      
      {/* 🏛️ Sovereign Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/30 tracking-widest">
          Sovereign Logic Map
        </span>
      </div>
    </div>
  );
}
