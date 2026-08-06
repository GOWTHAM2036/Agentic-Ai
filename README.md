# AgentFlow AI 🚀
### *An Autonomous Multi-Agent Business Operations Manager*

AgentFlow AI is an enterprise-grade autonomous multi-agent business operations management platform. Rather than acting as a conversational chatbot, AgentFlow AI functions as an **AI Employee**: autonomously receiving, planning, researching, executing, evaluating, and synthesizing complex multi-step business operations workflows.

Developed for the **Agentic AI & Intelligent Systems Hackathon**.

---

## 🌟 Key Capabilities & Hackathon Pillars

1. **Autonomous Planning**: Decomposes vague high-level business goals into ordered atomic tasks with estimated durations and dependencies.
2. **Context Research**: Queries historical customer logs, past order data, and corporate policy rules to establish baseline facts.
3. **Workflow Execution**: Runs simulated internal logistics checks, payment gateway pre-authorizations, and CRM updates.
4. **Autonomous Decision Making**: Applies corporate governance rules, risk scoring, and ethics to approve, reject, or escalate requests.
5. **Executive Synthesis**: Generates downloadable executive audit reports, timeline breakdowns, and financial impact summaries.

---

## 🏛 System Architecture

```
[ FRONTEND (Vercel) ]
React.js + Vite + Tailwind CSS + Framer Motion
       │ (REST APIs via Axios / JWT)
       ▼
[ BACKEND (Render) ]
Node.js + Express.js
 ├── Auth Middleware (JWT + bcryptjs)
 ├── Request Validators (Zod)
 └── Multi-Agent Orchestration Core
       ├── 🧠 Orchestrator Agent (Manager)
       ├── 📋 Planner Agent (Task Decomposition)
       ├── 🔍 Research Agent (Context & History Scan)
       ├── ⚙️ Workflow Agent (Logistics & API Logic)
       ├── ⚖️ Decision Agent (Autonomous Rules Engine)
       └── 📊 Report Agent (Executive Synthesis)
             │                     │
             ▼                     ▼
[ Supabase PostgreSQL ]    [ Google Gemini API ]
(Users, Requests, Logs,    (Gemini 2.5 Flash LLM
 Plans, Reports, History)   Reasoning & JSON Schema)
```

---

## 🤖 Multi-Agent System Roles & Responsibilities

| Agent Name | Role | Responsibilities | Expected JSON Output |
| :--- | :--- | :--- | :--- |
| **Orchestrator Agent** | Manager | Assesses request, routes workflow, updates state | `request_analysis`, `recommended_flow` |
| **Planner Agent** | Task Scheduler | Breaks request into 4-6 sequential steps | `tasks`, `total_steps`, `estimated_duration` |
| **Research Agent** | Analyst | Scans historical database, SLA policies & customer tier | `customer_tier`, `relevant_policies`, `verified_facts` |
| **Workflow Agent** | Executor | Runs logistics checks, payment checks, CRM updates | `actions_taken`, `system_outputs` |
| **Decision Agent** | Governance | Applies business rules matrix & grants approval | `verdict`, `decision_summary`, `justification` |
| **Report Agent** | Synthesizer | Compiles executive markdown report & timeline | `title`, `executive_summary`, `downloadable_markdown` |

---

## 💻 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Axios, React Router DOM, React Hot Toast.
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `zod`, `@google/generative-ai`, `@supabase/supabase-js`, `uuid`, `morgan`.
- **Database**: Supabase PostgreSQL (SQL migrations included) + In-memory fallback database.
- **Artificial Intelligence**: Google Gemini API (`gemini-2.5-flash`).
- **Deployment**: Vercel (Frontend), Render (Backend), Supabase (Database).

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will start at: `http://localhost:5000`
Healthcheck: `http://localhost:5000/health`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will start at: `http://localhost:5173`

---

## 🔐 Pre-Loaded Demo Credentials

For quick testing without external database dependencies, pre-loaded memory credentials are ready:

- **Operations Manager**: `manager@agentflow.ai` / `password123`
- **Administrator**: `admin@agentflow.ai` / `password123`

---

## 🛠 Database Setup (Supabase PostgreSQL)

To connect to a live Supabase PostgreSQL instance:
1. Open Supabase SQL Editor.
2. Run the SQL migrations script located in [`backend/src/database/schema.sql`](file:///c:/Users/B%20Gowtham%20Reddy/.vscode/Agentic%20AI/backend/src/database/schema.sql).
3. Set your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`.

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=agentflow_enterprise_jwt_secret_key_2026
JWT_EXPIRES_IN=24h
GEMINI_API_KEY=your_google_gemini_api_key_here
SUPABASE_URL=https://your-supabase-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Deployment Manifests

- **Backend (Render)**: Manifest provided in [`render.yaml`](file:///c:/Users/B%20Gowtham%20Reddy/.vscode/Agentic%20AI/render.yaml).
- **Frontend (Vercel)**: Configuration provided in [`frontend/vercel.json`](file:///c:/Users/B%20Gowtham%20Reddy/.vscode/Agentic%20AI/frontend/vercel.json).

---

## 📜 License

Distributed under the MIT License. Developed for Agentic AI & Intelligent Systems Hackathon.
