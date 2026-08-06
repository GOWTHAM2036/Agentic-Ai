const { SYSTEM_PROMPT } = require('../prompts/orchestratorPrompt');
const { callAgentLLM } = require('./geminiRunner');
const { runPlannerAgent } = require('./plannerAgent');
const { runResearchAgent } = require('./researchAgent');
const { runWorkflowAgent } = require('./workflowAgent');
const { runDecisionAgent } = require('./decisionAgent');
const { runReportAgent } = require('./reportAgent');
const { supabase, memoryStore } = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// Helper to log agent steps to database or memory store
async function logAgentExecution(requestId, agentName, status, reasoning, inputPayload = {}, outputPayload = {}, timeMs = 0) {
  const logEntry = {
    id: uuidv4(),
    request_id: requestId,
    agent_name: agentName,
    status,
    reasoning,
    input_payload: inputPayload,
    output_payload: outputPayload,
    execution_time_ms: timeMs,
    created_at: new Date().toISOString()
  };

  logger.agent(agentName, `Status: ${status} - ${reasoning.substring(0, 80)}...`);

  // Write to memory store
  memoryStore.agent_logs.push(logEntry);

  // Write to Supabase if configured
  if (supabase) {
    try {
      await supabase.from('agent_logs').insert([logEntry]);
    } catch (err) {
      logger.warn('[Supabase Log Insert Error]', err.message);
    }
  }
  return logEntry;
}

// Helper to update business request status
async function updateRequestStatus(requestId, status) {
  const reqObj = memoryStore.business_requests.find(r => r.id === requestId);
  if (reqObj) {
    reqObj.status = status;
    reqObj.updated_at = new Date().toISOString();
  }

  if (supabase) {
    try {
      await supabase.from('business_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', requestId);
    } catch (err) {
      logger.warn('[Supabase Request Update Error]', err.message);
    }
  }
}

/**
 * Main Orchestrator Engine for executing multi-agent business operations
 */
