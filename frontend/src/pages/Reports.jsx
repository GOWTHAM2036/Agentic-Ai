import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { FileText, Download, ShieldCheck, Sparkles, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportService.getAllReports();
        if (res.success) {
          setReports(res.data);
          if (res.data.length > 0) setSelectedReport(res.data[0]);
        }
      } catch (err) {
        console.warn('Reports fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = (rep) => {
    if (!rep || !rep.downloadable_markdown) return toast.error('No report content available');
    const element = document.createElement('a');
    const file = new Blob([rep.downloadable_markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `AgentFlow_Audit_${rep.id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Report downloaded!');
  };

  const filtered = reports.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.executive_summary.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
            <Sparkles className="w-4 h-4" /> Executive Audit & Intelligence Repository
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Reports</h1>
          <p className="text-xs text-slate-400">Autonomous decisions, timeline logs, risk analyses, and downloadable compliance markdown files.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Executive Audit Log</h3>
          {filtered.length === 0 ? (
            <div className="text-xs text-slate-400 italic p-4 glass-panel rounded-2xl">No executive reports found.</div>
          ) : (
            filtered.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`w-full text-left p-4 rounded-2xl glass-card transition-all border ${
                  selectedReport?.id === rep.id ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[10px] text-brand-400">Risk Level: {rep.risk_level}</span>
                  <span className="text-[10px] text-slate-400">{new Date(rep.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-semibold text-sm text-white line-clamp-1">{rep.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{rep.executive_summary}</p>
              </button>
            ))
          )}
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          {selectedReport ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                    <ShieldCheck className="w-4 h-4" /> Autonomous Executive Decision Audit
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{selectedReport.title}</h2>
                </div>

                <button
                  onClick={() => handleDownload(selectedReport)}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/20"
                >
                  <Download className="w-4 h-4" /> Download Markdown
                </button>
              </div>

              <div className="space-y-6 text-slate-200 text-sm">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Executive Summary</h4>
                  <p className="leading-relaxed">{selectedReport.executive_summary}</p>
                </div>

                {selectedReport.decisions_made && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Autonomous Rationale</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedReport.decisions_made.map((d, i) => (
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

                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Raw Audit Markdown Preview</h4>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                    {selectedReport.downloadable_markdown}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">Select a report from the left pane to view full audit details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
