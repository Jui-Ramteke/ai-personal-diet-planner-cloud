import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Zap, AlertCircle, ArrowRight, UserPlus, Salad } from 'lucide-react';
import { ApiService } from '../services/api.ts';
import type { UserProfile, DietaryPreference, FitnessGoal, ActivityLevel } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(24);
  const [heightCm, setHeightCm] = useState(172);
  const [weightKg, setWeightKg] = useState(68);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('Moderately Active');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('Vegetarian');
  const [goal, setGoal] = useState<FitnessGoal>('Weight-management demo');
  const [allergies, setAllergies] = useState('');

  if (!isOpen) return null;

  const handleQuickDemoLogin = async (type: 'alex' | 'sarah') => {
    setLoading(true);
    setError(null);
    try {
      const demoEmail = type === 'alex' ? 'alex@demo.cloud' : 'sarah@demo.cloud';
      const res = await ApiService.login(demoEmail, 'password123');
      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const res = await ApiService.login(email, password);
        onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await ApiService.register({
          name,
          email,
          password,
          age,
          heightCm,
          weightKg,
          activityLevel,
          dietaryPreference,
          goal,
          allergies
        });
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-sm">
            <Salad className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 tracking-tight">
              Diet<span className="text-emerald-600">Cloud</span> AI
            </h2>
            <p className="text-[11px] text-stone-500 font-medium">Personal Nutrition & Daily Tracking</p>
          </div>
        </div>

        {/* Quick Demo Accounts Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Instant Demo Access:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('alex')}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-white border border-emerald-200 text-left hover:border-emerald-500 hover:shadow-xs transition-all"
            >
              <span className="font-extrabold text-[11px] text-stone-900 block truncate">🥗 Alex Rivera</span>
              <span className="text-[10px] text-stone-500 block truncate">Veggie · Deficit</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('sarah')}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-white border border-orange-200 text-left hover:border-orange-500 hover:shadow-xs transition-all"
            >
              <span className="font-extrabold text-[11px] text-stone-900 block truncate">🥩 Sarah Chen</span>
              <span className="text-[10px] text-stone-500 block truncate">Fitness · High Prot</span>
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Initial Body & Diet Metrics
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 mb-1">Diet Preference</label>
                <select
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800"
                >
                  <option value="Vegetarian">🥗 Balanced Vegetarian</option>
                  <option value="Vegan">🥦 Plant-Based Vegan</option>
                  <option value="General/Non-Vegetarian">🥩 High-Protein Omnivore</option>
                  <option value="Mediterranean">🥑 Mediterranean Vitality</option>
                  <option value="Keto">🧀 Keto / Low-Carb</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In to DietCloud</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Cloud Profile</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
