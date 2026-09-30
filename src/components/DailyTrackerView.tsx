import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Droplets, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Clock, 
  Calendar,
  Utensils,
  Leaf,
  Heart,
  Dumbbell,
  Scale,
  X,
  Apple,
  Sun,
  Moon,
  Coffee,
  Check,
  Minus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { RecipeModal } from './RecipeModal.tsx';
import type { UserProfile, DietPlan, MealItem, LoggedFood, WellnessHabit } from '../types/index.ts';

interface DailyTrackerViewProps {
  user: UserProfile | null;
  activePlan: DietPlan | null;
  onOpenGenerator: () => void;
  onOpenAuth: () => void;
}

export const DailyTrackerView: React.FC<DailyTrackerViewProps> = ({
  user,
  activePlan,
  onOpenGenerator,
  onOpenAuth
}) => {
  // Meals marked as eaten today
  const [eatenMeals, setEatenMeals] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    snack: false,
    dinner: false
  });

  // Additional logged snacks / custom items
  const [extraLoggedFoods, setExtraLoggedFoods] = useState<LoggedFood[]>([
    { id: '1', name: 'Ceremonial Matcha Green Tea', calories: 35, proteinG: 1, carbsG: 3, fatG: 0, mealSlot: 'breakfast', loggedAt: '08:30 AM' },
    { id: '2', name: 'Organic Honeycrisp Apple & Walnuts', calories: 140, proteinG: 3, carbsG: 22, fatG: 6, mealSlot: 'snack', loggedAt: '03:15 PM' }
  ]);

  // Workout calories burned today
  const [burnedCalories, setBurnedCalories] = useState<number>(280);

  // Quick Food Log Modal state
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [customFoodName, setCustomFoodName] = useState('');
  const [customFoodCal, setCustomFoodCal] = useState(150);
  const [customFoodProt, setCustomFoodProt] = useState(8);
  const [customMealSlot, setCustomMealSlot] = useState<LoggedFood['mealSlot']>('snack');

  // Hydration state (ml)
  const targetWaterMl = activePlan ? Math.round(activePlan.hydrationReminder.targetLiters * 1000) : 2500;
  const [currentWaterMl, setCurrentWaterMl] = useState<number>(1750);

  // Weight tracker state
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(user?.weightKg || 70.5);
  const targetWeightKg = user?.weightKg ? Number((user.weightKg - 3.5).toFixed(1)) : 67.0;
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState(String(currentWeightKg));

  // Selected recipe modal
  const [selectedMealForModal, setSelectedMealForModal] = useState<{ meal: MealItem; type: string } | null>(null);

  const DEFAULT_STARTER_HABITS: WellnessHabit[] = [
    { id: 'veggies', label: '5+ servings of rainbow vegetables & leafy greens', category: 'Nutrition', completed: true, color: 'text-emerald-800 bg-emerald-50 border-emerald-300' },
    { id: 'hydration', label: 'Hit 2.5L clean water & mineral electrolytes', category: 'Hydration', completed: false, color: 'text-sky-800 bg-sky-50 border-sky-300' },
    { id: 'activity', label: '30-minute cardio walk or resistance session', category: 'Movement', completed: true, color: 'text-orange-800 bg-orange-50 border-orange-300' },
    { id: 'antioxidants', label: 'Raw blueberries, blackberries & chia seeds', category: 'Nutrition', completed: true, color: 'text-pink-800 bg-pink-50 border-pink-300' },
    { id: 'sunlight', label: '15 minutes natural morning sunlight for circadian rhythm', category: 'Recovery', completed: false, color: 'text-amber-800 bg-amber-50 border-amber-300' },
    { id: 'mindful', label: 'Mindful dinner without digital screens', category: 'Mindfulness', completed: false, color: 'text-indigo-800 bg-indigo-50 border-indigo-300' }
  ];

  // Habits tracker with persistence
  const [habits, setHabits] = useState<WellnessHabit[]>(() => {
    try {
      const saved = localStorage.getItem('cloud_diet_user_habits');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_STARTER_HABITS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cloud_diet_user_habits', JSON.stringify(habits));
    } catch (e) {
      // ignore
    }
  }, [habits]);

  const [newHabitText, setNewHabitText] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<WellnessHabit['category']>('Nutrition');
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  const handleAddHabit = (labelToAdd?: string, catToAdd?: WellnessHabit['category']) => {
    const text = (labelToAdd || newHabitText).trim();
    if (!text) return;
    const cat = catToAdd || newHabitCategory;
    
    const colorMap: Record<WellnessHabit['category'], string> = {
      Nutrition: 'text-emerald-800 bg-emerald-50 border-emerald-300',
      Hydration: 'text-sky-800 bg-sky-50 border-sky-300',
      Movement: 'text-orange-800 bg-orange-50 border-orange-300',
      Recovery: 'text-indigo-800 bg-indigo-50 border-indigo-300',
      Mindfulness: 'text-amber-800 bg-amber-50 border-amber-300'
    };

    const newHabit: WellnessHabit = {
      id: 'habit_' + Date.now() + Math.random().toString(36).substring(2, 6),
      label: text,
      category: cat,
      completed: false,
      color: colorMap[cat] || 'text-stone-800 bg-stone-50 border-stone-300'
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitText('');
    setIsAddingHabit(false);
  };

  const handleRemoveHabit = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleResetHabits = () => {
    setHabits(DEFAULT_STARTER_HABITS);
  };

  const handleRemoveFood = (foodId: string) => {
    setExtraLoggedFoods(prev => prev.filter(f => f.id !== foodId));
  };

  const toggleMealEaten = (mealKey: string) => {
    setEatenMeals(prev => ({ ...prev, [mealKey]: !prev[mealKey] }));
  };

  const addWater = (amountMl: number) => {
    setCurrentWaterMl(prev => Math.min(targetWaterMl + 1000, prev + amountMl));
  };

  const toggleWaterGlass = (glassIdx: number) => {
    const glassVolume = 250;
    const clickedTarget = (glassIdx + 1) * glassVolume;
    if (currentWaterMl >= clickedTarget) {
      setCurrentWaterMl(Math.max(0, glassIdx * glassVolume));
    } else {
      setCurrentWaterMl(clickedTarget);
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleAddWorkout = () => {
    setBurnedCalories(prev => prev + 150);
  };

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodName.trim()) return;

    const newFood: LoggedFood = {
      id: 'food_' + Date.now(),
      name: customFoodName.trim(),
      calories: Number(customFoodCal) || 100,
      proteinG: Number(customFoodProt) || 5,
      carbsG: Math.round((Number(customFoodCal) * 0.5) / 4),
      fatG: Math.round((Number(customFoodCal) * 0.25) / 9),
      mealSlot: customMealSlot,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setExtraLoggedFoods(prev => [newFood, ...prev]);
    setIsQuickLogOpen(false);
    setCustomFoodName('');
  };

  // Default demo plan if none active
  const plan: DietPlan = activePlan || {
    id: 'default_plan',
    userId: user?.id || 'demo_user',
    title: 'Rainbow Whole Food & Vitality Plan',
    generatedBy: 'gemini-3.8-flash',
    dietaryPreference: user?.dietaryPreference || 'Vegetarian',
    goal: user?.goal || 'General balanced eating',
    breakfast: {
      title: 'Hass Avocado & Sourdough with Soft Poached Eggs',
      items: ['2 slices seeded sourdough toast', '1 fresh Hass avocado mashed with lime & pink salt', '2 pasture-raised eggs poached', 'Handful microgreens & chili flakes'],
      portion: '2 slices (320g)',
      estimatedCalories: 430,
      prepTimeMinutes: 12,
      tags: ['Good Fats', 'High Protein', 'Microbiome'],
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      instructions: [
        'Toast artisan sourdough slices until golden and crisp.',
        'Mash ripe avocado with fresh lime juice, flaky sea salt, and black pepper.',
        'Poach pasture eggs in gently simmering water for 3 minutes.',
        'Assemble toast, top with eggs, microgreens, and a dash of chili flakes.'
      ]
    },
    lunch: {
      title: 'Rainbow Quinoa, Spiced Chickpeas & Tahini Salad',
      items: ['1 cup cooked tri-color quinoa', 'Roasted paprika chickpeas', 'Persian cucumber, vine cherry tomatoes, purple cabbage', 'Creamy garlic lemon tahini dressing'],
      portion: '1 large bowl (460g)',
      estimatedCalories: 560,
      prepTimeMinutes: 18,
      tags: ['Plant Protein', 'Heart Healthy', 'Antioxidants'],
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      instructions: [
        'Layer fluffy warm quinoa at the base of the bowl.',
        'Arrange seasoned spiced chickpeas, diced cucumber, tomatoes, and cabbage in vibrant rows.',
        'Whisk 2 tbsp tahini with fresh lemon juice and warm water until velvety.',
        'Drizzle over the salad and top with toasted sesame seeds.'
      ]
    },
    snack: {
      title: 'Wild Berry Greek Yogurt & Raw Chia Superfood Parfait',
      items: ['1 cup thick authentic Greek yogurt', 'Fresh blueberries, blackberries & raspberries', '1 tbsp raw black chia seeds', 'Raw clover honey & toasted walnuts'],
      portion: '1 parfait cup (240g)',
      estimatedCalories: 230,
      prepTimeMinutes: 5,
      tags: ['Probiotics', 'Brain Food', 'Low GI'],
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
      instructions: [
        'Spoon Greek yogurt into a chilled bowl or tumbler.',
        'Layer fresh washed berries on top.',
        'Sprinkle raw chia seeds and crushed walnuts for omega-3 richness.',
        'Drizzle with a ribbon of pure raw clover honey.'
      ]
    },
    dinner: {
      title: 'Golden Turmeric Lentil Dal with Basmati & Greens',
      items: ['Yellow moong dal tempered with garlic & cumin', 'Steamed brown basmati rice', 'Sautéed French green beans & tender broccoli'],
      portion: '1 full plate (420g)',
      estimatedCalories: 510,
      prepTimeMinutes: 25,
      tags: ['Easy Digestion', 'Complete Protein', 'Warm Comfort'],
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      instructions: [
        'Simmer yellow lentils with turmeric and sea salt until creamy (approx 20 mins).',
        'In a small skillet, sizzle garlic slices, cumin, and mustard seeds in virgin coconut oil.',
        'Pour aromatic tempering over dal and stir gently.',
        'Serve with steamed brown basmati and lightly sautéed greens.'
      ]
    },
    nutritionSummary: {
      calories: 1730,
      proteinG: 95,
      carbsG: 215,
      fatG: 48,
      fiberG: 38,
      microNutrientNotes: 'Abundant in polyphenol antioxidants, dietary fiber, iron, zinc, and healthy lipids.'
    },
    hydrationReminder: {
      targetLiters: 2.6,
      glassesPerDay: 10,
      schedule: ['07:30 AM - Lemon warm water', '11:00 AM - 2 glasses', '01:30 PM - 1 glass', '04:30 PM - 2 glasses', '07:30 PM - 1 glass'],
      electrolyteTip: 'Pinch of Himalayan pink salt with afternoon water'
    },
    disclaimer: 'General wellness demonstration only.',
    createdAt: new Date().toISOString()
  };

  // Calorie calculations
  const plannedEatenCalories = (
    (eatenMeals.breakfast ? plan.breakfast.estimatedCalories : 0) +
    (eatenMeals.lunch ? plan.lunch.estimatedCalories : 0) +
    (eatenMeals.snack ? plan.snack.estimatedCalories : 0) +
    (eatenMeals.dinner ? plan.dinner.estimatedCalories : 0)
  );

  const extraFoodCalories = extraLoggedFoods.reduce((acc, f) => acc + f.calories, 0);
  const totalCaloriesConsumed = plannedEatenCalories + extraFoodCalories;

  // Net Calories = Consumed - Burned
  const netCalories = totalCaloriesConsumed - burnedCalories;
  const remainingBudget = Math.max(0, plan.nutritionSummary.calories - netCalories);
  const progressRatio = Math.min(100, Math.round((totalCaloriesConsumed / (plan.nutritionSummary.calories || 1)) * 100));

  // Macros calculation
  const totalExtraProt = extraLoggedFoods.reduce((acc, f) => acc + f.proteinG, 0);
  const eatenProtein = Math.round((plan.nutritionSummary.proteinG * (plannedEatenCalories / (plan.nutritionSummary.calories || 1)))) + totalExtraProt;
  const eatenCarbs = Math.round(plan.nutritionSummary.carbsG * (plannedEatenCalories / (plan.nutritionSummary.calories || 1)));
  const eatenFat = Math.round(plan.nutritionSummary.fatG * (plannedEatenCalories / (plan.nutritionSummary.calories || 1)));

  const waterPercent = Math.min(100, Math.round((currentWaterMl / targetWaterMl) * 100));
  const glassesFilled = Math.floor(currentWaterMl / 250);

  const handleSaveWeight = () => {
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 30) {
      setCurrentWeightKg(val);
      setIsEditingWeight(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7 animate-in fade-in duration-300">
      {/* Top Banner: Colorful Multi-tone Organic Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Soft decorative radiant circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 left-1/3 w-64 h-64 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold font-mono uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-white" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Welcome back, {user ? user.name.split(' ')[0] : 'Wellness Champion'}! 🥑
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50 max-w-xl">
              Active Blueprint: <strong className="text-white">{plan.title}</strong> · Powered by fresh whole foods.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              Quick Log Food
            </button>

            <button
              onClick={onOpenGenerator}
              className="bg-emerald-900/60 hover:bg-emerald-900/80 border border-white/30 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 backdrop-blur-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Change Meal Plan
            </button>
          </div>
        </div>

        {/* Motivational Food Color Pills */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-white/90 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse" />
            <span>Target Goal: <strong className="text-white">{plan.goal}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-rose-500/40 px-2.5 py-0.5 rounded-full border border-rose-300/30">
              🔥 Burned: <strong className="text-white">{burnedCalories} kcal</strong>
            </span>
            <span className="bg-sky-500/40 px-2.5 py-0.5 rounded-full border border-sky-300/30">
              💧 Water: <strong className="text-white">{glassesFilled} of 10 glasses</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Energy & Macronutrient Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Calorie Budget Gauge with Tangerine Orange & Sun Gold */}
        <div className="bg-white rounded-3xl p-6 border border-orange-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-800 font-mono">
                Calorie Budget
              </span>
            </div>

            <button
              onClick={handleAddWorkout}
              className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
              title="Add 150 kcal workout"
            >
              <Dumbbell className="w-3 h-3 text-rose-500" /> +150 Burn
            </button>
          </div>

          <div className="my-5 flex items-center justify-center">
            {/* Visual Circular Calorie Gauge */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-orange-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-orange-500 transition-all duration-700 ease-out"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * Math.min(100, progressRatio)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-stone-900 block tracking-tight">
                  {remainingBudget}
                </span>
                <span className="text-[10px] text-orange-600 uppercase font-mono font-bold block">
                  kcal remaining
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-orange-100 grid grid-cols-3 text-center text-xs font-mono">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Target</span>
              <span className="font-extrabold text-stone-700">{plan.nutritionSummary.calories}</span>
            </div>
            <div>
              <span className="text-[10px] text-orange-600 block uppercase font-bold">Consumed</span>
              <span className="font-extrabold text-orange-600">{totalCaloriesConsumed}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-600 block uppercase font-bold">Burned</span>
              <span className="font-extrabold text-rose-600">-{burnedCalories}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Macronutrient Breakdown with 4 Distinct Food Colors */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
                Macronutrient Balance
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal Fuel
            </span>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {/* Protein: Strawberry / Coral Red */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-rose-700 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-2xs" />
                  Protein
                </span>
                <span className="text-stone-600">
                  <strong className="text-stone-900">{eatenProtein}g</strong> / {plan.nutritionSummary.proteinG}g
                </span>
              </div>
              <div className="h-2.5 w-full bg-rose-50 rounded-full overflow-hidden border border-rose-100">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (eatenProtein / (plan.nutritionSummary.proteinG || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Clean Carbs: Tangerine & Apricot Orange */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-orange-700 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-2xs" />
                  Clean Carbs
                </span>
                <span className="text-stone-600">
                  <strong className="text-stone-900">{eatenCarbs}g</strong> / {plan.nutritionSummary.carbsG}g
                </span>
              </div>
              <div className="h-2.5 w-full bg-orange-50 rounded-full overflow-hidden border border-orange-100">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (eatenCarbs / (plan.nutritionSummary.carbsG || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Healthy Fats: Avocado Lime Green */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-lime-800 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-500 shadow-2xs" />
                  Healthy Fats
                </span>
                <span className="text-stone-600">
                  <strong className="text-stone-900">{eatenFat}g</strong> / {plan.nutritionSummary.fatG}g
                </span>
              </div>
              <div className="h-2.5 w-full bg-lime-50 rounded-full overflow-hidden border border-lime-100">
                <div 
                  className="h-full bg-gradient-to-r from-lime-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (eatenFat / (plan.nutritionSummary.fatG || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
            <span>Dietary Fiber: <strong>{plan.nutritionSummary.fiberG}g</strong></span>
            <span className="text-emerald-700 font-bold font-mono">✓ High Microbiome Health</span>
          </div>
        </div>

        {/* Card 3: Interactive Water Hydration Station in Sky Blue & Aqua */}
        <div className="bg-white rounded-3xl p-6 border border-sky-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-900 font-mono">
                Hydration Station
              </span>
            </div>
            <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
              {waterPercent}% Reached
            </span>
          </div>

          <div className="text-center my-1">
            <div className="text-2xl font-black text-stone-900">
              {currentWaterMl} <span className="text-xs font-normal text-stone-500">/ {targetWaterMl} ml</span>
            </div>
            <p className="text-xs text-sky-700 font-medium mt-0.5">
              {glassesFilled} of 10 glasses consumed
            </p>
          </div>

          {/* Interactive 10 Glasses Visual Clicker */}
          <div className="grid grid-cols-5 gap-1.5 py-1">
            {Array.from({ length: 10 }).map((_, gIdx) => {
              const isFilled = gIdx < glassesFilled;
              return (
                <button
                  key={gIdx}
                  type="button"
                  onClick={() => toggleWaterGlass(gIdx)}
                  title={`Glass ${gIdx + 1} (250ml) - Click to toggle`}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isFilled 
                      ? 'bg-gradient-to-t from-sky-500 to-cyan-400 text-white border-sky-400 shadow-2xs scale-105' 
                      : 'bg-sky-50/60 border-sky-200 text-sky-300 hover:border-sky-400'
                  }`}
                >
                  <Droplets className={`w-3.5 h-3.5 mx-auto ${isFilled ? 'fill-white text-white' : 'text-sky-300'}`} />
                  <span className="text-[9px] font-mono font-bold block mt-0.5">{gIdx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Add Water Buttons */}
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <button
                onClick={() => addWater(250)}
                className="flex-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> +250 ml (Glass)
              </button>
              <button
                onClick={() => addWater(500)}
                className="py-2 px-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-300 transition-colors"
              >
                +500 ml Bottle
              </button>
              <button
                onClick={() => setCurrentWaterMl(prev => Math.max(0, prev - 250))}
                title="Subtract 250 ml"
                className="py-2 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold border border-stone-200 transition-colors flex items-center justify-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> 250ml
              </button>
            </div>
            <p className="text-[11px] text-stone-500 text-center italic">
              ⚡ {plan.hydrationReminder.electrolyteTip}
            </p>
          </div>
        </div>
      </div>

      {/* Weight & Progress Tracker Bar with Dragonfruit Pink Accent */}
      <div className="bg-white rounded-3xl p-5 border border-pink-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-pink-100 text-pink-700 border border-pink-200">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-pink-800">Body Weight Progress</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-black text-stone-900">{currentWeightKg} kg</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Target: {targetWeightKg} kg ({(currentWeightKg - targetWeightKg).toFixed(1)} kg to goal)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditingWeight ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-24 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-800"
              />
              <button
                onClick={handleSaveWeight}
                className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingWeight(true)}
              className="text-xs font-bold text-pink-700 hover:text-pink-900 bg-pink-50 hover:bg-pink-100 px-3.5 py-2 rounded-2xl border border-pink-200 transition-colors"
            >
              Update Today's Weight
            </button>
          )}
        </div>
      </div>

      {/* Today's Meals Timeline with 4 Signature Appetizing Color Identifiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" />
              Today's Wholesome Meal Plan
            </h2>
            <p className="text-xs text-stone-500">
              Click any meal card to explore full ingredients and step-by-step cooking directions
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            {Object.values(eatenMeals).filter(Boolean).length} of 4 Meals Eaten
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Breakfast: Honey Sunrise Amber */}
          <div 
            onClick={() => setSelectedMealForModal({ meal: plan.breakfast, type: '🌅 Breakfast' })}
            className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-md ${
              eatenMeals.breakfast 
                ? 'bg-amber-50/30 border-amber-300 ring-2 ring-amber-500/20' 
                : 'bg-white border-amber-200'
            }`}
          >
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-amber-50">
                <img
                  src={plan.breakfast.imageUrl}
                  alt={plan.breakfast.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-amber-500 text-white font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                  🌅 08:00 AM · Breakfast
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-amber-900 font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                  {plan.breakfast.estimatedCalories} kcal
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono text-amber-200 block uppercase font-bold">
                    {plan.breakfast.prepTimeMinutes}m prep · {plan.breakfast.portion}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-extrabold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                  {plan.breakfast.title}
                </h3>

                <ul className="text-xs text-stone-600 space-y-1 pt-1">
                  {plan.breakfast.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-amber-100 mt-2">
              <span className="text-[11px] text-stone-500 font-medium">
                {eatenMeals.breakfast ? <span className="text-amber-700 font-bold">✓ Logged Eaten</span> : 'Tap to view recipe'}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMealEaten('breakfast');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  eatenMeals.breakfast
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {eatenMeals.breakfast ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5 text-amber-500" />}
                {eatenMeals.breakfast ? 'Eaten' : 'Mark Eaten'}
              </button>
            </div>
          </div>

          {/* 2. Lunch: Fresh Lime & Mint Green */}
          <div 
            onClick={() => setSelectedMealForModal({ meal: plan.lunch, type: '☀️ Lunch' })}
            className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-md ${
              eatenMeals.lunch 
                ? 'bg-emerald-50/30 border-emerald-300 ring-2 ring-emerald-500/20' 
                : 'bg-white border-emerald-200'
            }`}
          >
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-emerald-50">
                <img
                  src={plan.lunch.imageUrl}
                  alt={plan.lunch.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-emerald-600 text-white font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                  ☀️ 01:00 PM · Lunch
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-emerald-900 font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                  {plan.lunch.estimatedCalories} kcal
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono text-emerald-200 block uppercase font-bold">
                    {plan.lunch.prepTimeMinutes}m prep · {plan.lunch.portion}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-extrabold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {plan.lunch.title}
                </h3>

                <ul className="text-xs text-stone-600 space-y-1 pt-1">
                  {plan.lunch.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-emerald-100 mt-2">
              <span className="text-[11px] text-stone-500 font-medium">
                {eatenMeals.lunch ? <span className="text-emerald-700 font-bold">✓ Logged Eaten</span> : 'Tap to view recipe'}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMealEaten('lunch');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  eatenMeals.lunch
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {eatenMeals.lunch ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5 text-emerald-500" />}
                {eatenMeals.lunch ? 'Eaten' : 'Mark Eaten'}
              </button>
            </div>
          </div>

          {/* 3. Snack: Raspberry & Dragonfruit Pink */}
          <div 
            onClick={() => setSelectedMealForModal({ meal: plan.snack, type: '🍏 Snack' })}
            className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-md ${
              eatenMeals.snack 
                ? 'bg-pink-50/30 border-pink-300 ring-2 ring-pink-500/20' 
                : 'bg-white border-pink-200'
            }`}
          >
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-pink-50">
                <img
                  src={plan.snack.imageUrl}
                  alt={plan.snack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-pink-600 text-white font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                  🍏 04:30 PM · Refuel Snack
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-pink-900 font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                  {plan.snack.estimatedCalories} kcal
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono text-pink-200 block uppercase font-bold">
                    {plan.snack.prepTimeMinutes}m prep · {plan.snack.portion}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-extrabold text-stone-900 group-hover:text-pink-700 transition-colors leading-snug">
                  {plan.snack.title}
                </h3>

                <ul className="text-xs text-stone-600 space-y-1 pt-1">
                  {plan.snack.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-pink-100 mt-2">
              <span className="text-[11px] text-stone-500 font-medium">
                {eatenMeals.snack ? <span className="text-pink-700 font-bold">✓ Logged Eaten</span> : 'Tap to view recipe'}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMealEaten('snack');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  eatenMeals.snack
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200'
                }`}
              >
                {eatenMeals.snack ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5 text-pink-500" />}
                {eatenMeals.snack ? 'Eaten' : 'Mark Eaten'}
              </button>
            </div>
          </div>

          {/* 4. Dinner: Pomegranate Crimson & Warm Rose */}
          <div 
            onClick={() => setSelectedMealForModal({ meal: plan.dinner, type: '🌙 Dinner' })}
            className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-md ${
              eatenMeals.dinner 
                ? 'bg-rose-50/30 border-rose-300 ring-2 ring-rose-500/20' 
                : 'bg-white border-rose-200'
            }`}
          >
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-rose-50">
                <img
                  src={plan.dinner.imageUrl}
                  alt={plan.dinner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-rose-600 text-white font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                  🌙 08:00 PM · Restorative Dinner
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-rose-900 font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                  {plan.dinner.estimatedCalories} kcal
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono text-rose-200 block uppercase font-bold">
                    {plan.dinner.prepTimeMinutes}m prep · {plan.dinner.portion}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-extrabold text-stone-900 group-hover:text-rose-700 transition-colors leading-snug">
                  {plan.dinner.title}
                </h3>

                <ul className="text-xs text-stone-600 space-y-1 pt-1">
                  {plan.dinner.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-rose-100 mt-2">
              <span className="text-[11px] text-stone-500 font-medium">
                {eatenMeals.dinner ? <span className="text-rose-700 font-bold">✓ Logged Eaten</span> : 'Tap to view recipe'}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMealEaten('dinner');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  eatenMeals.dinner
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {eatenMeals.dinner ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5 text-rose-500" />}
                {eatenMeals.dinner ? 'Eaten' : 'Mark Eaten'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Logged Snacks & Drinks list */}
      {extraLoggedFoods.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-600" />
              Additional Foods & Drinks Logged Today
            </h3>
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              +{extraFoodCalories} kcal
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {extraLoggedFoods.map((food) => {
              const slotColor = food.mealSlot === 'breakfast' ? 'bg-amber-100 text-amber-800 border-amber-200'
                : food.mealSlot === 'lunch' ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : food.mealSlot === 'snack' ? 'bg-pink-100 text-pink-800 border-pink-200'
                : 'bg-rose-100 text-rose-800 border-rose-200';

              return (
                <div key={food.id} className="py-2.5 flex items-center justify-between text-xs group">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border uppercase ${slotColor}`}>
                      {food.mealSlot}
                    </span>
                    <span className="font-bold text-stone-900">{food.name}</span>
                    <span className="text-stone-400 font-mono text-[10px]">{food.loggedAt}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-stone-800 font-bold">
                      +{food.calories} kcal ({food.proteinG}g P)
                    </span>
                    <button
                      onClick={() => handleRemoveFood(food.id)}
                      className="p-1 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete logged food"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Vitality Habits Checklist with Interactive Add and Remove */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-100">
          <div>
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Daily Wellness Habits & Holistic Health
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Science-backed vitality rituals. Customize your daily wellness protocol by adding or removing habits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              {habits.filter(h => h.completed).length} of {habits.length} Done ({habits.length > 0 ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100) : 0}%)
            </span>

            <button
              onClick={() => setIsAddingHabit(!isAddingHabit)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {isAddingHabit ? 'Close Form' : 'Add Habit'}
            </button>

            <button
              onClick={handleResetHabits}
              title="Reset to starter habits"
              className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${habits.length > 0 ? (habits.filter(h => h.completed).length / habits.length) * 100 : 0}%` }}
          />
        </div>

        {/* Add Habit Form */}
        {isAddingHabit && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono">
                Create New Holistic Habit
              </span>
              <button 
                onClick={() => setIsAddingHabit(false)}
                className="text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newHabitText}
                  onChange={(e) => setNewHabitText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddHabit(); }}
                  placeholder="e.g. 10,000 steps walk, 400mg Magnesium glycinate, 10 min breathwork..."
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as any)}
                  className="bg-white border border-stone-200 rounded-xl px-2.5 py-2 text-xs font-bold text-stone-700 focus:outline-none focus:border-emerald-500 flex-1"
                >
                  <option value="Nutrition">🥗 Nutrition</option>
                  <option value="Hydration">💧 Hydration</option>
                  <option value="Movement">🏃 Movement</option>
                  <option value="Recovery">🌙 Recovery</option>
                  <option value="Mindfulness">🧘 Mindfulness</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleAddHabit()}
                  disabled={!newHabitText.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Quick Add Suggestions Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">
                Quick Science-Backed Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '☀️ 15-min Morning Sunlight for Circadian Rhythm', cat: 'Recovery' as const },
                  { label: '🏃 10,000 Steps Outdoor Walk', cat: 'Movement' as const },
                  { label: '💊 400mg Magnesium Glycinate before Sleep', cat: 'Recovery' as const },
                  { label: '🧊 2-min Cold Shower Rinse', cat: 'Recovery' as const },
                  { label: '🧘 10-min Box Breathing or Meditation', cat: 'Mindfulness' as const },
                  { label: '🚫 Zero Added Sugar or Snacks after 8 PM', cat: 'Nutrition' as const },
                  { label: '🍵 Organic Chamomile or Verbena Infusion', cat: 'Nutrition' as const },
                  { label: '📵 30-min Digital Sunset before Bed', cat: 'Mindfulness' as const }
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAddHabit(preset.label, preset.cat)}
                    className="text-[11px] font-medium bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-stone-600 border border-stone-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Habit List */}
        {habits.length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-xs space-y-2">
            <p>No habits active currently. Add your custom habits above or restore starter habits!</p>
            <button
              onClick={handleResetHabits}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
            >
              Restore Starter Habits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {habits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 group ${
                  habit.completed
                    ? habit.color
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {habit.completed ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-300 shrink-0 group-hover:text-emerald-500" />
                  )}
                  <div className="min-w-0">
                    <span className={`text-xs font-semibold block leading-snug truncate ${habit.completed ? 'line-through opacity-75' : ''}`}>
                      {habit.label}
                    </span>
                    {habit.category && (
                      <span className="text-[10px] font-mono opacity-60 uppercase">
                        {habit.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove habit button */}
                <button
                  type="button"
                  onClick={(e) => handleRemoveHabit(habit.id, e)}
                  title="Remove this habit"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-white/80 transition-all shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Custom Food Modal */}
      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-stone-900 text-base">Quick Log Food or Drink</h3>
              </div>
              <button onClick={() => setIsQuickLogOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomFood} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                  placeholder="e.g. Greek yogurt cup, banana, matcha latte..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    value={customFoodCal}
                    onChange={(e) => setCustomFoodCal(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Protein (grams)</label>
                  <input
                    type="number"
                    value={customFoodProt}
                    onChange={(e) => setCustomFoodProt(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Meal Time Slot</label>
                <select
                  value={customMealSlot}
                  onChange={(e) => setCustomMealSlot(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="breakfast">🌅 Breakfast</option>
                  <option value="lunch">☀️ Lunch</option>
                  <option value="snack">🍏 Snack</option>
                  <option value="dinner">🌙 Dinner</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add to Today's Food Diary
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedMealForModal && (
        <RecipeModal
          meal={selectedMealForModal.meal}
          mealType={selectedMealForModal.type}
          onClose={() => setSelectedMealForModal(null)}
          onMarkEaten={() => {
            const slotKey = selectedMealForModal.type.toLowerCase().includes('breakfast') ? 'breakfast'
              : selectedMealForModal.type.toLowerCase().includes('lunch') ? 'lunch'
              : selectedMealForModal.type.toLowerCase().includes('snack') ? 'snack' : 'dinner';
            toggleMealEaten(slotKey);
          }}
          isEaten={
            selectedMealForModal.type.toLowerCase().includes('breakfast') ? eatenMeals.breakfast
            : selectedMealForModal.type.toLowerCase().includes('lunch') ? eatenMeals.lunch
            : selectedMealForModal.type.toLowerCase().includes('snack') ? eatenMeals.snack : eatenMeals.dinner
          }
        />
      )}
    </div>
  );
};
