"use client";
import React from 'react';
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
// 🏛️ CRITICAL: If this CSS is missing, the nodes will be invisible!
import '@xyflow/react/dist/style.css';

interface FlowViewerProps {
  nodes: Node[];
  edges: Edge[];
}

export default function FlowViewer({ nodes, edges }: FlowViewerProps) {
  return (
    <div 
      className="relative border border-white/10 rounded-2xl bg-black/40 shadow-2xl overflow-hidden"
      style={{ height: '450px', width: '100%', minHeight: '450px' }} // 🛡️ FORCE HEIGHT
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        colorMode="dark"
        fitView
        // 🏛️ Ensure it doesn't fight with the chat scroll
        preventScrolling={false}
        zoomOnScroll={false}
        panOnScroll={true}
      >
        <Background color="#222" gap={20} />
        <Controls />
      </ReactFlow>

      {/* 🏷️ Sovereign Tag to verify the component is mounted */}
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-tighter">
          Nexus Flow Engine v12
        </span>
      </div>
    </div>
  );
}


// Keep it real, Cassandra Williamson
