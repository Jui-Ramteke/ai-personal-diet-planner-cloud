import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  Zap, 
  Shield, 
  RefreshCw,
  Salad,
  Flame,
  Activity,
  Heart,
  Droplets,
  Scale,
  Utensils,
  Sliders,
  Globe,
  Leaf,
  Clock,
  Target,
  Info
} from 'lucide-react';
import { ApiService } from '../services/api.ts';
import type { UserProfile, DietPlan, DietaryPreference, FitnessGoal, ActivityLevel } from '../types/index.ts';

interface PlanGeneratorProps {
  user: UserProfile | null;
  onPlanGenerated: (plan: DietPlan) => void;
  onOpenAuth: () => void;
}

export const PlanGenerator: React.FC<PlanGeneratorProps> = ({ user, onPlanGenerated, onOpenAuth }) => {
  const [engineMode, setEngineMode] = useState<'gemini' | 'rule_based' | 'simulate_failure'>('gemini');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Form parameters
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(user?.dietaryPreference || 'Vegetarian');
  const [goal, setGoal] = useState<FitnessGoal>(user?.goal || 'Weight-management demo');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user?.activityLevel || 'Moderately Active');
  const [age, setAge] = useState(user?.age || 26);
  const [heightCm, setHeightCm] = useState(user?.heightCm || 174);
  const [weightKg, setWeightKg] = useState(user?.weightKg || 70);
  const [allergies, setAllergies] = useState(user?.allergies || '');

  // Advanced Personalization Parameters
  const [cuisineStyle, setCuisineStyle] = useState<string>('Mediterranean & Coastal');
  const [healthFocus, setHealthFocus] = useState<string[]>([
    'Gut Microbiome & High Fiber',
    'Antioxidants & Anti-Inflammatory'
  ]);
  const [favoriteFoods, setFavoriteFoods] = useState<string>('Avocado, wild berries, olive oil, quinoa');
  
  // Real-time metabolic calculations (Mifflin-St Jeor)
  const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 70);
  const activityMultipliers: Record<ActivityLevel, number> = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725
  };
  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.4));

  // Target Calories State & Quick Mode
  const [calorieMode, setCalorieMode] = useState<'deficit' | 'maintenance' | 'surplus' | 'custom'>('deficit');
  const defaultCalories = calorieMode === 'deficit' 
    ? Math.max(1300, tdee - 450)
    : calorieMode === 'surplus'
      ? tdee + 350
      : tdee;
  const [customCalories, setCustomCalories] = useState<number>(defaultCalories);

  // Handle calorie mode click
  const handleCalorieModeChange = (mode: 'deficit' | 'maintenance' | 'surplus' | 'custom') => {
    setCalorieMode(mode);
    if (mode === 'deficit') setCustomCalories(Math.max(1300, tdee - 450));
    else if (mode === 'maintenance') setCustomCalories(tdee);
    else if (mode === 'surplus') setCustomCalories(tdee + 350);
  };

  const activeTargetCalories = customCalories;

  // Real-time macro estimation based on preference & goal
  const proteinRatio = dietaryPreference === 'Keto' ? 0.25 : goal === 'Fitness-oriented demo' ? 0.32 : 0.26;
  const fatRatio = dietaryPreference === 'Keto' ? 0.70 : dietaryPreference === 'Mediterranean' ? 0.30 : 0.26;
  const carbRatio = Math.max(0.04, 1 - proteinRatio - fatRatio);

  const estimatedProteinG = Math.round((activeTargetCalories * proteinRatio) / 4);
  const estimatedCarbsG = Math.round((activeTargetCalories * carbRatio) / 4);
  const estimatedFatG = Math.round((activeTargetCalories * fatRatio) / 9);
  const estimatedFiberG = Math.round(14 * (activeTargetCalories / 1000));

  const steps = [
    'Connecting to DietCloud API Gateway...',
    'Evaluating Mifflin-St Jeor TDEE & macro targets...',
    engineMode === 'gemini' 
      ? 'Synthesizing with Gemini 3.8 Flash & nutritional schema...' 
      : engineMode === 'simulate_failure'
        ? 'Detecting Simulated Cloud Outage -> Activating Resilience Fallback...'
        : 'Running Deterministic Multi-Cuisine Algorithm...',
    'Filtering allergen safety & matching flavor profile...',
    'Finalizing balanced recipe instructions & cloud sync...'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 400);

    try {
      const response = await ApiService.generatePlan({
        mode: engineMode,
        profileOverride: {
          age,
          heightCm,
          weightKg,
          activityLevel,
          dietaryPreference,
          goal,
          allergies
        },
        cuisineStyle,
        targetCaloriesOverride: activeTargetCalories,
        healthFocus,
        favoriteFoods
      });

      clearInterval(interval);
      setLoadingStep(steps.length - 1);
      setTimeout(() => {
        setLoading(false);
        onPlanGenerated(response.plan);
      }, 350);
    } catch (err: any) {
      clearInterval(interval);
      setLoading(false);
      setError(err?.message || 'Failed to generate plan. Please try again.');
    }
  };

  const allergenPresets = [
    { tag: 'Gluten-Free', color: 'bg-amber-50 text-amber-900 border-amber-300' },
    { tag: 'Dairy-Free', color: 'bg-sky-50 text-sky-900 border-sky-300' },
    { tag: 'Peanut-Free', color: 'bg-pink-50 text-pink-900 border-pink-300' },
    { tag: 'Tree Nut-Free', color: 'bg-rose-50 text-rose-900 border-rose-300' },
    { tag: 'Soy-Free', color: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
    { tag: 'Egg-Free', color: 'bg-orange-50 text-orange-900 border-orange-300' },
    { tag: 'Low-Sodium', color: 'bg-teal-50 text-teal-900 border-teal-300' }
  ];

  const toggleAllergen = (tag: string) => {
    if (allergies.includes(tag)) {
      setAllergies(allergies.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim());
    } else {
      setAllergies(allergies ? `${allergies}, ${tag}` : tag);
    }
  };

  const toggleHealthFocus = (focus: string) => {
    if (healthFocus.includes(focus)) {
      setHealthFocus(healthFocus.filter(f => f !== focus));
    } else {
      setHealthFocus([...healthFocus, focus]);
    }
  };

  const dietOptions: { 
    title: DietaryPreference; 
    label: string; 
    icon: string; 
    desc: string;
    activeBorder: string;
    activeBg: string;
  }[] = [
    { 
      title: 'Vegetarian', 
      label: 'Balanced Vegetarian', 
      icon: '🥗', 
      desc: 'Whole grains, lentils, paneer, Greek yogurt & greens',
      activeBorder: 'border-emerald-500',
      activeBg: 'bg-emerald-50/70'
    },
    { 
      title: 'Vegan', 
      label: 'Plant-Based Vegan', 
      icon: '🥦', 
      desc: 'Tofu, chickpeas, quinoa, chia, edamame & nuts',
      activeBorder: 'border-lime-500',
      activeBg: 'bg-lime-50/70'
    },
    { 
      title: 'General/Non-Vegetarian', 
      label: 'High Protein / Omnivore', 
      icon: '🥩', 
      desc: 'Wild poultry, pasture eggs, salmon & complex carbs',
      activeBorder: 'border-rose-500',
      activeBg: 'bg-rose-50/70'
    },
    { 
      title: 'Mediterranean', 
      label: 'Mediterranean Vitality', 
      icon: '🥑', 
      desc: 'Cold-pressed olive oil, herbs, seafood & legumes',
      activeBorder: 'border-orange-500',
      activeBg: 'bg-orange-50/70'
    },
    { 
      title: 'Keto', 
      label: 'Keto / Low-Carb', 
      icon: '🧀', 
      desc: 'Avocados, healthy nuts, seeds & clean lipids',
      activeBorder: 'border-amber-500',
      activeBg: 'bg-amber-50/70'
    },
    { 
      title: 'Pescatarian', 
      label: 'Ocean Pescatarian', 
      icon: '🐟', 
      desc: 'Wild fish, shellfish, plant proteins & greens',
      activeBorder: 'border-sky-500',
      activeBg: 'bg-sky-50/70'
    }
  ];

  const cuisineStyles = [
    { name: 'Mediterranean & Coastal', icon: '🌿', desc: 'Olive oil, fresh lemon, oregano, kalamata, farro', border: 'border-emerald-300' },
    { name: 'Modern Indian & Spiced', icon: '🍛', desc: 'Turmeric, roasted cumin, lentils, paneer, greens', border: 'border-amber-300' },
    { name: 'East Asian & Umami', icon: '🥢', desc: 'Ginger-sesame bowls, edamame, bok choy, miso', border: 'border-rose-300' },
    { name: 'Mexican & Latino Fiesta', icon: '🥑', desc: 'Black beans, sweet potato, pico de gallo, avocado lime', border: 'border-orange-300' },
    { name: 'California Clean & Bowls', icon: '🥗', desc: 'Superfood grain bowls, microgreens, berry crunches', border: 'border-teal-300' },
    { name: 'Rustic Italian & Olive', icon: '🍝', desc: 'San Marzano tomatoes, fresh basil, farro, capers', border: 'border-pink-300' }
  ];

  const healthFocusOptions = [
    { name: 'Gut Microbiome & High Fiber', icon: '🦠', desc: 'Prebiotics & diverse plant fibers' },
    { name: 'High Protein & Muscle Recovery', icon: '⚡', desc: 'Sustained amino acid release' },
    { name: 'Heart Health & Low Sodium', icon: '🫀', desc: 'Omega-3s, potassium & minerals' },
    { name: 'Stable Glucose & Low GI', icon: '🩸', desc: 'Low glycemic load & steady energy' },
    { name: 'Antioxidants & Anti-Inflammatory', icon: '🫐', desc: 'Polyphenols & berry compounds' },
    { name: 'Quick Prep Under 20 Mins', icon: '⏱️', desc: 'Streamlined cooking & easy prep' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Diet Food Inspired Hero Header with rich colors */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider font-mono">
            <Salad className="w-3.5 h-3.5" /> AI Nutrition & Diet Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Design Your Personalized Daily Diet Plan 🥗
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
            Generate clean, nutrient-dense whole food blueprints strictly tailored to your basal metabolic rate, target calories, cuisine preferences, and allergies.
          </p>

          {!user && (
            <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
              <span className="text-xs text-white">
                Operating as <strong>Guest</strong>. Sign in to save plans to your permanent cloud library.
              </span>
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl ml-3 shrink-0 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Metabolic Energy Dial Bar with multi-colors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-orange-200 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 border border-orange-200">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-orange-700 uppercase font-mono block font-bold">Estimated BMR</span>
            <span className="text-base font-black text-stone-900">{bmr} <span className="text-xs font-normal text-stone-500">kcal</span></span>
          </div>
        </div>

        <div className="bg-white border border-sky-200 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-600 border border-sky-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-sky-700 uppercase font-mono block font-bold">Daily TDEE</span>
            <span className="text-base font-black text-sky-800">{tdee} <span className="text-xs font-normal text-stone-500">kcal</span></span>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-700 uppercase font-mono block font-bold">Target Calories</span>
            <span className="text-base font-black text-emerald-800">{activeTargetCalories} <span className="text-xs font-normal text-stone-500">kcal</span></span>
          </div>
        </div>

        <div className="bg-white border border-pink-200 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-100 text-pink-600 border border-pink-200">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-pink-700 uppercase font-mono block font-bold">Hydration Goal</span>
            <span className="text-base font-black text-pink-800">{((weightKg * 0.035) + 0.3).toFixed(1)} <span className="text-xs font-normal text-stone-500">Liters</span></span>
          </div>
        </div>
      </div>

      {/* Main Generator Form */}
      <form onSubmit={handleGenerate} className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* Section 1: AI Engine Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              1. Recommendation Engine Architecture
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setEngineMode('gemini')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                engineMode === 'gemini'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-2xs'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Gemini 3.8 Flash
                </span>
                <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-md">Cloud AI</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Custom chef creations, authentic seasonings, step-by-step instructions & exact macro fits.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setEngineMode('rule_based')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                engineMode === 'rule_based'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-2xs'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-stone-600" />
                  Smart Rule Engine
                </span>
                <span className="text-[9px] bg-stone-200 text-stone-700 font-bold px-1.5 py-0.5 rounded-md">Deterministic</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Instant clinical Mifflin-St Jeor formula with multi-cuisine allergen substitution.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setEngineMode('simulate_failure')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                engineMode === 'simulate_failure'
                  ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-2xs'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" />
                  Simulate Outage
                </span>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">Resilience</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Simulates cloud 503 error to verify seamless offline local algorithm failover.
              </p>
            </button>
          </div>
        </div>

        {/* Section 2: Dietary Philosophy & Preference */}
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Salad className="w-4 h-4 text-emerald-600" />
            2. Dietary Philosophy & Style
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dietOptions.map((opt) => (
              <button
                key={opt.title}
                type="button"
                onClick={() => setDietaryPreference(opt.title)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  dietaryPreference === opt.title
                    ? `${opt.activeBorder} ${opt.activeBg} ring-2 ring-emerald-500/20 shadow-2xs`
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100/60'
                }`}
              >
                <span className="text-2xl mt-0.5">{opt.icon}</span>
                <div>
                  <span className="font-extrabold text-xs text-stone-900 block">{opt.label}</span>
                  <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Interactive Calorie Customizer & Macro Dial */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-600" />
              3. Interactive Calorie & Energy Target
            </label>
            <span className="text-xs text-stone-500">
              Your Maintenance TDEE: <strong>{tdee} kcal</strong>
            </span>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleCalorieModeChange('deficit')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                calorieMode === 'deficit'
                  ? 'bg-orange-500 text-white border-orange-600 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              🔥 Fat Loss (-450 kcal)
            </button>
            <button
              type="button"
              onClick={() => handleCalorieModeChange('maintenance')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                calorieMode === 'maintenance'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              🥗 Maintenance (100%)
            </button>
            <button
              type="button"
              onClick={() => handleCalorieModeChange('surplus')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                calorieMode === 'surplus'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              ⚡ Muscle Gain (+350 kcal)
            </button>
            <button
              type="button"
              onClick={() => handleCalorieModeChange('custom')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                calorieMode === 'custom'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              🎯 Fine-Tune Slider
            </button>
          </div>

          {/* Slider and direct input */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-500">Target Range: 1,200 to 3,800 kcal</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1200"
                  max="4500"
                  value={customCalories}
                  onChange={(e) => {
                    setCalorieMode('custom');
                    setCustomCalories(Number(e.target.value));
                  }}
                  className="w-20 bg-white border border-stone-300 rounded-lg px-2 py-1 text-right text-xs font-black text-stone-900 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-stone-500 text-xs">kcal/day</span>
              </div>
            </div>
            <input
              type="range"
              min="1200"
              max="3800"
              step="25"
              value={customCalories}
              onChange={(e) => {
                setCalorieMode('custom');
                setCustomCalories(Number(e.target.value));
              }}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
          </div>

          {/* Real-time Macro Ratio Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200/60">
            <div className="bg-white p-2.5 rounded-xl border border-rose-200 text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-600 block">Protein</span>
              <span className="text-sm font-black text-rose-800">{estimatedProteinG}g</span>
              <span className="text-[10px] text-stone-400 block">{Math.round(proteinRatio * 100)}% energy</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-600 block">Clean Carbs</span>
              <span className="text-sm font-black text-amber-800">{estimatedCarbsG}g</span>
              <span className="text-[10px] text-stone-400 block">{Math.round(carbRatio * 100)}% energy</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-lime-200 text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-lime-700 block">Healthy Fats</span>
              <span className="text-sm font-black text-lime-800">{estimatedFatG}g</span>
              <span className="text-[10px] text-stone-400 block">{Math.round(fatRatio * 100)}% energy</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 block">Dietary Fiber</span>
              <span className="text-sm font-black text-emerald-800">{estimatedFiberG}g+</span>
              <span className="text-[10px] text-stone-400 block">gut microbiome</span>
            </div>
          </div>
        </div>

        {/* Section 4: Cuisine & Flavor Profile Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            4. Cuisine & Flavor Inspiration
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cuisineStyles.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setCuisineStyle(c.name)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  cuisineStyle === c.name
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-2xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100/60'
                }`}
              >
                <span className="text-2xl mt-0.5">{c.icon}</span>
                <div>
                  <span className="font-extrabold text-xs text-stone-900 block">{c.name}</span>
                  <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">{c.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: Nutritional Focus & Health Priorities */}
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-600" />
            5. Key Nutritional Priorities (Select Multiple)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {healthFocusOptions.map((h) => {
              const isSelected = healthFocus.includes(h.name);
              return (
                <button
                  key={h.name}
                  type="button"
                  onClick={() => toggleHealthFocus(h.name)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-2xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{h.icon}</span>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-stone-900 block truncate">{h.name}</span>
                      <span className="text-[10px] text-stone-500 block truncate">{h.desc}</span>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 6: Body Metrics & Baseline */}
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            6. Body Metrics & Activity Tier
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Age (Years)</label>
              <input
                type="number"
                min="16"
                max="99"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="220"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Activity Tier</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="Sedentary">Sedentary (Desk work)</option>
                <option value="Lightly Active">Lightly Active (1-3 d/wk)</option>
                <option value="Moderately Active">Moderately Active (3-5 d/wk)</option>
                <option value="Very Active">Very Active (6-7 d/wk)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 7: Allergens & Exclusions */}
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            7. Allergen & Strict Ingredient Exclusions
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {allergenPresets.map(({ tag, color }) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleAllergen(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  allergies.includes(tag)
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : `${color} hover:shadow-2xs`
                }`}
              >
                {allergies.includes(tag) && <Check className="w-3.5 h-3.5" />}
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Add specific exclusions (e.g. no cilantro, no mushrooms, low-sodium)..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Section 8: Favorite Wholesome Ingredients to Feature */}
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            8. Favorite Wholesome Ingredients (Optional)
          </label>
          <input
            type="text"
            value={favoriteFoods}
            onChange={(e) => setFavoriteFoods(e.target.value)}
            placeholder="Ingredients you love (e.g. Hass avocado, wild blueberries, chia seeds, dark chocolate)..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-700 hover:to-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              Synthesizing Your Tailored Diet Blueprint...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              Generate My Personalized Diet Plan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Loading Modal with Cloud Inference Steps */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">Curating Your Nutrition Blueprint</h3>
                <p className="text-xs text-stone-500">
                  {engineMode === 'gemini' ? 'Gemini 3.8 Flash Cloud Inference' : 'Smart Deterministic Algorithm'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  {idx < loadingStep ? (
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : idx === loadingStep ? (
                    <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin mt-0.5 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-stone-300 mt-0.5 shrink-0" />
                  )}
                  <span className={idx === loadingStep ? 'font-bold text-stone-900' : idx < loadingStep ? 'text-stone-500' : 'text-stone-300'}>
                    {s}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
