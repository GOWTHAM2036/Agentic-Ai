import React from 'react';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export const ExecutionTimeline = ({ tasks = [] }) => {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-sm text-slate-400 italic">No execution timeline tasks loaded yet.</div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {tasks.map((task, idx) => (
            <div key={task.id || idx} className="relative flex items-start justify-between group">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center border border-slate-700">
                {task.status === 'Completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : task.status === 'Running' ? (
                  <PlayCircle className="w-4 h-4 text-amber-400 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div>
                <h5 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">
                  {task.name}
                </h5>
                <p className="text-xs text-slate-400">
                  Assigned Agent: <span className="text-slate-300 font-medium">{task.assigned_agent || 'Sub-Agent'}</span>
                </p>
              </div>

              <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                Est: {task.duration_mins || 1} min
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
