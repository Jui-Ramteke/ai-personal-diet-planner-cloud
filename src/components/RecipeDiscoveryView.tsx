import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Plus, 
  Check, 
  ChefHat, 
  Heart, 
  Leaf, 
  Eye,
  Search,
  Filter,
  Activity,
  ShieldCheck,
  Droplets,
  ArrowRight
} from 'lucide-react';
import { RecipeModal } from './RecipeModal.tsx';
import { ALL_RECIPES } from '../data/recipes.ts';
import type { MealItem, DetailedRecipe } from '../types/index.ts';

interface RecipeDiscoveryViewProps {
  onAddToToday: (meal: MealItem, slot: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
  onOpenGenerator: () => void;
}

export const RecipeDiscoveryView: React.FC<RecipeDiscoveryViewProps> = ({
  onAddToToday,
  onOpenGenerator
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');
  const [selectedNutrientFocus, setSelectedNutrientFocus] = useState<string>('all');
  const [selectedMealForModal, setSelectedMealForModal] = useState<{ meal: DetailedRecipe; type: string } | null>(null);
  const [addedMealId, setAddedMealId] = useState<string | null>(null);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return ALL_RECIPES.filter((recipe) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'snack' && (recipe.category === 'snack' || recipe.category === 'smoothies')) {
          // match
        } else if (recipe.category !== selectedCategory) {
          return false;
        }
      }

      // Diet style filter
      if (selectedDiet !== 'all' && recipe.dietStyle !== selectedDiet) {
        return false;
      }

      // Nutrient focus filter
      if (selectedNutrientFocus !== 'all') {
        const micro = recipe.micronutrients;
        if (!micro) return false;
        if (selectedNutrientFocus === 'high_iron' && (micro.ironMg || 0) < 3.0) return false;
        if (selectedNutrientFocus === 'high_fiber' && (micro.fiberG || 0) < 9) return false;
        if (selectedNutrientFocus === 'high_omega3' && (micro.omega3Mg || 0) < 800) return false;
        if (selectedNutrientFocus === 'high_calcium' && (micro.calciumMg || 0) < 180) return false;
        if (selectedNutrientFocus === 'high_protein' && recipe.proteinG < 25) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(q);
        const matchesCuisine = recipe.cuisine?.toLowerCase().includes(q);
        const matchesTag = recipe.tags?.some(t => t.toLowerCase().includes(q));
        const matchesIngredient = recipe.items.some(i => i.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCuisine && !matchesTag && !matchesIngredient) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDiet, selectedNutrientFocus]);

  const handleQuickAdd = (recipe: DetailedRecipe, slot: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
    onAddToToday(recipe, slot);
    setAddedMealId(recipe.id);
    setTimeout(() => setAddedMealId(null), 2500);
  };

  const categories = [
    { id: 'all', label: 'All Dishes', count: ALL_RECIPES.length },
    { id: 'breakfast', label: '🌅 Breakfast', count: ALL_RECIPES.filter(r => r.category === 'breakfast').length },
    { id: 'lunch', label: '☀️ Lunch', count: ALL_RECIPES.filter(r => r.category === 'lunch').length },
    { id: 'dinner', label: '🌙 Dinner', count: ALL_RECIPES.filter(r => r.category === 'dinner').length },
    { id: 'snack', label: '🍏 Snacks & Smoothies', count: ALL_RECIPES.filter(r => r.category === 'snack' || r.category === 'smoothies').length }
  ];

  const dietPills = [
    { id: 'all', label: 'All Diets' },
    { id: 'Vegetarian', label: '🥗 Vegetarian' },
    { id: 'Vegan', label: '🥦 Vegan' },
    { id: 'High Protein', label: '⚡ High Protein' },
    { id: 'Mediterranean', label: '🥑 Mediterranean' },
    { id: 'Pescatarian', label: '🐟 Pescatarian' },
    { id: 'Keto', label: '🧀 Keto' }
  ];

