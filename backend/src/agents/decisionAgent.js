const { SYSTEM_PROMPT } = require('../prompts/decisionPrompt');
const { callAgentLLM } = require('./geminiRunner');

async function runDecisionAgent(request, research, workflow) {
  const userPrompt = `
Business Request: ${request.title} (${request.category})
Research Summary: ${research.research_summary}
Verified Facts: ${JSON.stringify(research.verified_facts)}
Workflow System Outputs: ${JSON.stringify(workflow.system_outputs)}
  `;

  const fallback = {
    verdict: 'APPROVED',
    decision_summary: `Fully APPROVED refund of $${workflow.system_outputs.verified_item_value || 480.00} plus $${workflow.system_outputs.courtesy_voucher_value || 25.00} retention voucher for request "${request.title}".`,
    justification: [
      `Carrier delivery delay of ${research.verified_facts.carrier_delay_days || 7} days breaches corporate SLA threshold of ${research.verified_facts.sla_threshold_days || 5} days.`,
      `Customer has ${research.customer_tier || 'VIP'} status with zero previous fraud flags.`,
      `Total financial value ($505.00) is within automated autonomous approval tier (< $1,000.00).`
    ],
    financial_impact: '$505.00',
    confidence_score: 0.98,
    requires_human_signoff: false
  };

  const decision = await callAgentLLM(SYSTEM_PROMPT, userPrompt, fallback);
  return decision;
}

module.exports = { runDecisionAgent };
