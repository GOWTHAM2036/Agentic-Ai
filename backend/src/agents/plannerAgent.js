const { SYSTEM_PROMPT } = require('../prompts/plannerPrompt');
const { callAgentLLM } = require('./geminiRunner');

async function runPlannerAgent(request) {
  const userPrompt = `
Business Request Title: ${request.title}
Category: ${request.category}
Priority: ${request.priority}
Description: ${request.description}
  `;

  const fallback = {
    total_steps: 5,
    estimated_duration_mins: 6,
    tasks: [
      { id: 1, name: `Decompose request requirements for ${request.category}`, duration_mins: 1, assigned_agent: 'Planner Agent', status: 'Completed' },
      { id: 2, name: 'Query customer order history and SLA policies', duration_mins: 1, assigned_agent: 'Research Agent', status: 'Completed' },
      { id: 3, name: 'Execute logistics & payment gateway verification workflow', duration_mins: 2, assigned_agent: 'Workflow Agent', status: 'Completed' },
      { id: 4, name: 'Apply corporate decision rules matrix', duration_mins: 1, assigned_agent: 'Decision Agent', status: 'Completed' },
      { id: 5, name: 'Synthesize executive audit report and timeline', duration_mins: 1, assigned_agent: 'Report Agent', status: 'Completed' }
    ]
  };

  const plan = await callAgentLLM(SYSTEM_PROMPT, userPrompt, fallback);
  return plan;
}

module.exports = { runPlannerAgent };
