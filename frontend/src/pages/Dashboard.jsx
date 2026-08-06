import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService, analyticsService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { AgentStatusCard } from '../components/AgentStatusCard';
import { PlusCircle, Activity, FileCheck, Users, Zap, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const chartData = [
  { time: '08:00', requests: 12, resolved: 12 },
  { time: '10:00', requests: 19, resolved: 18 },
  { time: '12:00', requests: 34, resolved: 33 },
  { time: '14:00', requests: 27, resolved: 27 },
  { time: '16:00', requests: 45, resolved: 44 },
  { time: '18:00', requests: 22, resolved: 22 },
];

export const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDescription, setQuickDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [reqRes, anaRes] = await Promise.all([
        requestService.getAllRequests(),
        analyticsService.getOverview()
      ]);
      if (reqRes.success) setRequests(reqRes.data);
      if (anaRes.success) setAnalytics(anaRes.data);
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickDescription) return toast.error('Please enter request description');
    setSubmitting(true);
    try {
      const res = await requestService.createRequest({
        title: quickTitle || 'Autonomous Business Operations Workflow',
        category: 'Refund & Returns',
        description: quickDescription,
        priority: 'High'
      });
      if (res.success) {
        toast.success('Autonomous Multi-Agent Workflow Dispatched!');
        setQuickTitle('');
        setQuickDescription('');
        navigate(`/monitor?requestId=${res.data.id}`);
      }
    } catch (err) {
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const activeAgents = [
    { name: 'Orchestrator Agent', role: 'Workflow Coordinator', status: 'Completed', reasoning: 'Managing state transitions & sub-agent routing.', timeMs: 120 },
    { name: 'Planner Agent', role: 'Task Decomposition', status: 'Completed', reasoning: '5 sequential operation tasks prioritized.', timeMs: 210 },
    { name: 'Research Agent', role: 'Context & History Scan', status: 'Completed', reasoning: 'Retrieved customer SLA tier and order policies.', timeMs: 450 },
    { name: 'Workflow Agent', role: 'Logistics & API Checks', status: 'Completed', reasoning: 'Simulated carrier tracking & payment check 200 OK.', timeMs: 380 },
    { name: 'Decision Agent', role: 'Autonomous Rules Engine', status: 'Completed', reasoning: 'Approved full refund + goodwill voucher.', timeMs: 290 },
    { name: 'Report Agent', role: 'Executive Synthesis', status: 'Completed', reasoning: 'Generated executive audit report and timeline.', timeMs: 510 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
            <Sparkles className="w-4 h-4" /> Multi-Agent Operations Command Center
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Overview Dashboard</h1>
          <p className="text-xs text-slate-400">Monitor real-time agent reasoning, request resolutions, and business analytics.</p>
        </div>

        <button
          onClick={() => navigate('/new-request')}
          className="px-5 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Submit Business Request
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Business Requests</span>
            <Activity className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{analytics?.total_requests || requests.length || 1}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from last week
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Auto Resolution Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{analytics?.auto_resolution_rate || '100%'}</div>
          <div className="text-[11px] text-slate-400">Minimal human intervention</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Avg Resolution Time</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{analytics?.avg_resolution_time || '4.2s'}</div>
          <div className="text-[11px] text-emerald-400">99.8% SLA Speed compliance</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active AI Agents</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">6 / 6</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> All agents healthy
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Request & Execution Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Submit Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white tracking-tight">Quick Request Dispatch</h3>
            <span className="text-[10px] bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full font-mono">Auto-Execution</span>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Refund request for delayed shipment"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Business Description</label>
              <textarea
                rows={3}
                required
                placeholder="Customer requests refund of $480 because shipment #ORD-98214 was delayed by 7 business days beyond SLA..."
                value={quickDescription}
                onChange={(e) => setQuickDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-brand-500/20"
            >
              {submitting ? 'Dispatching Agents...' : 'Execute Operations Workflow'}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">Agent Resolution Velocity</h3>
              <p className="text-xs text-slate-400">Completed requests vs incoming business operations volume</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Today</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agents Live Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white tracking-tight">Specialized AI Agents Network</h3>
            <p className="text-xs text-slate-400">Autonomous reasoning team status & micro-task allocation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeAgents.map((agent, idx) => (
            <AgentStatusCard key={idx} {...agent} />
          ))}
        </div>
      </div>

      {/* Recent Business Requests */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">Recent Business Requests</h3>
            <p className="text-xs text-slate-400">Real-time status of multi-agent operations workflows</p>
          </div>
          <button onClick={() => navigate('/history')} className="text-xs text-brand-400 font-semibold hover:underline">
            View All History →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {requests.slice(0, 5).map((req) => (
                <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white max-w-xs truncate">{req.title}</td>
                  <td className="py-3.5 px-4 text-slate-300">{req.category}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.priority === 'High' || req.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(req.created_at).toLocaleTimeString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/monitor?requestId=${req.id}`)}
                      className="px-3 py-1 bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white rounded-lg transition-colors text-xs font-semibold"
                    >
                      Monitor Live →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
