import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, Sparkles, Shield, Cpu, Cloud, Database, HardDrive } from 'lucide-react';

interface FAQItem {
  question: string;
  category: 'Architecture' | 'Storage & DB' | 'Security & Auth' | 'Resilience & AI' | 'Scalability';
  answer: string;
  keyTakeaway: string;
}

export const InterviewGuideView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const faqs: FAQItem[] = [
    {
      category: 'Storage & DB',
      question: 'How do Cloud Databases and Cloud Object Storage differ in this application?',
      answer: 'In this project, Cloud Databases (e.g. Firestore, DynamoDB, PostgreSQL) store structured, queryable data models with high transactional integrity—specifically user profiles, macronutrient targets, and diet plan records indexed by primary keys. Cloud Object Storage (e.g. Amazon S3, Google Cloud Storage), on the other hand, is an unstructured BLOB store designed to hold binary files like meal photos and plan export documents (.json, .md) indexed by flat hierarchical URI keys (e.g. s3://bucket/users/123/meal.jpg). Databases allow complex queries and filtering, while object storage provides practically infinite horizontal capacity at significantly lower storage costs.',
      keyTakeaway: 'Databases = Structured, indexed, queryable data. Object Storage = Unstructured binary BLOBs and media files.'
    },
    {
      category: 'Resilience & AI',
      question: 'How does your application guarantee High Availability if the upstream AI API experiences an outage?',
      answer: 'I implemented the Fallback / Graceful Degradation Pattern. When a user requests a diet plan, the backend first attempts an asynchronous inference call to the Gemini 3.8 Flash model. If the call times out, encounters rate limits, returns HTTP 503, or if no API key is provisioned, the backend catches the exception and immediately invokes a deterministic, local rule-based nutrition engine. This rule engine computes Mifflin-St Jeor Basal Metabolic Rate and Total Daily Energy Expenditure (TDEE) and selects balanced recipes from pre-compiled datasets. The user still receives a valid meal plan without downtime, satisfying high availability SLAs.',
      keyTakeaway: 'Always design AI systems with offline rule-based fallbacks to prevent third-party API dependencies from creating single points of failure.'
    },
    {
      category: 'Security & Auth',
      question: 'How did you ensure multi-tenant security and prevent User A from accessing User B’s data?',
      answer: 'Security is enforced through cryptographic Bearer tokens (JWTs) and server-side authorization middleware. When a user signs in, they receive a signed token containing their unique user ID. On every protected request (/api/profile, /api/plans/:id, /api/files/:id), the API gateway and Express/FastAPI middleware parses the token. When retrieving or deleting records, the backend strictly checks `record.userId === authenticatedUser.id`. If a user attempts to access an ID belonging to another tenant, the server terminates the request with HTTP 403 Forbidden.',
      keyTakeaway: 'Never rely on client-side routing guards alone; enforce user ownership validation at the API controller layer.'
    },
    {
      category: 'Scalability',
      question: 'How would you scale this application from 10 users to 100,000 active users?',
      answer: 'At 10 users, a single container with in-memory storage suffices. At 1,000 users, we decouple into a stateless container on PaaS (Google Cloud Run / AWS ECS) behind a load balancer, connect to a managed cloud database (Firestore / RDS), and cache popular diet recipes in Redis. At 100,000 users, we implement horizontal container autoscaling across multiple availability zones, place an Application Load Balancer (ALB) and CloudFront CDN in front of static assets, decouple LLM meal generation using asynchronous message queues (RabbitMQ or AWS SQS), and configure database read replicas with connection pooling.',
      keyTakeaway: 'Stateless compute + Asynchronous task queues + Read replicas + Edge caching = Enterprise scale.'
    },
    {
      category: 'Architecture',
      question: 'Where do SaaS, PaaS, and IaaS appear in this project?',
      answer: 'SaaS (Software as a Service) is the DietCloud web application delivered to end users over the browser. PaaS (Platform as a Service) is the managed hosting runtime (such as Cloud Run, Render, or Vercel) where our Node/Express/Python backend executes without managing underlying OS updates or physical hardware. IaaS (Infrastructure as a Service) consists of the cloud provider’s underlying virtual machines (EC2, Google Compute Engine) and virtual private clouds (VPC) that furnish raw CPU, memory, and virtual networking.',
      keyTakeaway: 'SaaS is what users consume; PaaS is where developer code runs; IaaS is the underlying virtual hardware.'
    },
    {
      category: 'Security & Auth',
      question: 'How are sensitive API keys and cloud credentials protected?',
      answer: 'We adhere to the 12-Factor App methodology for configuration. Sensitive credentials (such as GEMINI_API_KEY and database secrets) are stored exclusively in server-side environment variables (.env locally, and Cloud Secret Manager or GCP KMS in production). They are never committed to Git (.gitignore excludes .env) and are never exposed in frontend browser bundles. Client requests communicate exclusively through secure server proxy routes (/api/*).',
      keyTakeaway: 'Never hardcode secrets. Always use environment variables and server-side API proxying.'
    }
  ];

  const filteredFaqs = selectedCategory === 'ALL'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider font-mono">
          <BookOpen className="w-3.5 h-3.5" /> Technical Interview Readiness
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Cloud Computing Interview Masterclass
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive answers to the top questions software engineering and cloud recruiters ask about this project.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['ALL', 'Architecture', 'Storage & DB', 'Security & Auth', 'Resilience & AI', 'Scalability'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-850/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-rose-400 border border-slate-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-semibold">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div className="p-1 rounded bg-slate-850 text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-rose-950 text-xs text-rose-300 font-medium">
                    🎯 <strong>Recruiter Answer Summary:</strong> {faq.keyTakeaway}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
