const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');

let supabase = null;

if (config.supabaseUrl && config.supabaseAnonKey) {
  try {
    supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey || config.supabaseAnonKey);
    console.log('[Database] Connected to Supabase PostgreSQL Client');
  } catch (err) {
    console.warn('[Database] Supabase connection error, falling back to memory store:', err.message);
  }
} else {
  console.log('[Database] Supabase credentials not found. Using local in-memory fallback database.');
}

// In-Memory Fallback Database for robust local development & demonstration
const memoryStore = {
  users: [
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Enterprise Admin',
      email: 'admin@agentflow.ai',
      password_hash: '$2b$10$E6i5XJKDQcAQXE/wOFkE2OtSOGy05fZJ8CXmC1ivBbWP/L8XeiYCe', // password123
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      name: 'Operations Manager',
      email: 'manager@agentflow.ai',
      password_hash: '$2b$10$E6i5XJKDQcAQXE/wOFkE2OtSOGy05fZJ8CXmC1ivBbWP/L8XeiYCe', // password123
      role: 'manager',
      created_at: new Date().toISOString()
    }
  ],
  business_requests: [
    {
      id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      user_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      title: 'Delayed Shipment Refund Request',
      category: 'Refund & Returns',
      description: 'Customer requests full refund of $480.00 because shipment #ORD-98214 was delayed by 7 business days beyond SLA.',
      priority: 'High',
      status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  execution_plans: [
    {
      id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
      request_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      tasks: [
        { id: 1, name: 'Parse refund details and shipment SLA parameters', duration_mins: 1, status: 'Completed' },
        { id: 2, name: 'Query customer tier and historical order logs', duration_mins: 1, status: 'Completed' },
        { id: 3, name: 'Run shipping carrier API delay verification check', duration_mins: 2, status: 'Completed' },
        { id: 4, name: 'Apply automatic refund matrix decision rule', duration_mins: 1, status: 'Completed' },
        { id: 5, name: 'Synthesize executive decision audit report', duration_mins: 1, status: 'Completed' }
      ],
      total_steps: 5,
      estimated_duration_mins: 6,
      status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  agent_logs: [
    {
      id: uuidv4(),
      request_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      agent_name: 'Orchestrator Agent',
      status: 'Completed',
      reasoning: 'Evaluated input request for Refund & Returns. Dispatched execution pipeline across 5 specialized agents.',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: uuidv4(),
      request_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      agent_name: 'Planner Agent',
      status: 'Completed',
      reasoning: 'Decomposed refund process into 5 atomic execution stages with automated verification checkpoints.',
      created_at: new Date(Date.now() - 3600000 * 2 + 1000).toISOString()
    },
    {
      id: uuidv4(),
      request_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      agent_name: 'Research Agent',
      status: 'Completed',
      reasoning: 'Retrieved order #ORD-98214 history. Verified customer has VIP status (LTV > $5,000) and 0 previous refund abuses.',
      created_at: new Date(Date.now() - 3600000 * 2 + 2000).toISOString()
    },
    {
      id: uuidv4(),
      request_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      agent_name: 'Workflow Agent',
      status: 'Completed',
      reasoning: 'Carrier logistics tracking confirmed 7-day delay due to weather exception. Automated payment voucher initialized.',
      created_at: new Date(Date.now() - 3600000 * 2 + 3000).toISOString()
    },
    {
      id: uuidv4(),
      request_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      agent_name: 'Decision Agent',
      status: 'Completed',
      reasoning: 'Approved 100% full refund ($480.00) plus $25.00 goodwill courtesy credit based on Tier-1 customer retention policy.',
      created_at: new Date(Date.now() - 3600000 * 2 + 4000).toISOString()
    },
    {
      id: uuidv4(),
      request_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      agent_name: 'Report Agent',
      status: 'Completed',
      reasoning: 'Generated complete executive markdown report and audit log for finance approval.',
      created_at: new Date(Date.now() - 3600000 * 2 + 5000).toISOString()
    }
  ],
  reports: [
    {
      id: uuidv4(),
      request_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      title: 'Executive Refund Approval Audit Report - ORD-98214',
      executive_summary: 'Customer request for $480.00 refund due to 7-day carrier shipment delay was processed autonomously. Research confirmed VIP tier status and zero fraud flags. Decision Agent approved 100% refund plus $25 retention credit.',
      timeline: [
        { time: '10:00:00', event: 'Request Received & Orchestrated' },
        { time: '10:00:02', event: 'Plan & Research Context Loaded' },
        { time: '10:00:05', event: 'Carrier Logistics Delay Verified' },
        { time: '10:00:07', event: 'Autonomous Approval & Voucher Created' },
        { time: '10:00:10', event: 'Executive Report Synthesized' }
      ],
      decisions_made: [
        { topic: 'Refund Approval', decision: 'APPROVED', Rationale: 'Carrier delay exceeded 5-day SLA threshold' },
        { topic: 'Courtesy Voucher', decision: 'GRANTED $25', Rationale: 'VIP Customer Retention policy Rule 4B' }
      ],
      downloadable_markdown: '# Executive Refund Audit Report\n\n**Status**: APPROVED\n**Amount**: $480.00 + $25.00 Voucher\n\n### Summary\nAutonmous agent pipeline successfully verified shipment exception and issued credit.',
      risk_level: 'Low',
      financial_impact: '$505.00',
      metrics: { confidence_score: 0.98, resolution_time_sec: 10, total_agents: 6 },
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  history: []
};

module.exports = {
  supabase,
  memoryStore
};
