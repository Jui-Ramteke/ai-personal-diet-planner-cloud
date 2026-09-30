import React, { useState } from 'react';
import { 
  User, 
  Activity, 
  Flame, 
  Scale, 
  Heart, 
  Check, 
  Edit2, 
  Database, 
  Calendar, 
  Sparkles, 
  Salad 
} from 'lucide-react';
import { ApiService } from '../services/api.ts';
import type { UserProfile, DietaryPreference, FitnessGoal, ActivityLevel } from '../types/index.ts';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [heightCm, setHeightCm] = useState(user.heightCm);
  const [weightKg, setWeightKg] = useState(user.weightKg);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user.activityLevel);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(user.dietaryPreference);
  const [goal, setGoal] = useState<FitnessGoal>(user.goal);
  const [allergies, setAllergies] = useState(user.allergies || '');

  // Calculate live health indicators
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '22.0';
  const numBmi = parseFloat(bmi);

  let bmiCategory = 'Healthy range';
  let bmiColor = 'text-emerald-800 bg-emerald-100 border-emerald-300';
  if (numBmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-800 bg-amber-100 border-amber-300';
  } else if (numBmi >= 25 && numBmi < 30) {
    bmiCategory = 'Overweight range';
    bmiColor = 'text-orange-800 bg-orange-100 border-orange-300';
  } else if (numBmi >= 30) {
    bmiCategory = 'Obesity range';
    bmiColor = 'text-rose-800 bg-rose-100 border-rose-300';
  }

  // Mifflin-St Jeor estimated BMR
  const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 70);
  const activityMultipliers: Record<ActivityLevel, number> = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725
  };
  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.375));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const updated = await ApiService.updateProfile({
        name,
        age,
        heightCm,
        weightKg,
        activityLevel,
        dietaryPreference,
        goal,
        allergies
      });
      onUpdateProfile(updated);
      setIsEditing(false);
      setMessage('Profile updated and synchronized with Cloud Database.');
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage(err?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner with vibrant rainbow gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 p-6 sm:p-8 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-2xl shadow-sm border border-white/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
              <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                {user.dietaryPreference}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-50 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-emerald-100 font-mono">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5" />
                Collection: <code>users</code>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
        >
          <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
          {isEditing ? 'Cancel Edit' : 'Edit Health Metrics'}
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Body Metric Dial Cards with 4 Distinct Theme Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* BMI */}
        <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono font-bold text-stone-400">BMI Meter</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bmiColor}`}>
              {bmiCategory}
            </span>
          </div>
          <span className="text-2xl font-black text-stone-900">{bmi}</span>
          <span className="text-[11px] text-stone-400 block mt-0.5 font-medium">kg / m²</span>
        </div>

        {/* BMR: Tangerine Orange */}
        <div className="bg-white border border-orange-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono font-bold text-orange-700">Resting BMR</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-2xl font-black text-orange-600">{bmr}</span>
          <span className="text-[11px] text-stone-400 block mt-0.5 font-medium">kcal resting</span>
        </div>

        {/* TDEE: Sky Blue */}
        <div className="bg-white border border-sky-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono font-bold text-sky-700">Active TDEE</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-2xl font-black text-sky-700">{tdee}</span>
          <span className="text-[11px] text-stone-400 block mt-0.5 font-medium">kcal daily burn</span>
        </div>

        {/* Weight: Avocado Lime */}
        <div className="bg-white border border-lime-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono font-bold text-lime-800">Current Weight</span>
            <Scale className="w-4 h-4 text-lime-600" />
          </div>
          <span className="text-2xl font-black text-lime-800">{user.weightKg}</span>
          <span className="text-[11px] text-stone-400 block mt-0.5 font-medium">kg ({user.heightCm} cm)</span>
        </div>
      </div>

      {/* Profile Details or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-emerald-600" /> Update Personal Body & Diet Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Age (Years)</label>
              <input
                type="number"
                min="16"
                max="99"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                required
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="220"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Dietary Philosophy</label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="Vegetarian">🥗 Vegetarian</option>
                <option value="Vegan">🥦 Vegan</option>
                <option value="General/Non-Vegetarian">🥩 General / Non-Vegetarian</option>
                <option value="Mediterranean">🥑 Mediterranean</option>
                <option value="Keto">🧀 Keto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Fitness Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="General balanced eating">Balanced Vitality</option>
                <option value="Weight-management demo">Weight Deficit / Fat Loss</option>
                <option value="Fitness-oriented demo">Muscle Hypertrophy / Athletic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Allergies & Dietary Exclusions</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Peanut allergy, gluten sensitive, lactose intolerant"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              {loading ? 'Saving...' : 'Save & Sync Cloud DB'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Salad className="w-5 h-5 text-emerald-600" />
              Nutritional Preferences & Goals
            </h2>
            <span className="text-xs font-bold text-emerald-800 font-mono bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Cloud Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1">
              <span className="text-stone-400 block font-medium">Dietary Preference:</span>
              <strong className="text-stone-800 text-sm block">{user.dietaryPreference}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-stone-400 block font-medium">Activity Tier:</span>
              <strong className="text-stone-800 text-sm block">{user.activityLevel}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-stone-400 block font-medium">Fitness Goal:</span>
              <strong className="text-stone-800 text-sm block">{user.goal}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-stone-400 block font-medium">Allergens / Exclusions:</span>
              <strong className="text-stone-800 text-sm block">{user.allergies || 'None specified'}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
