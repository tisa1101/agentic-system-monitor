'use client';

import React from 'react';
import { useAppContext } from '@/components/layout/AppShell';
import GlassCard from '@/components/ui/GlassCard';
import { Network, Webhook, Zap, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CausalGraphPage() {
  const { systemMetrics } = useAppContext();
  const causalChain = systemMetrics.analysis?.causalChain || [];

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div
          className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-2 px-3 py-1 rounded-full inline-block"
          style={{ color: 'var(--primary)', background: 'rgba(160,55,59,0.08)' }}
        >
          PROBABILISTIC REASONING
        </div>
        <h1 className="font-headline font-extrabold text-5xl -tracking-tight mb-2">
          <span style={{ color: 'var(--on-surface)' }}>Causal </span>
          <span style={{ color: 'var(--primary)' }} className="italic">Inference Graph</span>
        </h1>
        <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
          Discovering inter-process interdependencies through correlated temporal spike analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Graph Visualization */}
        <GlassCard className="lg:col-span-2 min-h-[500px] relative overflow-hidden flex flex-col justify-center items-center">
          <div className="absolute top-5 left-5">
             <div className="flex items-center gap-2 text-xs font-mono text-on-surface-faint">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                Live Inference Stream
             </div>
          </div>

          <div className="flex flex-col items-center gap-12 w-full p-10">
            {causalChain.length > 0 ? (
                <>
                {causalChain.map((link, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="w-full flex flex-col items-center gap-6"
                    >
                        <div className="relative group">
                            <div className="px-6 py-4 rounded-2xl bg-surface-low border border-white/10 flex items-center gap-3 shadow-xl group-hover:border-primary/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Webhook size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-on-surface-faint uppercase">Source Node</div>
                                    <div className="text-lg font-headline font-bold text-white">{link.source}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
                            <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                                {Math.round(link.probability * 100)}% CAUSAL CONFIDENCE
                            </div>
                            <ArrowRight size={24} className="text-primary rotate-90" />
                        </div>

                        {i === causalChain.length - 1 && (
                            <div className="px-6 py-4 rounded-2xl bg-surface-low border border-white/10 flex items-center gap-3 shadow-xl">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-on-surface-faint uppercase">Impact Node</div>
                                    <div className="text-lg font-headline font-bold text-white">{link.target}</div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
                </>
            ) : (
                <div className="text-center p-10">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-on-surface-faint mx-auto mb-4">
                        <Info size={32} />
                    </div>
                    <h3 className="text-xl font-headline font-bold text-white mb-2">Steady State Detected</h3>
                    <p className="text-sm text-on-surface-muted max-w-sm">
                        Causal relationships are discovered during system spikes. No significant inter-process correlation detected in the current window.
                    </p>
                </div>
            )}
          </div>
        </GlassCard>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
            <GlassCard className="border-l-4 border-l-primary">
                <h3 className="text-lg font-headline font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" />
                    Inference Rules
                </h3>
                <div className="space-y-4">
                   <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] font-bold text-primary uppercase mb-1">Temporal Correlation</div>
                      <p className="text-xs text-on-surface-muted">Analyzes the Δt between resource spikes across the PID namespace.</p>
                   </div>
                   <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] font-bold text-primary uppercase mb-1">Causal Directionality</div>
                      <p className="text-xs text-on-surface-muted">Uses Grangers Causality to determine the flow of resource pressure.</p>
                   </div>
                </div>
            </GlassCard>

            <GlassCard className="bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                    <Network size={20} className="text-primary" />
                    <span className="font-bold text-sm">System Topology</span>
                </div>
                <p className="text-xs text-on-surface-muted mb-4 leading-relaxed">
                    Unlike traditional monitors, our AI learns the interdependencies of your specific stack without manual configuration.
                </p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3" />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-on-surface-faint uppercase font-bold">Network Saturation</span>
                    <span className="text-[10px] text-primary font-bold">67%</span>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}
