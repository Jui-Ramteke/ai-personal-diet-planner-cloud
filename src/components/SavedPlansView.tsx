import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Utensils, 
  Flame, 
  Plus, 
  RefreshCw, 
  Database 
} from 'lucide-react';
import { ApiService } from '../services/api.ts';
import type { DietPlan, UserProfile } from '../types/index.ts';

interface SavedPlansViewProps {
  user: UserProfile | null;
  onSelectPlan: (plan: DietPlan) => void;
  onOpenGenerator: () => void;
  onOpenAuth: () => void;
  onApplyTodayPlan?: (plan: DietPlan) => void;
}

export const SavedPlansView: React.FC<SavedPlansViewProps> = ({
  user,
  onSelectPlan,
  onOpenGenerator,
  onOpenAuth,
  onApplyTodayPlan
}) => {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPlans = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await ApiService.getSavedPlans();
      setPlans(data);
    } catch (err) {
      console.warn('Could not load saved plans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remove this plan from your saved cloud library?')) return;

    setDeletingId(id);
    try {
      await ApiService.deletePlan(id);
      setPlans(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete plan');
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-4 my-8 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <Database className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Sign In to View Your Saved Meal Plans</h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Save personalized meal plans to your private cloud database and load them onto your daily tracker at any time.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2"
        >
          Sign In or Load Demo
        </button>
      </div>
    );
  }

  const preferenceColors: Record<string, { tag: string; border: string }> = {
    'Vegetarian': { tag: 'text-emerald-800 bg-emerald-100 border-emerald-200', border: 'border-emerald-200 hover:border-emerald-400' },
    'Vegan': { tag: 'text-lime-800 bg-lime-100 border-lime-200', border: 'border-lime-200 hover:border-lime-400' },
    'General/Non-Vegetarian': { tag: 'text-rose-800 bg-rose-100 border-rose-200', border: 'border-rose-200 hover:border-rose-400' },
    'Mediterranean': { tag: 'text-orange-800 bg-orange-100 border-orange-200', border: 'border-orange-200 hover:border-orange-400' },
    'Keto': { tag: 'text-amber-800 bg-amber-100 border-amber-200', border: 'border-amber-200 hover:border-amber-400' },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with lush multi-color gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold font-mono uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" />
            Cloud Database Collection (diet_plans)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Saved Meal Blueprints 📂
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-xl">
            All personalized diet plans synchronized to your account in the cloud database.
          </p>
        </div>

        <button
          onClick={onOpenGenerator}
          className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          Create New Plan
        </button>
      </div>

      {/* Plan list */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs font-bold">Querying Cloud Database...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-3xl border border-stone-200/80 p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-stone-800 text-base">No Saved Plans Yet</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Generate a personalized diet plan using the AI Planner and commit it to your cloud database collection.
          </p>
          <button
            onClick={onOpenGenerator}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Generate First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((p) => {
            const prefStyle = preferenceColors[p.dietaryPreference] || { tag: 'text-stone-800 bg-stone-100 border-stone-200', border: 'border-stone-200' };

            return (
              <div
                key={p.id}
                onClick={() => onSelectPlan(p)}
                className={`bg-white rounded-3xl p-6 border ${prefStyle.border} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${prefStyle.tag}`}>
                        {p.dietaryPreference}
                      </span>
                      <h3 className="font-extrabold text-stone-900 text-base group-hover:text-emerald-700 transition-colors leading-snug">
                        {p.title}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      disabled={deletingId === p.id}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Macro Pills with rich distinct colors */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold font-mono my-3">
                    <div className="bg-orange-50 text-orange-700 py-1.5 rounded-xl border border-orange-200">
                      <span className="text-[9px] block uppercase text-orange-500 font-bold">Energy</span>
                      {p.nutritionSummary.calories} kcal
                    </div>
                    <div className="bg-rose-50 text-rose-700 py-1.5 rounded-xl border border-rose-200">
                      <span className="text-[9px] block uppercase text-rose-500 font-bold">Protein</span>
                      {p.nutritionSummary.proteinG}g
                    </div>
                    <div className="bg-amber-50 text-amber-700 py-1.5 rounded-xl border border-amber-200">
                      <span className="text-[9px] block uppercase text-amber-500 font-bold">Carbs</span>
                      {p.nutritionSummary.carbsG}g
                    </div>
                  </div>

                  {/* Meal preview list with colorful icons */}
                  <div className="text-xs text-stone-600 space-y-1 pt-1 font-medium">
                    <div className="truncate"><span className="text-amber-500">🌅</span> {p.breakfast.title}</div>
                    <div className="truncate"><span className="text-emerald-500">☀️</span> {p.lunch.title}</div>
                    <div className="truncate"><span className="text-rose-500">🌙</span> {p.dinner.title}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {onApplyTodayPlan && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyTodayPlan(p);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Make this your active daily plan"
                      >
                        <Utensils className="w-3 h-3 text-emerald-600" />
                        Set as Today
                      </button>
                    )}

                    <span className="font-bold text-stone-700 group-hover:text-emerald-700 flex items-center gap-1">
                      View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
