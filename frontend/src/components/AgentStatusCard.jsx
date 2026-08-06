import React from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Clock, Loader2, AlertTriangle, ShieldCheck, Sparkles, Database, Scale, FileSpreadsheet } from 'lucide-react';

export const AgentStatusCard = ({ name, role, status, reasoning, timeMs }) => {
  const getIcon = () => {
    switch (name) {
      case 'Orchestrator Agent': return Bot;
      case 'Planner Agent': return Sparkles;
      case 'Research Agent': return Database;
      case 'Workflow Agent': return Clock;
      case 'Decision Agent': return Scale;
      case 'Report Agent': return FileSpreadsheet;
      default: return ShieldCheck;
    }
  };

  const Icon = getIcon();

  const getStatusBadge = () => {
    switch (status) {
      case 'Completed':
        return (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </div>
        );
      case 'Running':
        return (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Active Reasoner
          </div>
        );
      case 'Failed':
        return (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Error
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
            <Clock className="w-3.5 h-3.5" /> Standby
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl glass-card glass-card-hover border transition-all ${
        status === 'Running' ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 bg-slate-900/90' : 'border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            status === 'Running' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
            'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white tracking-tight">{name}</h4>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 font-mono leading-relaxed line-clamp-3">
        {reasoning || 'Waiting for Orchestrator assignment...'}
      </div>

      {timeMs > 0 && (
        <div className="mt-2.5 flex justify-end text-[10px] text-slate-400 font-mono">
          Latency: {timeMs}ms
        </div>
      )}
    </motion.div>
  );
};
