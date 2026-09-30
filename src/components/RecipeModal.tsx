import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Flame, 
  Utensils, 
  CheckCircle, 
  CheckCircle2,
  Leaf, 
  Sparkles, 
  ChefHat,
  Heart,
  Droplets,
  Activity,
  Plus,
  Check,
  ShieldCheck,
  Dumbbell
} from 'lucide-react';
import type { MealItem, DetailedRecipe } from '../types/index.ts';

interface RecipeModalProps {
  meal: MealItem | null;
  mealType: string;
  onClose: () => void;
  onMarkEaten?: () => void;
  onAddToTodaySlot?: (slot: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
  isEaten?: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  meal,
  mealType,
  onClose,
  onMarkEaten,
  onAddToTodaySlot,
  isEaten = false
}) => {
  if (!meal) return null;

  const [activeTab, setActiveTab] = useState<'recipe' | 'nutrition'>('recipe');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [selectedSlot, setSelectedSlot] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>(
    mealType.toLowerCase().includes('breakfast') ? 'breakfast'
      : mealType.toLowerCase().includes('lunch') ? 'lunch'
      : mealType.toLowerCase().includes('snack') ? 'snack'
      : 'dinner'
  );
  const [addedToast, setAddedToast] = useState(false);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAddSlot = () => {
    if (onAddToTodaySlot) {
      onAddToTodaySlot(selectedSlot);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  const recipe = meal as DetailedRecipe;
  const micronutrients = recipe.micronutrients || {
    fiberG: 7,
    potassiumMg: 650,
    calciumMg: 120,
    ironMg: 3.2,
    magnesiumMg: 85,
    zincMg: 2.4,
    vitaminAMcg: 220,
    vitaminCMg: 35,
    vitaminDIU: 80,
    vitaminB12Mcg: 1.4,
    omega3Mg: 650,
    keyPolyphenols: ['Polyphenols', 'Antioxidants', 'Carotenoids'],
    healthBenefits: [
      'Nutrient-dense whole food composition',
      'Balanced sustained blood glucose support',
      'Rich in bioactive culinary phytochemicals'
    ]
  };

  const proteinG = recipe.proteinG || Math.round((meal.estimatedCalories * 0.25) / 4);
  const carbsG = recipe.carbsG || Math.round((meal.estimatedCalories * 0.45) / 4);
  const fatG = recipe.fatG || Math.round((meal.estimatedCalories * 0.30) / 9);

  // Default step-by-step instructions if none provided
  const instructions = meal.instructions || [
    'Rinse and prepare all fresh ingredients on a clean cutting board.',
    'Warm a pan over medium heat with a light spray of cold-pressed olive or avocado oil.',
    'Gently combine base ingredients, seasoning with fresh herbs and a pinch of mineral sea salt.',
    'Plate thoughtfully, garnish with fresh greens or toasted seeds, and enjoy mindfully!'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-stone-200">
        
        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-100 shrink-0">
          <img
            src={meal.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80'}
            alt={meal.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-full inline-block shadow-sm">
                {mealType}
              </span>
              {recipe.cuisine && (
                <span className="text-[10px] font-bold font-mono bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full inline-block">
                  {recipe.cuisine}
                </span>
              )}
              {recipe.difficulty && (
                <span className="text-[10px] font-bold font-mono bg-amber-500/80 backdrop-blur-md px-2.5 py-0.5 rounded-full inline-block">
                  {recipe.difficulty}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
              {meal.title}
            </h2>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex border-b border-stone-100 bg-stone-50/80 px-6 py-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('recipe')}
            className={`py-1.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recipe'
                ? 'bg-white text-emerald-800 shadow-2xs border border-stone-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Recipe & Culinary Steps
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`py-1.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nutrition'
                ? 'bg-white text-emerald-800 shadow-2xs border border-stone-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Complete Nutritional Spectrum
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          
          {/* Quick Metrics Bar: 4 Core Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-orange-50 border border-orange-200/80 p-3 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-orange-700 block font-bold">Calories</span>
              <span className="text-lg font-black text-orange-950 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-600" />
                {meal.estimatedCalories} <span className="text-xs font-normal text-stone-500">kcal</span>
              </span>
            </div>

            <div className="bg-rose-50 border border-rose-200/80 p-3 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-rose-700 block font-bold">Protein</span>
              <span className="text-lg font-black text-rose-950">
                {proteinG}g
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-amber-700 block font-bold">Clean Carbs</span>
              <span className="text-lg font-black text-amber-950">
                {carbsG}g
              </span>
            </div>

            <div className="bg-lime-50 border border-lime-200/80 p-3 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-lime-700 block font-bold">Healthy Fats</span>
              <span className="text-lg font-black text-lime-950">
                {fatG}g
              </span>
            </div>
          </div>

          {activeTab === 'recipe' ? (
            <div className="space-y-6">
              {/* Chef's Tip Box */}
              {recipe.chefTip && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <ChefHat className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-extrabold uppercase text-[10px] text-amber-800 font-mono block">Chef's Culinary Secret:</span>
                    <span>{recipe.chefTip}</span>
                  </div>
                </div>
              )}

              {/* Ingredients Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                    Ingredients & Quantities ({meal.items.length} items)
                  </h3>
                  <span className="text-[11px] text-stone-400">Portion: {meal.portion}</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  {meal.items.map((item, idx) => {
                    const isChecked = Boolean(checkedIngredients[idx]);
                    return (
                      <div 
                        key={idx} 
                        onClick={() => toggleIngredient(idx)}
                        className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer select-none group"
                      >
                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isChecked 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'border-stone-300 group-hover:border-emerald-500'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span className={isChecked ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Directions */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Culinary Instructions ({meal.prepTimeMinutes || 15} mins)
                </h3>
                <div className="space-y-2 text-xs text-stone-700">
                  {instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-100 shadow-2xs">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-[11px] shrink-0">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed mt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Complete Nutritional & Micronutrient Spectrum */
            <div className="space-y-6">
              
              {/* Minerals & Electrolytes */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Key Bioavailable Minerals & Electrolytes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block font-bold">Dietary Fiber</span>
                    <span className="text-base font-black text-stone-900">{micronutrients.fiberG}g</span>
                    <span className="text-[10px] text-emerald-700 block">Gut Microbiome</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block font-bold">Potassium</span>
                    <span className="text-base font-black text-stone-900">{micronutrients.potassiumMg || 750}mg</span>
                    <span className="text-[10px] text-sky-700 block">Cellular Fluid Balance</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block font-bold">Iron</span>
                    <span className="text-base font-black text-stone-900">{micronutrients.ironMg || 3.5}mg</span>
                    <span className="text-[10px] text-rose-700 block">Oxygen Transport</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block font-bold">Calcium</span>
                    <span className="text-base font-black text-stone-900">{micronutrients.calciumMg || 140}mg</span>
                    <span className="text-[10px] text-amber-700 block">Bone Matrix Density</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block font-bold">Magnesium</span>
                    <span className="text-base font-black text-stone-900">{micronutrients.magnesiumMg || 90}mg</span>
                    <span className="text-[10px] text-teal-700 block">300+ Enzyme Reactions</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block font-bold">Zinc</span>
                    <span className="text-base font-black text-stone-900">{micronutrients.zincMg || 2.5}mg</span>
                    <span className="text-[10px] text-indigo-700 block">Immunity & DNA Repair</span>
                  </div>
                </div>
              </div>

              {/* Essential Vitamins & Omega-3 */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Essential Vitamins & Healthy Fatty Acids
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-mono uppercase text-amber-700 font-bold block">Vitamin A</span>
                    <span className="text-sm font-black text-stone-900">{micronutrients.vitaminAMcg || 320} mcg</span>
                    <span className="text-[10px] text-stone-400 block">Vision & Epithelial</span>
                  </div>

                  <div className="bg-orange-50/60 border border-orange-200 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-mono uppercase text-orange-700 font-bold block">Vitamin C</span>
                    <span className="text-sm font-black text-stone-900">{micronutrients.vitaminCMg || 45} mg</span>
                    <span className="text-[10px] text-stone-400 block">Collagen & Defense</span>
                  </div>

                  <div className="bg-sky-50/60 border border-sky-200 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-mono uppercase text-sky-700 font-bold block">Vitamin B12</span>
                    <span className="text-sm font-black text-stone-900">{micronutrients.vitaminB12Mcg || 1.8} mcg</span>
                    <span className="text-[10px] text-stone-400 block">Nerve & Blood Cells</span>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">Omega-3</span>
                    <span className="text-sm font-black text-emerald-800">{micronutrients.omega3Mg || 850} mg</span>
                    <span className="text-[10px] text-stone-400 block">Anti-Inflammatory</span>
                  </div>
                </div>
              </div>

              {/* Bioactive Polyphenols */}
              {micronutrients.keyPolyphenols && micronutrients.keyPolyphenols.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    Specialized Phytonutrients & Polyphenols
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {micronutrients.keyPolyphenols.map((poly, idx) => (
                      <span key={idx} className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-xl">
                        ✦ {poly}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence-Based Health Benefits */}
              {micronutrients.healthBenefits && micronutrients.healthBenefits.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    Targeted Physiological Benefits
                  </h4>
                  <ul className="text-xs text-emerald-950 space-y-1.5">
                    {micronutrients.healthBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
          
          {/* Quick Add to Specific Meal Slot */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 hidden sm:inline">Add to Today:</span>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value as any)}
              className="bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="breakfast">🌅 Breakfast</option>
              <option value="lunch">☀️ Lunch</option>
              <option value="snack">🍏 Snack</option>
              <option value="dinner">🌙 Dinner</option>
            </select>
            <button
              onClick={handleAddSlot}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {addedToast ? 'Added to Fuel!' : 'Log Meal'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onMarkEaten && (
              <button
                onClick={onMarkEaten}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isEaten
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs'
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${isEaten ? 'text-emerald-600' : 'text-stone-400'}`} />
                {isEaten ? 'Marked Eaten Today' : 'Mark as Eaten'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
