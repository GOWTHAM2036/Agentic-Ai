import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Activity, FileText, History, BarChart3, Settings, Cpu } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/new-request', label: 'New Request', icon: PlusCircle },
    { path: '/monitor', label: 'Execution Monitor', icon: Activity },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/history', label: 'History', icon: History },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 glass-panel flex flex-col justify-between hidden md:flex shrink-0">
      <div className="p-4 space-y-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3">
          Enterprise Operations
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600/30 to-indigo-600/10 text-white border border-brand-500/30 shadow-lg shadow-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-brand-400" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 rounded-2xl glass-card border border-brand-500/20 bg-brand-500/5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
          <Cpu className="w-4 h-4 animate-spin text-brand-400" style={{ animationDuration: '8s' }} />
          Gemini 2.5 Flash Engine
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          6 Autonomous Agents Active: Orchestrator, Planner, Research, Workflow, Decision, Report.
        </p>
      </div>
    </aside>
  );
};
