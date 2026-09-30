import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Table, 
  Key, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Check, 
  X, 
  Search, 
  FileJson, 
  ShieldCheck, 
  ArrowRight,
  HardDrive,
  Users,
  Layers,
  Sparkles,
  Link
} from 'lucide-react';
import { ApiService } from '../services/api.ts';
import type { UserProfile, DietPlan, StoredFile } from '../types/index.ts';

interface DatabaseSchemaViewProps {
  currentUser: UserProfile | null;
  onRefreshGlobalStats?: () => void;
}

export const DatabaseSchemaView: React.FC<DatabaseSchemaViewProps> = ({ currentUser, onRefreshGlobalStats }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'users' | 'plans' | 'files'>('schema');
  const [schemaData, setSchemaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [plansList, setPlansList] = useState<DietPlan[]>([]);
  const [filesList, setFilesList] = useState<StoredFile[]>([]);

  // Edit states
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);
  const [editPlanTitle, setEditPlanTitle] = useState('');
  const [editPlanGoal, setEditPlanGoal] = useState('');

  // JSON viewer modal
  const [inspectRecord, setInspectRecord] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schema, users, plans, files] = await Promise.all([
        ApiService.getDatabaseSchema(),
        ApiService.getAllUsers(),
        currentUser ? ApiService.getSavedPlans() : Promise.resolve([]),
        currentUser ? ApiService.getStoredFiles() : Promise.resolve([])
      ]);
      setSchemaData(schema);
      setUsersList(users);
      setPlansList(plans);
      setFilesList(files);
    } catch (err) {
      console.warn('Could not load database records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Execute DELETE /api/plans/' + id + ' on Cloud Database?')) return;
    try {
      await ApiService.deletePlan(id);
      setPlansList(prev => prev.filter(p => p.id !== id));
      if (onRefreshGlobalStats) onRefreshGlobalStats();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete plan');
    }
  };

  const handleStartEditPlan = (plan: DietPlan) => {
    setEditingPlan(plan);
    setEditPlanTitle(plan.title);
    setEditPlanGoal(plan.goal);
  };

  const handleSaveEditPlan = async () => {
    if (!editingPlan) return;
    try {
      const updated = await ApiService.updatePlan(editingPlan.id, {
        title: editPlanTitle,
        goal: editPlanGoal as any
      });
      setPlansList(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditingPlan(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to update plan record');
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm('Execute DELETE /api/files/' + id + ' on Cloud Object Storage?')) return;
    try {
      await ApiService.deleteStoredFile(id);
      setFilesList(prev => prev.filter(f => f.id !== id));
      if (onRefreshGlobalStats) onRefreshGlobalStats();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete file');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl border border-emerald-800/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
              <Database className="w-3.5 h-3.5" /> Cloud Database & Persistence Layer
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Schema Architecture & Live CRUD Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Demonstrates complete relational & document schemas for <code className="text-emerald-300">users</code>, <code className="text-emerald-300">diet_plans</code>, and <code className="text-emerald-300">user_files</code>, with active REST CRUD operations.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Cloud DB
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'schema'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Database ERD Schema
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'users'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Collection: users ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'plans'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Table className="w-3.5 h-3.5" /> Collection: diet_plans ({plansList.length})
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'files'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" /> Collection: user_files ({filesList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: VISUAL SCHEMA & ERD DESIGN */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          {/* ERD Diagram Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Table 1: USERS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                <div className="p-4 bg-emerald-950/60 border-b border-emerald-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-sm text-white font-mono">1. users</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                    Primary Entity
                  </span>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Key className="w-3 h-3" /> id (PK)
                    </span>
                    <span className="text-slate-400">string (UUID)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span className="text-emerald-300 font-semibold">email (Index)</span>
                    <span className="text-slate-500">string (Unique)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>passwordHash</span>
                    <span className="text-slate-500">string (Salted)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>name</span>
                    <span className="text-slate-500">string</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>age, heightCm, weightKg</span>
                    <span className="text-slate-500">number</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>activityLevel</span>
                    <span className="text-slate-500">enum (1.2-1.725)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>dietaryPreference</span>
                    <span className="text-slate-500">enum</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>goal, allergies</span>
                    <span className="text-slate-500">string</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>createdAt</span>
                    <span className="text-slate-500">timestamp</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-emerald-400" />
                <span>Relationship: <strong>1-to-Many</strong> to diet_plans & user_files</span>
              </div>
            </div>

            {/* Table 2: DIET_PLANS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                <div className="p-4 bg-sky-950/60 border-b border-sky-850/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-sm text-white font-mono">2. diet_plans</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-300 bg-sky-900/60 px-2 py-0.5 rounded border border-sky-700/50">
                    1:N Child of users
                  </span>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Key className="w-3 h-3" /> id (PK)
                    </span>
                    <span className="text-slate-400">string (UUID)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono bg-sky-950/40 p-2 rounded-lg border border-sky-900/40">
                    <span className="text-sky-300 font-semibold flex items-center gap-1">
                      <Link className="w-3 h-3" /> userId (FK)
                    </span>
                    <span className="text-sky-400">→ users.id</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>title</span>
                    <span className="text-slate-500">string</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>generatedBy</span>
                    <span className="text-slate-500">gemini / rule_based</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>breakfast, lunch</span>
                    <span className="text-slate-500">json (MealItem)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>snack, dinner</span>
                    <span className="text-slate-500">json (MealItem)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>nutritionSummary</span>
                    <span className="text-slate-500">json (Macros/Cal)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>hydrationReminder</span>
                    <span className="text-slate-500">json</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>createdAt</span>
                    <span className="text-slate-500">timestamp</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Security: Partitioned by userId (Tenant Isolation)</span>
              </div>
            </div>

            {/* Table 3: USER_FILES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                <div className="p-4 bg-indigo-950/60 border-b border-indigo-850/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-sm text-white font-mono">3. user_files</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700/50">
                    Object Storage Index
                  </span>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Key className="w-3 h-3" /> id (PK)
                    </span>
                    <span className="text-slate-400">string (obj_...)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/40">
                    <span className="text-indigo-300 font-semibold flex items-center gap-1">
                      <Link className="w-3 h-3" /> userId (FK)
                    </span>
                    <span className="text-indigo-400">→ users.id</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>filename</span>
                    <span className="text-slate-500">string (Clean)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>contentType</span>
                    <span className="text-slate-500">string (MIME)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>sizeBytes</span>
                    <span className="text-slate-500">number (Bytes)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>storagePath</span>
                    <span className="text-slate-500">s3://... URI</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>bucket</span>
                    <span className="text-slate-500">string</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>etag</span>
                    <span className="text-slate-500">string (MD5)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono p-1 text-slate-300">
                    <span>uploadedAt</span>
                    <span className="text-slate-500">timestamp</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                <span>Object Storage: BLOB Pointer + Bucket Quota</span>
              </div>
            </div>
          </div>

          {/* Database Schema Code Export */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-400" />
              Raw Cloud Database Schema Specification (JSON-LD format)
            </h3>
            <pre className="text-xs font-mono text-emerald-300/90 bg-slate-950 p-4 rounded-xl border border-slate-850 overflow-x-auto max-h-72">
              {JSON.stringify(schemaData?.database || {}, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: USERS COLLECTION CRUD */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Cloud Database Collection: <code>users</code>
              </h3>
              <p className="text-xs text-slate-400">Read & Inspect registered user entities</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-850">
              Total Documents: {usersList.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">User ID (PK)</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Preference</th>
                  <th className="p-3">Goal</th>
                  <th className="p-3">Biometrics</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3 font-mono text-emerald-400">{u.id}</td>
                    <td className="p-3 font-semibold text-white">{u.name}</td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3">
                      <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                        {u.dietaryPreference}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{u.goal}</td>
                    <td className="p-3 font-mono text-slate-400">
                      {u.age}y • {u.heightCm}cm • {u.weightKg}kg
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setInspectRecord(u)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                      >
                        JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DIET PLANS COLLECTION CRUD */}
      {activeTab === 'plans' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4">
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Table className="w-4 h-4 text-sky-400" />
                Cloud Database Collection: <code>diet_plans</code>
              </h3>
              <p className="text-xs text-slate-400">Full CRUD: Create, Read, Update, and Delete documents</p>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-950 px-2.5 py-1 rounded-lg border border-sky-850">
              User Documents: {plansList.length}
            </span>
          </div>

          {editingPlan && (
            <div className="p-4 mx-4 rounded-xl bg-sky-950/40 border border-sky-800/60 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5 font-mono">
                  <Edit3 className="w-3.5 h-3.5" /> UPDATE Document: {editingPlan.id}
                </span>
                <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Plan Title</label>
                  <input
                    type="text"
                    value={editPlanTitle}
                    onChange={(e) => setEditPlanTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Goal</label>
                  <input
                    type="text"
                    value={editPlanGoal}
                    onChange={(e) => setEditPlanGoal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingPlan(null)}
                  className="px-3 py-1 text-xs rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditPlan}
                  className="px-3 py-1 text-xs rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Save Changes (PUT)
                </button>
              </div>
            </div>
          )}

          {plansList.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No plan documents in current user's partition. Generate a plan and save to persist.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Plan ID (PK)</th>
                    <th className="p-3">Owner (FK)</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Engine</th>
                    <th className="p-3">Calories</th>
                    <th className="p-3 text-right">CRUD Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {plansList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3 font-mono text-sky-400">{p.id}</td>
                      <td className="p-3 font-mono text-slate-400">{p.userId}</td>
                      <td className="p-3 font-semibold text-white">{p.title}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
                          {p.generatedBy}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {p.nutritionSummary?.calories} kcal
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => setInspectRecord(p)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                          title="View Document JSON"
                        >
                          JSON
                        </button>
                        <button
                          onClick={() => handleStartEditPlan(p)}
                          className="px-2 py-1 rounded bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-850"
                          title="Update Plan (PUT)"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlan(p.id)}
                          className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-850"
                          title="Delete Plan (DELETE)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USER FILES CRUD */}
      {activeTab === 'files' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4">
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                Cloud Object Storage Collection: <code>user_files</code>
              </h3>
              <p className="text-xs text-slate-400">Bucket Index Records & BLOB pointers</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-850">
              User Objects: {filesList.length}
            </span>
          </div>

          {filesList.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No files in current user's bucket partition. Upload a meal photo to inspect storage metadata.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">File ID (PK)</th>
                    <th className="p-3">Filename</th>
                    <th className="p-3">Content Type</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">S3 / GCS Path</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filesList.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3 font-mono text-indigo-400">{f.id}</td>
                      <td className="p-3 font-semibold text-white">{f.filename}</td>
                      <td className="p-3 font-mono text-slate-400">{f.contentType}</td>
                      <td className="p-3 font-mono">{(f.sizeBytes / 1024).toFixed(1)} KB</td>
                      <td className="p-3 font-mono text-slate-400 truncate max-w-xs">{f.storagePath}</td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => setInspectRecord(f)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                        >
                          JSON
                        </button>
                        <button
                          onClick={() => handleDeleteFile(f.id)}
                          className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-850"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Record Inspector Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-white font-mono">
                  Document JSON Inspector
                </span>
              </div>
              <button
                onClick={() => setInspectRecord(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-y-auto bg-slate-950 flex-1 leading-relaxed">
              {JSON.stringify(inspectRecord, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
