'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/components/layout/AppShell';
import GlassCard from '@/components/ui/GlassCard';
import { FlaskConical, Search, Zap, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimulationResult {
  pid: number;
  name: string;
  freedRAM: string;
  cascadingImpact: string;
  riskLevel: string;
  recommendation: string;
}

export default function SimulatorPage() {
  const { processes } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);


  const filteredProcesses = useMemo(() => {
    if (!searchTerm) return [];
    return processes
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.pid.toString().includes(searchTerm))
      .slice(0, 5);
  }, [processes, searchTerm]);

  const runSimulation = async (pid: number) => {
    setIsSimulating(true);
    setSelectedPid(pid);
    try {
        const res = await fetch(`http://localhost:3001/api/simulate-kill/${pid}`);
        const data = await res.json();
        // Artificial delay for "computation" effect
        setTimeout(() => {
            setSimulationResult(data);
            setIsSimulating(false);
        }, 8000);
    } catch {
        setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">

      {/* Header */}
      <div className="mb-8">
        <div
          className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-2 px-3 py-1 rounded-full inline-block"
          style={{ color: 'var(--primary)', background: 'rgba(160,55,59,0.08)' }}
        >
          COUNTERFACTUAL REASONING
        </div>
        <h1 className="font-headline font-extrabold text-5xl -tracking-tight mb-2">
          <span style={{ color: 'var(--on-surface)' }}>What-If </span>
          <span style={{ color: 'var(--primary)' }} className="italic">Simulator</span>
        </h1>
        <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
          Predict system states and cascading risks before executing termination commands.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <GlassCard>
                <h3 className="text-lg font-headline font-bold mb-4 flex items-center gap-2">
                    <Search size={20} className="text-primary" />
                    Select Target Node
                </h3>
                <div className="relative mb-4">
                    <input 
                        type="text"
                        placeholder="Search process name or PID..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    {filteredProcesses.map(p => (
                        <button 
                            key={p.pid}
                            onClick={() => runSimulation(p.pid)}
                            className="w-full p-3 rounded-lg bg-surface-low border border-white/5 hover:border-primary/50 transition-all text-left flex items-center justify-between"
                        >
                            <div>
                                <div className="text-sm font-bold text-white">{p.name}</div>
                                <div className="text-[10px] text-on-surface-faint uppercase font-mono">PID: {p.pid}</div>
                            </div>
                            <ArrowRight size={16} className="text-on-surface-faint" />
                        </button>
                    ))}
                    {searchTerm && filteredProcesses.length === 0 && (
                        <div className="text-xs text-on-surface-faint text-center py-4 italic">No matching processes found</div>
                    )}
                </div>
            </GlassCard>

            <GlassCard className="bg-primary/5 border-primary/20">
                <Info size={24} className="text-primary mb-3" />
                <h4 className="font-bold text-sm mb-2">Simulated Outcome Logic</h4>
                <p className="text-[11px] text-on-surface-muted leading-relaxed">
                    Our emulator uses the Causal Graph to traverse downstream edges. It calculates the theoretical &quot;entropy reduction&quot; and &quot;service volatility&quot; predicted post-kill.
                </p>
            </GlassCard>

        </div>

        <div className="lg:col-span-2 min-h-[600px]">
            <AnimatePresence mode="wait">
                {isSimulating ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center p-20 text-center"
                    >
                        <div className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-8" />
                        <h3 className="text-2xl font-headline font-bold text-white mb-2">Running Counterfactual Trace...</h3>
                        <p className="text-sm text-on-surface-muted">Evaluating dependency cascades and RAM recovery probability.</p>
                    </motion.div>
                ) : simulationResult ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <GlassCard className="border-l-4 border-l-primary bg-primary/5">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(160,55,59,0.4)]">
                                        <FlaskConical size={28} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-primary uppercase">Simulation Result for PID {simulationResult.pid}</div>
                                        <h2 className="text-3xl font-headline font-bold text-white">{simulationResult.name}</h2>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-xl border font-bold ${simulationResult.riskLevel === 'High' ? 'border-error text-error bg-error/10' : 'border-success text-success bg-success/10'}`}>
                                    {simulationResult.riskLevel} CASCADE RISK
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] uppercase font-bold text-on-surface-faint mb-2">Predicted Resource Recovery</div>
                                    <div className="text-3xl font-mono font-bold text-success flex items-center gap-2">
                                        <Zap size={24} />
                                        {simulationResult.freedRAM}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] uppercase font-bold text-on-surface-faint mb-2">Service Impact Map</div>
                                    <div className="text-3xl font-mono font-bold text-white">{simulationResult.cascadingImpact}</div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-surface-lowest border border-white/10">
                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-warning" />
                                    AI Safety Recommendation
                                </h4>
                                <p className="text-lg font-headline font-bold text-on-surface mb-4">
                                    {simulationResult.recommendation}
                                </p>
                                <div className="flex gap-4">
                                    <button className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-sm hover:opacity-90 transition-opacity">
                                        Confirm Simulated Kill
                                    </button>
                                    <button className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all">
                                        Abort Selection
                                    </button>
                                </div>
                            </div>
                        </GlassCard>

                        <div className="grid grid-cols-2 gap-6">
                            <GlassCard>
                                <h4 className="text-xs font-bold text-on-surface-faint uppercase mb-3">Downstream Correlation</h4>
                                <div className="space-y-2">
                                    {['Database Socket', 'API Thread Pool', 'User Session Cache'].map(item => (
                                        <div key={item} className="flex items-center justify-between text-xs p-2 rounded bg-white/5 border border-white/5">
                                            <span>{item}</span>
                                            <span className="text-error font-bold">DISCONNECTED</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                            <GlassCard>
                                <h4 className="text-xs font-bold text-on-surface-faint uppercase mb-3">Upstream Stability</h4>
                                <div className="space-y-2">
                                    {['Kernel Scheduler', 'System Init'].map(item => (
                                        <div key={item} className="flex items-center justify-between text-xs p-2 rounded bg-white/5 border border-white/5">
                                            <span>{item}</span>
                                            <span className="text-success font-bold">AFFECTED</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <FlaskConical size={80} className="mb-6" />
                        <h3 className="text-xl font-headline font-bold">Waiting for simulation target...</h3>
                        <p className="text-sm max-w-xs mx-auto">Select a process from the search list to run a counterfactual &quot;What-If&quot; analysis.</p>
                    </div>
                )}

            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
