-- AgentFlow AI - PostgreSQL Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager', 'analyst')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BUSINESS REQUESTS TABLE
CREATE TABLE IF NOT EXISTS business_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Operations' CHECK (category IN ('Operations', 'Refund & Returns', 'Supply Chain', 'Procurement', 'Fraud & Risk', 'Customer Support', 'Compliance')),
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Planning', 'Researching', 'Executing', 'Evaluating', 'Completed', 'Failed', 'Escalated')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EXECUTION PLANS TABLE
CREATE TABLE IF NOT EXISTS execution_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES business_requests(id) ON DELETE CASCADE,
    tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_steps INT NOT NULL DEFAULT 0,
    estimated_duration_mins INT NOT NULL DEFAULT 5,
    status VARCHAR(50) NOT NULL DEFAULT 'Generated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. AGENT LOGS TABLE
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES business_requests(id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL CHECK (agent_name IN ('Orchestrator Agent', 'Planner Agent', 'Research Agent', 'Workflow Agent', 'Decision Agent', 'Report Agent')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Waiting', 'Running', 'Completed', 'Failed', 'Skipped')),
    input_payload JSONB DEFAULT '{}'::jsonb,
    output_payload JSONB DEFAULT '{}'::jsonb,
    reasoning TEXT,
    execution_time_ms INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES business_requests(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    executive_summary TEXT NOT NULL,
    timeline JSONB DEFAULT '[]'::jsonb,
    decisions_made JSONB DEFAULT '[]'::jsonb,
    downloadable_markdown TEXT NOT NULL,
    risk_level VARCHAR(50) DEFAULT 'Low',
    financial_impact VARCHAR(100) DEFAULT '$0.00',
    metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. HISTORY TABLE
CREATE TABLE IF NOT EXISTS history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES business_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_taken VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    agent_involved VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON business_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON business_requests(status);
CREATE INDEX IF NOT EXISTS idx_agent_logs_request_id ON agent_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_reports_request_id ON reports(request_id);
CREATE INDEX IF NOT EXISTS idx_history_request_id ON history(request_id);

-- SEED DATA FOR DEMO PURPOSES
INSERT INTO users (id, name, email, password_hash, role)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Enterprise Admin', 'admin@agentflow.ai', '$2a$10$w8T0M4j2W04c5uXj.hW40uV4Ew3O/2kYl5Yn1V5Y0z1Q5e5R6h7tO', 'admin'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Operations Manager', 'manager@agentflow.ai', '$2a$10$w8T0M4j2W04c5uXj.hW40uV4Ew3O/2kYl5Yn1V5Y0z1Q5e5R6h7tO', 'manager')
ON CONFLICT (email) DO NOTHING;
