import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { History as HistoryIcon, Search, ArrowRight } from 'lucide-react';

export const History = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await requestService.getAllRequests();
        if (res.success) setRequests(res.data);
      } catch (err) {
        console.warn('History fetch error:', err);
      }
    };
    fetchHistory();
  }, []);

  const filtered = requests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === 'All' || r.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
            <HistoryIcon className="w-4 h-4" /> Operational Audit Trail
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Business Request History</h1>
          <p className="text-xs text-slate-400">Search and filter historical autonomous agent workflow executions.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Refund & Returns">Refund & Returns</option>
            <option value="Operations">Operations</option>
            <option value="Supply Chain">Supply Chain</option>
            <option value="Procurement">Procurement</option>
            <option value="Fraud & Risk">Fraud & Risk</option>
          </select>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-brand-400">{req.id.substring(0, 8)}...</td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-semibold text-white truncate">{req.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{req.description}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{req.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(req.created_at).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/monitor?requestId=${req.id}`)}
                      className="px-3 py-1.5 bg-brand-600/20 text-brand-300 hover:bg-brand-600 hover:text-white rounded-lg transition-all text-xs font-semibold flex items-center gap-1 ml-auto"
                    >
                      View <ArrowRight className="w-3 h-3" />
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
