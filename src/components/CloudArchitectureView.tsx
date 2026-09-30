import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Cloud, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Server, 
  Globe, 
  GitBranch, 
  Lock, 
  Sparkles,
  Users,
  CheckCircle2,
  TrendingUp,
  Workflow
} from 'lucide-react';

export const CloudArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'concepts' | 'scalability' | 'stack_options'>('flow');
  const [selectedScale, setSelectedScale] = useState<'10' | '1000' | '100000'>('1000');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-purple-950/40 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
          <Cpu className="w-3.5 h-3.5" /> Cloud Computing Coursework Reference
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System Architecture & Cloud Engineering Concepts
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Comprehensive breakdown of end-to-end cloud data flow, service models (SaaS / PaaS / IaaS),
          multi-tenant user isolation, dual AI engines with fault-tolerant fallbacks, and horizontal scale transitions.
        </p>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'flow'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" /> End-to-End Cloud Data Flow
          </button>

          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'concepts'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Cloud Concepts Matrix (SaaS / PaaS / IaaS)
          </button>

          <button
            onClick={() => setActiveTab('scalability')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'scalability'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Scalability: 10 vs 1k vs 100k Users
          </button>

          <button
            onClick={() => setActiveTab('stack_options')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'stack_options'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Server className="w-3.5 h-3.5" /> Tech Stack Comparison (A, B, C)
          </button>
        </div>
      </div>

      {/* TAB 1: ARCHITECTURE & DATA FLOW */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          {/* Interactive Flow Diagram */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-sky-400" />
              Cloud Data Flow Diagram (Interactive Pipeline)
            </h2>
            <p className="text-xs text-slate-400">
              Trace how user requests move from client edge browsers down to serverless compute, AI inference, and dual persistence tiers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-3">
              {/* Step 1: User & Client */}
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 text-center flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 mx-auto flex items-center justify-center mb-2">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-sky-300 block uppercase font-mono">1. Client Layer</span>
                  <p className="text-xs text-slate-300 mt-1 font-semibold">Web Browser</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">React + Tailwind SPA</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 border-t border-slate-900 pt-1">
                  Edge CDN Hosting
                </div>
              </div>

              {/* Step 2: Auth */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-center flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mx-auto flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-300 block uppercase font-mono">2. Auth & IAM</span>
                  <p className="text-xs text-slate-300 mt-1 font-semibold">Bearer JWT</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">User Isolation Token</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 border-t border-slate-900 pt-1">
                  HTTPS Encryption
                </div>
              </div>

              {/* Step 3: API Gateway */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 text-center flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 mx-auto flex items-center justify-center mb-2">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-300 block uppercase font-mono">3. Application</span>
                  <p className="text-xs text-slate-300 mt-1 font-semibold">REST API</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Node/Express & Python</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 border-t border-slate-900 pt-1">
                  PaaS / Cloud Run
                </div>
              </div>

              {/* Step 4: AI Engine */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-center flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 block uppercase font-mono">4. AI & Fallback</span>
                  <p className="text-xs text-slate-300 mt-1 font-semibold">Gemini + Rules</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Fault-Tolerant Engine</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 border-t border-slate-900 pt-1">
                  JSON Schema Mode
                </div>
              </div>

              {/* Step 5: Cloud DB */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-center flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center mb-2">
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-300 block uppercase font-mono">5. Cloud DB</span>
                  <p className="text-xs text-slate-300 mt-1 font-semibold">Structured NoSQL</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Firestore / DynamoDB</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 border-t border-slate-900 pt-1">
                  Partitioned by User
                </div>
              </div>

              {/* Step 6: Object Storage */}
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 text-center flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center mb-2">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-300 block uppercase font-mono">6. Object Storage</span>
                  <p className="text-xs text-slate-300 mt-1 font-semibold">Cloud Bucket</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">S3 / GCS / Azure BLOB</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 border-t border-slate-900 pt-1">
                  Food Photos & Exports
                </div>
              </div>
            </div>

            {/* Text Architecture Box */}
            <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800">
              <div className="text-slate-500 mb-1">// End-to-End ASCII Pipeline Topology:</div>
              {`User (Web Browser)
  ↓ [HTTPS / TLS 1.3]
Frontend (React SPA on Edge CDN)
  ↓ [Bearer Authorization Token]
API Gateway / Load Balancer
  ↓ [REST API: /api/generate-plan, /api/upload]
PaaS Application Tier (Express / FastAPI)
  ├── AI Layer: Gemini 3.8 Flash (Fallback: Deterministic TDEE Engine)
  ├── Data Layer: Cloud Database (users, diet_plans collections)
  └── Storage Layer: Cloud Object Storage (s3://diet-bucket/users/{userId}/*)
  ↓
Aggregated JSON Response Delivered to User Dashboard`}
            </div>
          </div>

          {/* Simple vs Technical Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                Level A: Simple Explanation (Student / Non-Technical)
              </span>
              <h3 className="text-lg font-bold text-white">What is this project and why use Cloud?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Imagine trying to keep track of a custom diet plan on a piece of paper: if you lose the paper, or try to check it from your phone at the grocery store, you can’t. 
                By using <strong>Cloud Computing</strong>, your profile and nutrition plans are stored in a central, secure virtual data center on the internet.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                When you input your age, activity, and goals, the cloud calls an <strong>AI Brain</strong> to instantly calculate balanced meals, saves the results so you can access them from any laptop or mobile phone, and lets you upload meal pictures to a digital storage locker.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                Level B: Technical Explanation (Recruiter & Placement Ready)
              </span>
              <h3 className="text-lg font-bold text-white">Microservice & Persistence Architecture</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This system implements a <strong>3-Tier Cloud Native Architecture</strong>: Client presentation, stateless RESTful compute (PaaS), and decoupled persistence (Dual NoSQL Document DB + BLOB Object Storage).
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authentication utilizes cryptographically signed <strong>JWTs</strong> providing stateless authorization and enforcing multi-tenant row-level user isolation. The AI module implements a <strong>Circuit Breaker / Fallback Pattern</strong>: when upstream LLM APIs experience rate-limits or 503 outages, execution falls back automatically to an in-process Mifflin-St Jeor TDEE deterministic engine, preserving high availability (99.9% uptime SLA).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLOUD CONCEPTS MATRIX */}
      {activeTab === 'concepts' && (
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Cloud Computing Concepts Matrix</h2>
            <p className="text-xs text-slate-400 mt-1">
              Exact mapping of theoretical cloud syllabus concepts directly to implementations in this codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-sky-400 uppercase font-mono mb-1">SaaS (Software as a Service)</div>
              <p className="text-xs text-slate-300">
                The deployed web app interface (DietCloud) accessed via browser without requiring users to install local dependencies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-indigo-400 uppercase font-mono mb-1">PaaS (Platform as a Service)</div>
              <p className="text-xs text-slate-300">
                The managed runtime hosting our backend REST API (e.g. Google Cloud Run, AWS Elastic Beanstalk, Render) where OS patching is handled automatically.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-purple-400 uppercase font-mono mb-1">IaaS (Infrastructure as a Service)</div>
              <p className="text-xs text-slate-300">
                Virtual machines, VPC virtual networking, and elastic compute blocks (EC2, Google Compute Engine) providing underlying raw computing power.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-emerald-400 uppercase font-mono mb-1">Cloud Database</div>
              <p className="text-xs text-slate-300">
                Structured document storage for user credentials and calculated dietary plans with ACID or eventual consistency guarantees.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-rose-400 uppercase font-mono mb-1">Object Storage (BLOB)</div>
              <p className="text-xs text-slate-300">
                Flat bucket architecture (Amazon S3 / GCS) storing meal images and JSON/MD export files addressed by unique URI keys.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-amber-400 uppercase font-mono mb-1">Stateless REST API</div>
              <p className="text-xs text-slate-300">
                Endpoints receive full context in every request via Bearer headers; no server-side session memory allows instant horizontal scaling.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-cyan-400 uppercase font-mono mb-1">Elasticity & Autoscaling</div>
              <p className="text-xs text-slate-300">
                Dynamic provisioning and de-provisioning of container replicas based on incoming HTTP request concurrency and CPU thresholds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-teal-400 uppercase font-mono mb-1">High Availability (99.9% SLA)</div>
              <p className="text-xs text-slate-300">
                Multi-zone deployment with automatic failover to local rule-based AI when third-party cloud services experience outages.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-violet-400 uppercase font-mono mb-1">Secrets Management</div>
              <p className="text-xs text-slate-300">
                Sensitive API keys and DB credentials passed via environment variables (<code className="text-slate-400">.env</code>) and cloud vaults, never hardcoded.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCALABILITY DEEP DIVE */}
      {activeTab === 'scalability' && (
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">System Scalability Transitions</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate what happens as traffic expands from a student prototype to an enterprise cloud deployment.
              </p>
            </div>

            {/* Scale Selector Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedScale('10')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedScale === '10' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                10 Users (Dev)
              </button>
              <button
                onClick={() => setSelectedScale('1000')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedScale === '1000' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1,000 Users (Prod)
              </button>
              <button
                onClick={() => setSelectedScale('100000')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedScale === '100000' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                100,000 Users (Scale)
              </button>
            </div>
          </div>

          {/* Scale Scenario Details */}
          {selectedScale === '10' && (
            <div className="p-5 rounded-xl bg-slate-950 border border-sky-500/30 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 text-sm font-bold">
                <Users className="w-4 h-4" /> Tier 1: Local / Prototyping (10 Users)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Architecture:</strong> Single container or local server running both frontend and backend. In-memory or SQLite database. Local file simulation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Bottleneck</span>
                  <span className="text-slate-200 font-semibold">Single Point of Failure (SPOF)</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Cost</span>
                  <span className="text-emerald-400 font-semibold">$0.00 / Free Tier</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">AI Strategy</span>
                  <span className="text-sky-300 font-semibold">Direct synchronous API calls</span>
                </div>
              </div>
            </div>
          )}

          {selectedScale === '1000' && (
            <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                <Users className="w-4 h-4" /> Tier 2: Managed Cloud Application (1,000 Users)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Architecture:</strong> Stateless containers hosted on PaaS (Google Cloud Run or AWS ECS). Managed cloud document database (Firestore / RDS Postgres). Static assets distributed on Cloud CDN. Media directly committed to Amazon S3 / Google Cloud Storage.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Autoscaling</span>
                  <span className="text-slate-200 font-semibold">2 to 5 container instances</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Caching</span>
                  <span className="text-indigo-400 font-semibold">Redis cache for diet recipes</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">AI Resilience</span>
                  <span className="text-amber-300 font-semibold">Circuit-breaker fallback engine</span>
                </div>
              </div>
            </div>
          )}

          {selectedScale === '100000' && (
            <div className="p-5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
                <Users className="w-4 h-4" /> Tier 3: High-Throughput Enterprise Cloud (100,000 Users)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Architecture:</strong> Global Anycast DNS and Application Load Balancers (ALB). Horizontally autoscaling Kubernetes cluster (EKS/GKE). Decoupled asynchronous task queues (RabbitMQ / AWS SQS / Cloud PubSub) for AI meal generation. Cloud Database configured with multi-region read replicas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Queueing</span>
                  <span className="text-purple-300 font-semibold">Pub/Sub worker pool for AI</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Database</span>
                  <span className="text-emerald-400 font-semibold">Primary + 4 Read Replicas</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Storage</span>
                  <span className="text-rose-400 font-semibold">CloudFront CDN + S3 Lifecycle</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TECH STACK COMPARISON */}
      {activeTab === 'stack_options' && (
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Technology Stack Implementation Options</h2>
            <p className="text-xs text-slate-400 mt-1">
              Comparing beginner, recommended, and advanced cloud stacks for academic grading and placement showcases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option A */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase font-mono">Option A • Beginner</span>
                <h3 className="text-base font-bold text-white mt-1">HTML + Flask + SQLite</h3>
                <ul className="text-xs text-slate-300 space-y-2 mt-3">
                  <li>• <strong>Frontend:</strong> Pure HTML5, CSS3, Vanilla JS</li>
                  <li>• <strong>Backend:</strong> Python Flask microframework</li>
                  <li>• <strong>Database:</strong> SQLite local file</li>
                  <li>• <strong>Storage:</strong> Local folder simulation</li>
                  <li>• <strong>Difficulty:</strong> Beginner (1/5)</li>
                  <li>• <strong>Cost:</strong> $0 / Free</li>
                </ul>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                Best for: Quick classroom demo without cloud account setup.
              </span>
            </div>

            {/* Option B (RECOMMENDED) */}
            <div className="p-5 rounded-xl bg-slate-950 border border-sky-500/50 relative flex flex-col justify-between space-y-4 shadow-lg shadow-sky-500/10">
              <span className="absolute -top-2.5 right-4 bg-sky-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                Recommended
              </span>
              <div>
                <span className="text-[11px] font-bold text-sky-400 uppercase font-mono">Option B • Placement Ready</span>
                <h3 className="text-base font-bold text-white mt-1">React + FastAPI/Express + Cloud DB</h3>
                <ul className="text-xs text-slate-300 space-y-2 mt-3">
                  <li>• <strong>Frontend:</strong> React SPA with Tailwind CSS</li>
                  <li>• <strong>Backend:</strong> Express.js / FastAPI REST API</li>
                  <li>• <strong>Database:</strong> Firestore / Supabase / In-Memory NoSQL</li>
                  <li>• <strong>Storage:</strong> Simulated or Live S3 Bucket / GCS</li>
                  <li>• <strong>AI:</strong> Gemini 3.8 Flash + Local Fallback</li>
                  <li>• <strong>Difficulty:</strong> Intermediate (3/5)</li>
                </ul>
              </div>
              <span className="text-[11px] text-sky-300 bg-sky-950/60 p-2 rounded border border-sky-850">
                Best for: Strong GitHub portfolio proof-of-work with zero out-of-pocket costs.
              </span>
            </div>

            {/* Option C */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase font-mono">Option C • Advanced Enterprise</span>
                <h3 className="text-base font-bold text-white mt-1">Next.js + AWS / GCP Serverless</h3>
                <ul className="text-xs text-slate-300 space-y-2 mt-3">
                  <li>• <strong>Frontend:</strong> Next.js SSR / SSG on Vercel</li>
                  <li>• <strong>Backend:</strong> AWS Lambda + API Gateway</li>
                  <li>• <strong>Database:</strong> Amazon DynamoDB / Aurora Serverless</li>
                  <li>• <strong>Storage:</strong> Amazon S3 with CloudFront CDN</li>
                  <li>• <strong>Auth:</strong> AWS Cognito / Firebase Auth</li>
                  <li>• <strong>Difficulty:</strong> Advanced (5/5)</li>
                </ul>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                Best for: Cloud Architect & DevOps engineering interviews.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
