import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Completed':
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Running':
      case 'Executing':
      case 'Planning':
      case 'Researching':
      case 'Evaluating':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse';
      case 'Pending':
      case 'Waiting':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'Failed':
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
};
