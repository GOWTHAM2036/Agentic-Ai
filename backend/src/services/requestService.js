const { supabase, memoryStore } = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const { executeMultiAgentWorkflow } = require('../agents/orchestratorAgent');

async function createBusinessRequest(userId, requestData) {
  const newReq = {
    id: uuidv4(),
    user_id: userId,
    title: requestData.title,
    category: requestData.category || 'Operations',
    description: requestData.description,
    priority: requestData.priority || 'Medium',
    status: 'Pending',
    metadata: requestData.metadata || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  memoryStore.business_requests.unshift(newReq);
  if (supabase) {
    try { await supabase.from('business_requests').insert([newReq]); } catch (e) {}
  }

  // Trigger agent workflow asynchronously in background
  executeMultiAgentWorkflow(newReq).catch(err => {
    console.error('[Async Agent Execution Error]', err);
  });

  return newReq;
}

async function getAllBusinessRequests() {
  if (supabase) {
    try {
      const { data } = await supabase.from('business_requests').select('*').order('created_at', { ascending: false });
      if (data && data.length) return data;
    } catch (e) {}
  }
  return memoryStore.business_requests;
}

async function getBusinessRequestById(id) {
  let req = memoryStore.business_requests.find(r => r.id === id);
  if (!req && supabase) {
    const { data } = await supabase.from('business_requests').select('*').eq('id', id).single();
    if (data) req = data;
  }
  if (!req) {
    const err = new Error('Business request not found');
    err.statusCode = 404;
    throw err;
  }
  return req;
}

async function getRequestLogs(requestId) {
  let logs = memoryStore.agent_logs.filter(l => l.request_id === requestId);
  if (supabase) {
    try {
      const { data } = await supabase.from('agent_logs').select('*').eq('request_id', requestId).order('created_at', { ascending: true });
      if (data && data.length) logs = data;
    } catch (e) {}
  }
  return logs;
}

module.exports = {
  createBusinessRequest,
  getAllBusinessRequests,
  getBusinessRequestById,
  getRequestLogs
};