  const nutrientFocusPills = [
    { id: 'all', label: 'All Micronutrients' },
    { id: 'high_protein', label: '⚡ High Protein (25g+)' },
    { id: 'high_fiber', label: '🦠 High Fiber (9g+)' },
    { id: 'high_omega3', label: '🐟 High Omega-3 (800mg+)' },
    { id: 'high_iron', label: '🩸 High Iron (3mg+)' },
    { id: 'high_calcium', label: '🦴 High Calcium (180mg+)' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-in fade-in duration-300">
      
      {/* Hero Header with culinary theme */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider font-mono">
            <ChefHat className="w-3.5 h-3.5" />
            Curated Nutrition & Recipe Compendium
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Whole Food Recipes & Micronutrient Spectrum 🥑
          </h1>
          <p className="text-xs sm:text-sm text-orange-50 leading-relaxed">
            Every dish is nutritionally calculated with exact protein, carbs, healthy fats, dietary fiber, bioavailable vitamins, and mineral electrolytes.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={onOpenGenerator}
              className="px-4 py-2 rounded-2xl bg-white text-stone-900 font-bold text-xs hover:bg-orange-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Generate Full Daily Diet Plan
            </button>
          </div>
        </div>
      </div>

      {/* Search & Comprehensive Filters */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ingredient, dish name, cuisine, or nutrient (e.g. avocado, salmon, matcha, iron, farro)..."
            className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Meal Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-stone-100 pb-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-stone-200/80 text-stone-600'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Dietary Style Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
            <Filter className="w-3 h-3" /> Dietary Philosophy:
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {dietPills.map((diet) => (
              <button
                key={diet.id}
                onClick={() => setSelectedDiet(diet.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDiet === diet.id
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specific Micronutrient Focus Filters */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
            <Activity className="w-3 h-3 text-emerald-600" /> Micronutrient Target:
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {nutrientFocusPills.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNutrientFocus(n.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedNutrientFocus === n.id
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Recipe Grid Count & Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-bold px-1">
        <span>Showing {filteredRecipes.length} nutrient-verified recipes</span>
        {(searchQuery || selectedCategory !== 'all' || selectedDiet !== 'all' || selectedNutrientFocus !== 'all') && (
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDiet('all');
              setSelectedNutrientFocus('all');
            }}
            className="text-emerald-700 hover:underline cursor-pointer"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Recipe Grid Cards */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-3">
          <ChefHat className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-black text-stone-800 text-base">No recipes match your criteria</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search terms or dietary filters to explore our whole food culinary catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => {
            const micro = recipe.micronutrients;
            const slotTarget = recipe.category === 'smoothies' ? 'snack' : recipe.category;

            return (
              <div
                key={recipe.id}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Badges */}
                  <div 
                    onClick={() => setSelectedMealForModal({ meal: recipe, type: recipe.category.toUpperCase() })}
                    className="relative h-48 w-full overflow-hidden bg-stone-100 cursor-pointer"
                  >
                    <img
                      src={recipe.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-white/95 backdrop-blur-md text-stone-900 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl shadow-2xs uppercase">
                        {recipe.category}
                      </span>
                      <span className="bg-emerald-600/90 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-xl shadow-2xs">
                        {recipe.dietStyle}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-300" />
                      {recipe.prepTimeMinutes || 15}m
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-mono block opacity-80">{recipe.portion}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5">
                    <div>
                      <h3 
                        onClick={() => setSelectedMealForModal({ meal: recipe, type: recipe.category.toUpperCase() })}
                        className="font-black text-stone-900 text-base leading-snug group-hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {recipe.title}
                      </h3>
                      {recipe.cuisine && (
                        <span className="text-[11px] font-mono text-stone-400 block mt-0.5">
                          {recipe.cuisine}
                        </span>
                      )}
                    </div>

                    {/* 4-Column Core Nutrition Dial */}
                    <div className="grid grid-cols-4 gap-1 text-center bg-stone-50 p-2 rounded-2xl border border-stone-100">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-orange-600 font-bold block">Energy</span>
                        <span className="text-xs font-black text-stone-900">{recipe.estimatedCalories}</span>
                        <span className="text-[9px] text-stone-400 block">kcal</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-rose-600 font-bold block">Protein</span>
                        <span className="text-xs font-black text-rose-700">{recipe.proteinG}g</span>
                        <span className="text-[9px] text-stone-400 block">muscle</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-amber-600 font-bold block">Carbs</span>
                        <span className="text-xs font-black text-amber-700">{recipe.carbsG}g</span>
                        <span className="text-[9px] text-stone-400 block">energy</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-lime-700 font-bold block">Fats</span>
                        <span className="text-xs font-black text-lime-800">{recipe.fatG}g</span>
                        <span className="text-[9px] text-stone-400 block">lipids</span>
                      </div>
                    </div>

                    {/* Detailed Micronutrient Spectrum Highlights Badge */}
                    {micro && (
                      <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-sky-900 font-bold">
                          <span className="flex items-center gap-1 font-mono text-[10px] uppercase">
                            <Activity className="w-3 h-3 text-sky-600" /> Bioactive Micronutrients
                          </span>
                          <span className="text-[10px] text-sky-700">Fiber: {micro.fiberG}g</span>
                        </div>
                        <div className="flex flex-wrap gap-1 text-[10px] text-sky-800">
                          {micro.ironMg && <span className="bg-white/80 px-1.5 py-0.5 rounded-md">Iron: {micro.ironMg}mg</span>}
                          {micro.calciumMg && <span className="bg-white/80 px-1.5 py-0.5 rounded-md">Calcium: {micro.calciumMg}mg</span>}
                          {micro.potassiumMg && <span className="bg-white/80 px-1.5 py-0.5 rounded-md">Potassium: {micro.potassiumMg}mg</span>}
                          {micro.omega3Mg && <span className="bg-white/80 px-1.5 py-0.5 rounded-md font-bold text-emerald-800">Omega-3: {micro.omega3Mg}mg</span>}
                          {micro.vitaminCMg && <span className="bg-white/80 px-1.5 py-0.5 rounded-md">Vit C: {micro.vitaminCMg}mg</span>}
                        </div>
                      </div>
                    )}

                    {/* Quick Ingredients Sneak Peek */}
                    <div className="text-xs text-stone-600 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Features:
                      </span>
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-stone-500">
                        {recipe.items.slice(0, 3).join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 pt-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMealForModal({ meal: recipe, type: recipe.category.toUpperCase() })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Recipe & Macros
                  </button>

                  <button
                    onClick={() => handleQuickAdd(recipe, slotTarget as any)}
                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {addedMealId === recipe.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added!
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add to Fuel
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedMealForModal && (
        <RecipeModal
          meal={selectedMealForModal.meal}
          mealType={selectedMealForModal.type}
          onClose={() => setSelectedMealForModal(null)}
          onAddToTodaySlot={(slot) => onAddToToday(selectedMealForModal.meal, slot)}
        />
      )}

    </div>
  );
};
