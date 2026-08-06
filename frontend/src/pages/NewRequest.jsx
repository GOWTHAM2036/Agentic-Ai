import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/api';
import { Bot, Sparkles, Send, RefreshCw, ShieldAlert, Truck, DollarSign, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const NewRequest = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Refund & Returns');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const templates = [
    {
      title: 'Customer Refund Request - Carrier SLA Breach',
      category: 'Refund & Returns',
      priority: 'High',
      icon: Truck,
      description: 'Customer requests full refund of $480.00 because shipment #ORD-98214 was delayed by 7 business days beyond guaranteed SLA window.'
    },
    {
      title: 'Fraud Alert & Account Compromise Audit',
      category: 'Fraud & Risk',
      priority: 'Critical',
      icon: ShieldAlert,
      description: 'System flagged suspicious high-frequency login attempts and multi-region withdrawal requests for account #ACC-77821. Perform immediate risk audit.'
    },
    {
      title: 'Enterprise Procurement Purchase Order Signoff',
      category: 'Procurement',
      priority: 'Medium',
      icon: DollarSign,
      description: 'Engineering department submitted purchase order #PO-44120 for $12,500.00 cloud infrastructure upgrades. Verify budget approval compliance.'
    },
    {
      title: 'Vendor Compliance & SLA Performance Review',
      category: 'Supply Chain',
      priority: 'Low',
      icon: FileCheck,
      description: 'Conduct quarterly automated compliance audit on logistics partner FastTrack Express. Calculate SLA breach penalties and penalty credits.'
    }
  ];

  const applyTemplate = (t) => {
    setTitle(t.title);
    setCategory(t.category);
    setPriority(t.priority);
    setDescription(t.description);
    toast.success(`Loaded template: ${t.title}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || description.length < 10) {
      return toast.error('Please provide a detailed description (at least 10 characters).');
    }

    setSubmitting(true);
    try {
      const res = await requestService.createRequest({
        title: title || 'Autonomous Operations Request',
        category,
        description,
        priority
      });

      if (res.success) {
        toast.success('Autonomous Multi-Agent Workflow Dispatched!');
        navigate(`/monitor?requestId=${res.data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit business request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
          <Sparkles className="w-4 h-4" /> Multi-Agent Operations Dispatcher
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Business Request</h1>
        <p className="text-xs text-slate-400">
          AgentFlow AI will autonomously coordinate Planner, Research, Workflow, Decision, and Report agents to resolve this request.
        </p>
      </div>

      {/* Templates */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Enterprise Workflow Template</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((tmpl, idx) => {
            const Icon = tmpl.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="text-left p-4 rounded-2xl glass-card glass-card-hover border border-slate-800 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {tmpl.category}
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-white group-hover:text-brand-300 transition-colors">{tmpl.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{tmpl.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Request Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Customer refund request because shipment is delayed"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Refund & Returns">Refund & Returns</option>
                <option value="Operations">Operations</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Procurement">Procurement</option>
                <option value="Fraud & Risk">Fraud & Risk</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Detailed Business Description & Context</label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide all background information, tracking numbers, customer accounts, financial values, or specific policy rules..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Orchestrating Autonomous Agents...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Dispatch Multi-Agent System Workflow
            </>
          )}
        </button>
      </form>
    </div>
  );
};
