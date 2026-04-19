'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import GlassCard from '@/components/ui/GlassCard';
import { Box, Layers, MousePointer2, Move } from 'lucide-react';

// Dynamically import the 3D component to avoid SSR issues with Three.js
const SystemTopology3D = dynamic(() => import('@/components/visualization/SystemTopology3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] rounded-3xl bg-black/40 animate-pulse flex items-center justify-center border border-white/10">
      <div className="text-center">
        <Box className="w-12 h-12 text-primary/40 mx-auto mb-4 animate-bounce" />
        <p className="text-on-surface-muted text-sm font-mono tracking-tighter uppercase">Initializing 3D Render Engine...</p>
      </div>
    </div>
  ),
});

export default function TopologyPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Live Neural Environment</span>
          </div>
          <h1 className="text-5xl font-headline font-extrabold tracking-tight text-white">
            System <span className="text-primary italic">Topology</span>
          </h1>
          <p className="text-on-surface-muted mt-2 max-w-lg">
            A high-dimensional spatial representation of your hardware architecture. Nodes are positioned based on causal weight and verticalized by real-time entropy.
          </p>
        </div>
        
        <div className="flex p-1 bg-surface-lowest rounded-xl border border-white/5">
            <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center gap-2">
                <Box size={14} /> 3D View
            </div>
            <div className="px-4 py-2 rounded-lg text-on-surface-faint text-xs font-bold flex items-center gap-2 opacity-50 cursor-not-allowed">
                <Layers size={14} /> Heatmap
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
        {/* Main 3D Canvas Container */}
        <div className="xl:col-span-3 h-[700px]">
            <SystemTopology3D />
        </div>

        {/* Sidebar Controls/Info */}
        <div className="space-y-6">
            <GlassCard>
                <h3 className="text-sm font-headline font-bold mb-4 flex items-center gap-2">
                    <MousePointer2 size={16} className="text-primary" />
                    Interaction Guide
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-on-surface-muted">Rotate View</div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] font-mono border border-white/10 uppercase">Left Click</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-on-surface-muted">Pan Camera</div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] font-mono border border-white/10 uppercase">Right Click</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-on-surface-muted">Zoom In/Out</div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] font-mono border border-white/10 uppercase">Scroll Wheel</div>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="bg-primary/5 border-primary/20">
                <Move size={20} className="text-primary mb-3" />
                <h4 className="font-bold text-sm mb-2">Entropy Mapping</h4>
                <p className="text-[11px] text-on-surface-muted leading-relaxed">
                    The vertical axis (Y) represents the current **Entropy Flux** of each process. Higher nodes indicate high CPU volatility, while ground-level nodes represent dormant system services.
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                        <span>Node Volume</span>
                        <span className="text-white">Resident RAM</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[65%]" />
                    </div>
                </div>
            </GlassCard>

            <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                <div className="text-[10px] font-bold text-on-surface-faint uppercase mb-2 tracking-widest">Patent-Ready Visualization</div>
                <p className="text-[10px] text-on-surface-faint italic leading-relaxed">
                    Topology Claim #8: &quot;A method for projecting asynchronous telemetry into a three-dimensional spatial manifold for SRE cognitive offloading.&quot;
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
