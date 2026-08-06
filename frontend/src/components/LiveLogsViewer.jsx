import React, { useRef, useEffect } from 'react';
import { Terminal, ShieldCheck } from 'lucide-react';

export const LiveLogsViewer = ({ logs = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden flex flex-col h-full">
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 font-mono">
          <Terminal className="w-4 h-4 text-brand-400" />
          SYSTEM EXECUTION STREAM // AGENT_LOGS
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" /> AUDIT COMPLIANT
        </div>
      </div>

      <div
        ref={scrollRef}
        className="p-4 font-mono text-xs text-slate-300 space-y-3 overflow-y-auto max-h-[380px] bg-slate-950/80"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic">Listening for active multi-agent log stream...</div>
        ) : (
          logs.map((log, idx) => (
            <div key={log.id || idx} className="border-l-2 border-brand-500/40 pl-3 py-1 space-y-1 hover:bg-slate-900/40 rounded transition-colors">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-brand-400">[{log.agent_name}]</span>
                <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleTimeString()}</span>
              </div>
              <p className="text-slate-200 leading-normal">{log.reasoning}</p>
              {log.output_payload && Object.keys(log.output_payload).length > 0 && (
                <details className="text-[10px] text-slate-400 cursor-pointer">
                  <summary className="hover:text-brand-300 transition-colors">View JSON Payload</summary>
                  <pre className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto">
                    {JSON.stringify(log.output_payload, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
