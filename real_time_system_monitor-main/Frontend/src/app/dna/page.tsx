'use client';

import React, { useMemo } from 'react';
import { useAppContext } from '@/components/layout/AppShell';
import GlassCard from '@/components/ui/GlassCard';
import { Fingerprint, BarChart3, ShieldAlert, TrendingUp, Search } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export default function DNAPage() {
  const { processes } = useAppContext();

  const anomalousProcesses = useMemo(() => {
    return [...processes]
      .filter(p => (p.dnaDrift || 0) > 0)
      .sort((a, b) => (b.dnaDrift || 0) - (a.dnaDrift || 0))
      .slice(0, 10);
  }, [processes]);

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div
          className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-2 px-3 py-1 rounded-full inline-block"
          style={{ color: 'var(--primary)', background: 'rgba(160,55,59,0.08)' }}
        >
          BEHAVIORAL FINGERPRINTING
        </div>
        <h1 className="font-headline font-extrabold text-5xl -tracking-tight mb-2">
          <span style={{ color: 'var(--on-surface)' }}>Behavioral </span>
          <span style={{ color: 'var(--primary)' }} className="italic">DNA Analysis</span>
        </h1>
        <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
          Detecting intrusions and escapes by measuring statistical drift against unique per-process baselines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DNA Drift Leaderboard */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2 px-2">
             <h2 className="text-lg font-headline font-bold flex items-center gap-2 text-white">
                <ShieldAlert size={20} className="text-error" />
                Active DNA Drift Alerts
             </h2>
             <span className="text-xs font-mono text-on-surface-faint">{anomalousProcesses.length} Detected Events</span>
          </div>

          <AnimatePresence mode="popLayout">
            {anomalousProcesses.length > 0 ? (
                anomalousProcesses.map((p, i) => (
                    <motion.div
                        key={p.pid}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <GlassCard className={`relative overflow-hidden ${(p.dnaDrift || 0) > 5 ? 'border-l-4 border-l-error' : 'border-l-4 border-l-warning'}`}>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-surface-high flex items-center justify-center font-mono font-bold text-xs text-primary border border-white/5">
                                    {p.name.substring(0, 2).toUpperCase()}
                                 </div>
                                 <div>
                                    <div className="font-headline font-bold text-white text-lg">{p.name}</div>
                                    <div className="flex items-center gap-2 text-xs font-mono text-on-surface-faint">
                                        <span>PID: {p.pid}</span>
                                        <span>·</span>
                                        <span>User: {p.user}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className={`text-2xl font-mono font-bold ${(p.dnaDrift || 0) > 5 ? 'text-error animate-pulse' : 'text-warning'}`}>
                                    {(p.dnaDrift || 0).toFixed(2)}σ
                                 </div>
                                 <div className="text-[10px] font-bold text-on-surface-faint uppercase">Statistical Drift</div>
                              </div>
                           </div>
                           
                           <div className="mt-4 grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                              <div>
                                 <div className="text-[10px] uppercase font-bold text-on-surface-faint mb-1">Behavioral Mean</div>
                                 <div className="text-sm font-mono text-white">{(p.dnaMean || 0).toFixed(2)}% CPU</div>
                              </div>
                              <div>
                                 <div className="text-[10px] uppercase font-bold text-on-surface-faint mb-1">Current State</div>
                                 <div className="text-sm font-mono text-white">{p.cpu.toFixed(1)}% CPU</div>
                              </div>
                              <div>
                                 <div className="text-[10px] uppercase font-bold text-on-surface-faint mb-1">Alert Level</div>
                                 <div className={`text-xs font-bold uppercase ${(p.dnaDrift || 0) > 5 ? 'text-error' : 'text-warning'}`}>
                                    {(p.dnaDrift || 0) > 5 ? 'Critical Anomaly' : 'Baseline Drift'}
                                 </div>
                              </div>
                           </div>

                           <div className="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none">
                               <Fingerprint size={120} className="text-white" />
                           </div>
                        </GlassCard>
                    </motion.div>
                ))
            ) : (
                <GlassCard className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Search size={48} className="mb-4 text-on-surface-faint" />
                    <p className="text-on-surface-muted font-body">No significant DNA drift detected. All processes are within statistical ranges.</p>
                </GlassCard>
            )}
          </AnimatePresence>
        </div>

        {/* DNA Methodology Sidebar */}
        <div className="space-y-6">
            <GlassCard className="bg-primary/5 border-primary/20">
                <h3 className="text-lg font-headline font-bold mb-4 flex items-center gap-2 text-primary">
                    <BarChart3 size={20} />
                    Statistical DNA
                </h3>
                <p className="text-sm text-on-surface-muted leading-relaxed mb-4">
                    Traditional monitors use global thresholds. We build a **unique statistical fingerprint** for every process.
                </p>
                <div className="space-y-3">
                   <div className="flex justify-between text-xs font-mono">
                      <span className="text-on-surface-faint">Learning Samples</span>
                      <span className="text-white">50 / process</span>
                   </div>
                   <div className="flex justify-between text-xs font-mono">
                      <span className="text-on-surface-faint">Drift Tolerance</span>
                      <span className="text-white">3.0 Standard Deviations</span>
                   </div>
                   <div className="flex justify-between text-xs font-mono">
                      <span className="text-on-surface-faint">Re-baseline Cycle</span>
                      <span className="text-white">Every 5 min</span>
                   </div>
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className="text-lg font-headline font-bold mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-success" />
                    Detection Gains
                </h3>
                <ul className="space-y-3 text-xs text-on-surface-muted">
                    <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                        <span>Detects **Memory Leaks** early by identifying gradual drift from mean usage.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                        <span>Identifies **Container Escapes** by detecting sudden context shifts in system processes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                        <span>Uncovers **Backdoors** that mask as legitimate processes but exhibit high variance profiles.</span>
                    </li>
                </ul>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}
