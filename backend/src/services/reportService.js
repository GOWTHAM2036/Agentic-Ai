const { supabase, memoryStore } = require('../database/db');

async function getReportByRequestId(requestId) {
  let report = memoryStore.reports.find(r => r.request_id === requestId);
  if (!report && supabase) {
    const { data } = await supabase.from('reports').select('*').eq('request_id', requestId).single();
    if (data) report = data;
  }
  if (!report) {
    const err = new Error('Report not generated yet or request ID invalid');
    err.statusCode = 404;
    throw err;
  }
  return report;
}

async function getAllReports() {
  if (supabase) {
    try {
      const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (data && data.length) return data;
    } catch (e) {}
  }
  return memoryStore.reports;
}

async function getAnalyticsOverview() {
  const requests = memoryStore.business_requests;
  const reports = memoryStore.reports;
  const agentLogs = memoryStore.agent_logs;

  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'Completed').length;
  const pendingRequests = requests.filter(r => r.status !== 'Completed' && r.status !== 'Failed').length;
  const autoResolutionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 100;

  const agentActivityCounts = {
    'Orchestrator Agent': agentLogs.filter(l => l.agent_name === 'Orchestrator Agent').length,
    'Planner Agent': agentLogs.filter(l => l.agent_name === 'Planner Agent').length,
    'Research Agent': agentLogs.filter(l => l.agent_name === 'Research Agent').length,
    'Workflow Agent': agentLogs.filter(l => l.agent_name === 'Workflow Agent').length,
    'Decision Agent': agentLogs.filter(l => l.agent_name === 'Decision Agent').length,
    'Report Agent': agentLogs.filter(l => l.agent_name === 'Report Agent').length
  };

  const categoryBreakdown = [
    { name: 'Refund & Returns', value: requests.filter(r => r.category === 'Refund & Returns').length || 1 },
    { name: 'Operations', value: requests.filter(r => r.category === 'Operations').length || 1 },
    { name: 'Supply Chain', value: requests.filter(r => r.category === 'Supply Chain').length || 1 },
    { name: 'Procurement', value: requests.filter(r => r.category === 'Procurement').length || 1 },
    { name: 'Fraud & Risk', value: requests.filter(r => r.category === 'Fraud & Risk').length || 1 }
  ];

  return {
    total_requests: totalRequests,
    completed_requests: completedRequests,
    pending_requests: pendingRequests,
    auto_resolution_rate: `${autoResolutionRate}%`,
    avg_resolution_time: '4.2s',
    agent_activity_counts: agentActivityCounts,
    category_breakdown: categoryBreakdown,
    recent_reports: reports.slice(0, 5)
  };
}

module.exports = {
  getReportByRequestId,
  getAllReports,
  getAnalyticsOverview
};
