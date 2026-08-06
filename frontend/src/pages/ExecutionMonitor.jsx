import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { requestService, reportService } from '../services/api';
import { AgentStatusCard } from '../components/AgentStatusCard';
import { ExecutionTimeline } from '../components/ExecutionTimeline';
import { LiveLogsViewer } from '../components/LiveLogsViewer';
import { StatusBadge } from '../components/StatusBadge';
import { Activity, Download, FileText, CheckCircle2, Clock, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExecutionMonitor = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMonitorData = async () => {
    let currentId = requestId;
    
    // Auto-fallback: if no requestId in URL, fetch latest request
    if (!currentId) {
      try {
        const allReqs = await requestService.getAllRequests();
        if (allReqs.success && allReqs.data.length > 0) {
          currentId = allReqs.data[0].id;
          navigate(`/monitor?requestId=${currentId}`, { replace: true });
          return;
        }
      } catch (e) {}
    }

    if (!currentId) {
      setLoading(false);
      return;
    }

    try {
      const [reqRes, logsRes] = await Promise.all([
        requestService.getRequestById(currentId),
        requestService.getRequestLogs(currentId)
      ]);

      if (reqRes.success) setRequest(reqRes.data);
      if (logsRes.success) setLogs(logsRes.data);

      if (reqRes.data?.status === 'Completed' && !report) {
        try {
          const repRes = await reportService.getReportByRequestId(currentId);
          if (repRes.success) setReport(repRes.data);
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Execution monitor fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitorData();
    const interval = setInterval(fetchMonitorData, 2000);
    return () => clearInterval(interval);
  }, [requestId]);

  const handleDownloadReport = () => {
    if (!report || !report.downloadable_markdown) return toast.error('No report available for download');
    const element = document.createElement('a');
    const file = new Blob([report.downloadable_markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `AgentFlow_Report_${requestId}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Report downloaded successfully!');
  };

  // Derive agent status mapping from logs
  const getAgentStatus = (agentName) => {
    const agentLogs = logs.filter(l => l.agent_name === agentName);
    if (!agentLogs || agentLogs.length === 0) return { status: 'Waiting', reasoning: 'Waiting in pipeline queue...', timeMs: 0 };
    const latest = agentLogs[agentLogs.length - 1];
    return {
      status: latest.status,
      reasoning: latest.reasoning,
      timeMs: latest.execution_time_ms || 0
    };
  };

  const agentPipeline = [
    { name: 'Orchestrator Agent', role: 'Workflow Coordinator' },
    { name: 'Planner Agent', role: 'Task Decomposition' },
    { name: 'Research Agent', role: 'Context & History Scan' },
    { name: 'Workflow Agent', role: 'Logistics & API Checks' },
    { name: 'Decision Agent', role: 'Autonomous Rules Engine' },
    { name: 'Report Agent', role: 'Executive Synthesis' }
  ];

  if (!requestId && !loading) {
    return (
      <div className="text-center py-16 space-y-4 glass-panel rounded-3xl p-8 max-w-lg mx-auto border border-slate-800">
        <Activity className="w-12 h-12 text-brand-400 mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-white">No Active Request Selected</h2>
        <p className="text-xs text-slate-400">Submit a new business operations request to watch 6 autonomous AI agents reason and execute live.</p>
        <button onClick={() => navigate('/new-request')} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-brand-500/20">
          + Create New Business Request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
            <Sparkles className="w-4 h-4" /> Live Multi-Agent Pipeline Monitor
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{request?.title || 'Loading Operations Workflow...'}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>Category: <strong className="text-slate-200">{request?.category}</strong></span>
            <span>Priority: <strong className="text-slate-200">{request?.priority}</strong></span>
            <span>ID: <code className="text-brand-300 font-mono text-[11px]">{requestId}</code></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={request?.status || 'Planning'} />
          {report && (
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" /> Download Executive Report
            </button>
          )}
        </div>
      </div>

      {/* Agents Live Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white tracking-tight">Active Multi-Agent Reasoning Pipeline</h3>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time Streaming
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentPipeline.map((agent, idx) => {
            const state = getAgentStatus(agent.name);
            return (
              <AgentStatusCard
                key={idx}
                name={agent.name}
                role={agent.role}
                status={state.status}
                reasoning={state.reasoning}
                timeMs={state.timeMs}
              />
            );
          })}
        </div>
      </div>

      {/* Split View: Live Logs & Execution Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-bold text-base text-white tracking-tight">Agent Execution Log Stream</h3>
          <LiveLogsViewer logs={logs} />
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-base text-white tracking-tight">Task Execution Timeline</h3>
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 h-full">
            <ExecutionTimeline
              tasks={[
                { id: 1, name: 'Parse request & SLA parameters', duration_mins: 1, assigned_agent: 'Planner Agent', status: 'Completed' },
                { id: 2, name: 'Scan customer history & database', duration_mins: 1, assigned_agent: 'Research Agent', status: 'Completed' },
                { id: 3, name: 'Execute carrier logistics API check', duration_mins: 2, assigned_agent: 'Workflow Agent', status: 'Completed' },
                { id: 4, name: 'Evaluate corporate refund decision matrix', duration_mins: 1, assigned_agent: 'Decision Agent', status: 'Completed' },
                { id: 5, name: 'Synthesize executive markdown report', duration_mins: 1, assigned_agent: 'Report Agent', status: request?.status === 'Completed' ? 'Completed' : 'Running' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Generated Report Preview (if available) */}
      {report && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" /> Autonomous Executive Decision Complete
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{report.title}</h2>
            </div>

            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-brand-400" /> Export Markdown
            </button>
          </div>

          <div className="space-y-4 text-sm text-slate-200">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Executive Summary</h4>
              <p className="leading-relaxed">{report.executive_summary}</p>
            </div>

            {report.decisions_made && report.decisions_made.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Decisions Rendered</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.decisions_made.map((d, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{d.topic}</span>
                        <span className="text-emerald-400 font-mono">{d.decision}</span>
                      </div>
                      <p className="text-xs text-slate-400">{d.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
