import React, { useState } from 'react';
import { Settings as SettingsIcon, Cpu, Key, Database, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const [model, setModel] = useState('gemini-2.5-flash');
  const [autoApproveLimit, setAutoApproveLimit] = useState(1000);
  const [retryAttempts, setRetryAttempts] = useState(3);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    toast.success('AgentFlow AI System Parameters Saved!');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
          <SettingsIcon className="w-4 h-4" /> System Governance & AI Controls
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400">Configure LLM reasoner engines, autonomous financial thresholds, and API parameters.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cpu className="w-4 h-4 text-brand-400" /> Artificial Intelligence Reasoning Core
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Primary Reasoning Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Fastest)</option>
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Reasoning)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Agent Retry Attempts on Exception</label>
              <input
                type="number"
                value={retryAttempts}
                onChange={(e) => setRetryAttempts(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Autonomous Financial & Governance Thresholds
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Max Autonomous Approval Limit ($ USD)
            </label>
            <input
              type="number"
              value={autoApproveLimit}
              onChange={(e) => setAutoApproveLimit(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Requests exceeding ${autoApproveLimit} will be automatically flagged by the Decision Agent for human escalation.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Database className="w-4 h-4 text-indigo-400" /> Database & External Integrations
          </h3>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Database Engine:</span>
              <span className="font-mono text-emerald-400">Supabase PostgreSQL (Fallback Active)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>API Gateway Status:</span>
              <span className="font-mono text-emerald-400">Express Node.js REST API (Port 5000)</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
          {saved ? 'Parameters Updated Successfully' : 'Save System Settings'}
        </button>
      </form>
    </div>
  );
};
