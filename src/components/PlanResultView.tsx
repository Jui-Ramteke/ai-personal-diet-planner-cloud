import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Database, 
  Download, 
  Droplets, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Utensils, 
  Flame, 
  Leaf, 
  Check, 
  Scale, 
  Calendar,
  Share2,
  RefreshCw,
  ShoppingBag,
  Globe,
  Heart
} from 'lucide-react';
import { ApiService } from '../services/api.ts';
import type { DietPlan, UserProfile, MealItem } from '../types/index.ts';

interface PlanResultViewProps {
  plan: DietPlan;
  user: UserProfile | null;
  onBack: () => void;
  onOpenAuth: () => void;
  onApplyTodayPlan?: (plan: DietPlan) => void;
  onNavigateToGrocery?: () => void;
}

export const PlanResultView: React.FC<PlanResultViewProps> = ({ 
  plan: initialPlan, 
  user, 
  onBack, 
  onOpenAuth,
  onApplyTodayPlan,
  onNavigateToGrocery
}) => {
  const [plan, setPlan] = useState<DietPlan>(initialPlan);
  const [savingToDb, setSavingToDb] = useState(false);
  const [dbSaved, setDbSaved] = useState(Boolean(initialPlan.cloudDbRef));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [swappingSlot, setSwappingSlot] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveToCloudDb = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setSavingToDb(true);
    try {
      const saved = await ApiService.savePlan(plan);
      setPlan(saved);
      setDbSaved(true);
      showToast('Diet plan saved to Cloud Database!');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save to Cloud Database');
    } finally {
      setSavingToDb(false);
    }
  };

  const handleDownloadLocal = () => {
    const jsonStr = JSON.stringify(plan, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diet_plan_${plan.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleItemCheck = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSwapMeal = async (slot: 'breakfast' | 'lunch' | 'snack' | 'dinner', calories: number, currentTitle: string) => {
    setSwappingSlot(slot);
    try {
      const response = await ApiService.swapMeal({
        slot,
        dietaryPreference: plan.dietaryPreference,
        calories,
        currentTitle,
        cuisineStyle: plan.cuisineStyle
      });

      if (response.success && response.meal) {
        setPlan(prev => ({
          ...prev,
          [slot]: response.meal
        }));
        showToast(`Swapped ${slot} with ${response.meal.title}!`);
      }
    } catch (err: any) {
      showToast('Could not swap meal at this time');
    } finally {
      setSwappingSlot(null);
    }
  };

  const handleAddToGroceryList = () => {
    if (onApplyTodayPlan) {
      onApplyTodayPlan(plan);
    }
    showToast('All wholesome ingredients synced to your Active Tracker & Grocery List!');
  };

  const meals = [
    { 
      key: 'breakfast', 
      slot: '🌅 Breakfast', 
      time: '08:00 AM', 
      data: plan.breakfast, 
      border: 'border-amber-200', 
      bg: 'bg-amber-50/30',
      badge: 'bg-amber-500 text-white' 
    },
    { 
      key: 'lunch', 
      slot: '☀️ Lunch', 
      time: '01:00 PM', 
      data: plan.lunch, 
      border: 'border-emerald-200', 
      bg: 'bg-emerald-50/30',
      badge: 'bg-emerald-600 text-white' 
    },
    { 
      key: 'snack', 
      slot: '🍏 Afternoon Snack', 
      time: '04:30 PM', 
      data: plan.snack, 
      border: 'border-pink-200', 
      bg: 'bg-pink-50/30',
      badge: 'bg-pink-600 text-white' 
    },
    { 
      key: 'dinner', 
      slot: '🌙 Dinner', 
      time: '08:00 PM', 
      data: plan.dinner, 
      border: 'border-rose-200', 
      bg: 'bg-rose-50/30',
      badge: 'bg-rose-600 text-white' 
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Planner
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onApplyTodayPlan && (
            <button
              onClick={() => onApplyTodayPlan(plan)}
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" /> Set as Today's Fuel
            </button>
          )}

          <button
            onClick={handleAddToGroceryList}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" /> Send to Grocery
          </button>

          <button
            onClick={handleSaveToCloudDb}
            disabled={savingToDb || dbSaved}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              dbSaved
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            {dbSaved ? 'Saved in Cloud DB' : savingToDb ? 'Saving...' : 'Save to Cloud DB'}
          </button>

          <button
            onClick={handleDownloadLocal}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" /> Download JSON
          </button>
        </div>
      </div>

      {/* Plan Header Card with vibrant gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider">
              {plan.dietaryPreference}
            </span>
            {plan.cuisineStyle && (
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono flex items-center gap-1">
                <Globe className="w-3 h-3" /> {plan.cuisineStyle}
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider">
              {plan.goal}
            </span>
            <span className="bg-emerald-950/40 border border-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono">
              {plan.generatedBy === 'gemini-3.8-flash'
                ? '✨ Gemini 3.8 Flash AI'
                : plan.generatedBy === 'rule_based_fallback'
                  ? '⚡ Smart Algorithm (Resilience Mode)'
                  : '⚡ Smart Algorithm Engine'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {plan.title}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-50 max-w-2xl leading-relaxed">
            {plan.nutritionSummary.microNutrientNotes}
          </p>

          {plan.healthFocus && plan.healthFocus.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {plan.healthFocus.map((hf, idx) => (
                <span key={idx} className="bg-white/15 backdrop-blur-md text-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/20">
                  ✓ {hf}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Macronutrient Balance Showcase with 5 distinct appetizing colors */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white border border-orange-200 p-4 rounded-2xl shadow-xs text-center">
          <span className="text-[10px] font-mono uppercase font-bold text-orange-600 block">Total Energy</span>
          <span className="text-xl font-black text-stone-900 mt-1 block">{plan.nutritionSummary.calories}</span>
          <span className="text-[10px] text-stone-400 font-medium">kcal/day</span>
        </div>

        <div className="bg-white border border-rose-200 p-4 rounded-2xl shadow-xs text-center">
          <span className="text-[10px] font-mono uppercase font-bold text-rose-600 block">Protein</span>
          <span className="text-xl font-black text-rose-700 mt-1 block">{plan.nutritionSummary.proteinG}g</span>
          <span className="text-[10px] text-stone-400 font-medium">Lean repair</span>
        </div>

        <div className="bg-white border border-amber-200 p-4 rounded-2xl shadow-xs text-center">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-600 block">Clean Carbs</span>
          <span className="text-xl font-black text-amber-700 mt-1 block">{plan.nutritionSummary.carbsG}g</span>
          <span className="text-[10px] text-stone-400 font-medium">Energy fuel</span>
        </div>

        <div className="bg-white border border-lime-200 p-4 rounded-2xl shadow-xs text-center">
          <span className="text-[10px] font-mono uppercase font-bold text-lime-700 block">Healthy Fats</span>
          <span className="text-xl font-black text-lime-800 mt-1 block">{plan.nutritionSummary.fatG}g</span>
          <span className="text-[10px] text-stone-400 font-medium">Good lipids</span>
        </div>

        <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xs text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 block">Dietary Fiber</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">{plan.nutritionSummary.fiberG}g</span>
          <span className="text-[10px] text-stone-400 font-medium">Microbiome</span>
        </div>
      </div>

      {/* Meal Breakdown Cards with signature colors & Dish Swap */}
      <div className="space-y-5">
        <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-600" />
          Meal-by-Meal Schedule & Ingredients
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {meals.map((m) => (
            <div
              key={m.key}
              className={`bg-white rounded-3xl border ${m.border} overflow-hidden shadow-xs flex flex-col justify-between`}
            >
              <div>
                {/* Photo */}
                <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                  <img
                    src={m.data.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'}
                    alt={m.data.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <span className={`absolute top-3 left-3 ${m.badge} text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl shadow-2xs`}>
                    {m.slot} · {m.time}
                  </span>

                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-stone-900 text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl shadow-2xs">
                    {m.data.estimatedCalories} kcal
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold">
                    <span className="block truncate">{m.data.portion} · {m.data.prepTimeMinutes || 15}m prep</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                    {m.data.title}
                  </h3>

                  {/* Ingredients Checklist */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Ingredients & Checklist:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-600">
                      {m.data.items.map((item, idx) => {
                        const checkKey = `${m.key}_${idx}`;
                        const isChecked = checkedItems[checkKey];
                        return (
                          <li
                            key={idx}
                            onClick={() => toggleItemCheck(checkKey)}
                            className="flex items-start gap-2 cursor-pointer select-none group"
                          >
                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                              isChecked 
                                ? 'bg-emerald-600 border-emerald-600 text-white' 
                                : 'border-stone-300 group-hover:border-emerald-500'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                            <span className={isChecked ? 'line-through text-stone-400' : 'text-stone-700 font-medium'}>
                              {item}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Preparation Instructions */}
                  {m.data.instructions && m.data.instructions.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Quick Preparation Steps:
                      </span>
                      <ol className="list-decimal list-inside text-xs text-stone-600 space-y-1">
                        {m.data.instructions.slice(0, 3).map((step, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer with Swap Meal */}
              <div className="p-4 pt-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                <button
                  type="button"
                  onClick={() => handleSwapMeal(m.key as any, m.data.estimatedCalories, m.data.title)}
                  disabled={swappingSlot === m.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${swappingSlot === m.key ? 'animate-spin text-emerald-600' : 'text-stone-500'}`} />
                  {swappingSlot === m.key ? 'Swapping...' : 'Swap Dish'}
                </button>
                <span className="text-[11px] font-mono text-stone-500">
                  {m.data.tags?.slice(0, 2).join(' · ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration Protocol Card in Sky Blue */}
      <div className="bg-white rounded-3xl p-6 border border-sky-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-100 text-sky-600 border border-sky-200">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-stone-900 text-sm">
              Daily Hydration Schedule & Mineral Electrolytes
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Target: <strong>{plan.hydrationReminder.targetLiters} Liters</strong> ({plan.hydrationReminder.glassesPerDay} glasses)
            </p>
            <p className="text-xs text-sky-700 mt-1 italic">
              ⚡ {plan.hydrationReminder.electrolyteTip}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {plan.hydrationReminder.schedule.slice(0, 3).map((slot, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-mono font-bold">
              {slot}
            </span>
          ))}
        </div>
      </div>

      {/* Educational Notice */}
      <p className="text-[11px] text-stone-400 text-center italic">
        {plan.disclaimer || 'Nutritional output is an educational simulation and does not constitute clinical dietary therapy.'}
      </p>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
