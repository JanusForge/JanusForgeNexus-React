"use client";
import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface FlowViewerProps {
  nodes: Node[];
  edges: Edge[];
}

export default function FlowViewer({ nodes, edges }: FlowViewerProps) {
  // 🛡️ THE SOVEREIGN SHIELD: Validate data before it hits ReactFlow
  const validatedNodes = useMemo(() => {
    return (nodes || []).map((node, index) => ({
      ...node,
      // Ensure position exists and has numeric x/y, otherwise provide a fallback
      position: {
        x: typeof node?.position?.x === 'number' ? node.position.x : (index * 50),
        y: typeof node?.position?.y === 'number' ? node.position.y : (index * 50),
      },
      // Ensure data.label exists so nodes aren't empty boxes
      data: {
        ...node.data,
        label: node?.data?.label || 'Inert Node'
      }
    }));
  }, [nodes]);

  const validatedEdges = useMemo(() => {
    // Ensure edges have valid sources and targets to prevent "orphan edge" errors
    return (edges || []).filter(edge => edge.source && edge.target);
  }, [edges]);

  return (
    <div
      className="relative border border-white/10 rounded-2xl bg-black/40 shadow-2xl overflow-hidden"
      style={{ height: '450px', width: '100%', minHeight: '450px' }}
    >
      <ReactFlow
        nodes={validatedNodes}
        edges={validatedEdges}
        colorMode="dark"
        fitView
        preventScrolling={false}
        zoomOnScroll={false}
        panOnScroll={true}
      >
        <Background color="#222" gap={20} />
        <Controls />
      </ReactFlow>

      <div className="absolute bottom-2 right-2 pointer-events-none">
        <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-tighter">
          Nexus Flow Engine v12 | Shielded
        </span>
      </div>
    </div>
  );
}
