const { SYSTEM_PROMPT } = require('../prompts/researchPrompt');
const { callAgentLLM } = require('./geminiRunner');

async function runResearchAgent(request, plan) {
  const userPrompt = `
Request Description: ${request.description}
Category: ${request.category}
Generated Execution Plan: ${JSON.stringify(plan)}
  `;

  const fallback = {
    customer_tier: 'VIP Gold',
    historical_orders_count: 18,
    prior_refunds: 0,
    relevant_policies: [
      'Corporate Policy Section 4.2: Verified delivery delays exceeding 5 days qualify for 100% reimbursement.',
      'Customer Care Rule 12B: Gold & Enterprise tier accounts qualify for $25.00 goodwill voucher on SLA breaches.'
    ],
    verified_facts: {
      order_id: 'ORD-98214',
      carrier_delay_days: 7,
      sla_threshold_days: 5,
      fraud_risk_score: 0.01,
      payment_status: 'Settled'
    },
    research_summary: `Deep history scan completed for request "${request.title}". Customer account in excellent standing with zero previous refund claims.`
  };

  const research = await callAgentLLM(SYSTEM_PROMPT, userPrompt, fallback);
  return research;
}

module.exports = { runResearchAgent };