async function executeMultiAgentWorkflow(request) {
  const startTime = Date.now();
  const requestId = request.id;

  logger.info(`Starting Orchestrator Agent Pipeline for Request: ${request.title} (ID: ${requestId})`);

  try {
    // 1. ORCHESTRATOR INITIAL ASSESSMENT
    await updateRequestStatus(requestId, 'Planning');
    await logAgentExecution(
      requestId,
      'Orchestrator Agent',
      'Running',
      'Assessing business request input parameters and dispatching multi-agent execution pipeline.',
      { title: request.title, category: request.category }
    );

    const orchestratorAnalysis = await callAgentLLM(
      SYSTEM_PROMPT,
      `Request Title: ${request.title}\nCategory: ${request.category}\nDescription: ${request.description}`,
      {
        request_analysis: `High priority operational ticket for ${request.category}. Initiating autonomous multi-agent resolution.`,
        recommended_flow: ['Planner Agent', 'Research Agent', 'Workflow Agent', 'Decision Agent', 'Report Agent'],
        risk_assessment: request.priority || 'Medium',
        initial_notes: 'Checking customer tier, carrier logistics, and policy compliance.'
      }
    );

    await logAgentExecution(
      requestId,
      'Orchestrator Agent',
      'Completed',
      orchestratorAnalysis.request_analysis,
      { title: request.title },
      orchestratorAnalysis,
      Date.now() - startTime
    );

    // 2. PLANNER AGENT
    const planStartTime = Date.now();
    await updateRequestStatus(requestId, 'Planning');
    await logAgentExecution(requestId, 'Planner Agent', 'Running', 'Decomposing business request into sequential tasks...');

    const plan = await runPlannerAgent(request);

    // Store Plan
    const planRecord = {
      id: uuidv4(),
      request_id: requestId,
      tasks: plan.tasks,
      total_steps: plan.total_steps,
      estimated_duration_mins: plan.estimated_duration_mins,
      status: 'Completed',
      created_at: new Date().toISOString()
    };
    memoryStore.execution_plans.push(planRecord);
    if (supabase) {
      try { await supabase.from('execution_plans').insert([planRecord]); } catch (e) {}
    }

    await logAgentExecution(
      requestId,
      'Planner Agent',
      'Completed',
      `Decomposed request into ${plan.total_steps} sequential stages with estimated duration of ${plan.estimated_duration_mins} mins.`,
      { request_title: request.title },
      plan,
      Date.now() - planStartTime
    );

    // 3. RESEARCH AGENT
    const researchStartTime = Date.now();
    await updateRequestStatus(requestId, 'Researching');
    await logAgentExecution(requestId, 'Research Agent', 'Running', 'Querying database history, policy rules, and customer profile...');

    const research = await runResearchAgent(request, plan);

    await logAgentExecution(
      requestId,
      'Research Agent',
      'Completed',
      research.research_summary || 'Retrieved customer tier and corporate policy rules.',
      { request_id: requestId },
      research,
      Date.now() - researchStartTime
    );

    // 4. WORKFLOW AGENT
    const workflowStartTime = Date.now();
    await updateRequestStatus(requestId, 'Executing');
    await logAgentExecution(requestId, 'Workflow Agent', 'Running', 'Executing simulated API checks, carrier tracking, and workflow calculations...');

    const workflow = await runWorkflowAgent(request, research);

    await logAgentExecution(
      requestId,
      'Workflow Agent',
      'Completed',
      workflow.execution_notes || 'Executed internal checks and API operations successfully.',
      { facts: research.verified_facts },
      workflow,
      Date.now() - workflowStartTime
    );

    // 5. DECISION AGENT
    const decisionStartTime = Date.now();
    await updateRequestStatus(requestId, 'Evaluating');
    await logAgentExecution(requestId, 'Decision Agent', 'Running', 'Applying governance rules, ethics, and corporate policy matrix...');

    const decision = await runDecisionAgent(request, research, workflow);

    await logAgentExecution(
      requestId,
      'Decision Agent',
      'Completed',
      decision.decision_summary || `Verdict: ${decision.verdict}`,
      { facts: research.verified_facts, system_outputs: workflow.system_outputs },
      decision,
      Date.now() - decisionStartTime
    );

    // 6. REPORT AGENT
    const reportStartTime = Date.now();
    await updateRequestStatus(requestId, 'Completed');
    await logAgentExecution(requestId, 'Report Agent', 'Running', 'Compiling executive report, audit logs, and downloadable document...');

    const report = await runReportAgent(request, plan, research, workflow, decision);

    const reportRecord = {
      id: uuidv4(),
      request_id: requestId,
      title: report.title || `Executive Audit Report - ${request.title}`,
      executive_summary: report.executive_summary,
      timeline: report.timeline,
      decisions_made: report.decisions_made,
      downloadable_markdown: report.downloadable_markdown,
      risk_level: report.risk_level || 'Low',
      financial_impact: report.financial_impact || '$0.00',
      metrics: report.metrics || {},
      created_at: new Date().toISOString()
    };
    memoryStore.reports.push(reportRecord);
    if (supabase) {
      try { await supabase.from('reports').insert([reportRecord]); } catch (e) {}
    }

    await logAgentExecution(
      requestId,
      'Report Agent',
      'Completed',
      'Executive report generated and stored in system database.',
      { decision_verdict: decision.verdict },
      report,
      Date.now() - reportStartTime
    );

    logger.info(`Multi-Agent Pipeline completed successfully for Request ID ${requestId} in ${Date.now() - startTime}ms`);
    return {
      success: true,
      plan: planRecord,
      report: reportRecord,
      decision
    };
  } catch (err) {
    logger.error(`Multi-Agent Pipeline failed for Request ID ${requestId}: ${err.message}`);
    await updateRequestStatus(requestId, 'Failed');
    await logAgentExecution(requestId, 'Orchestrator Agent', 'Failed', `Pipeline error: ${err.message}`);
    throw err;
  }
}

module.exports = {
  executeMultiAgentWorkflow
};
