import React from 'react';
import { 
  Sparkles, 
  Utensils, 
  BookOpen, 
  User, 
  LogOut, 
  Salad, 
  ShoppingBag,
  ChefHat,
  Database
} from 'lucide-react';
import type { UserProfile, CloudStats } from '../types/index.ts';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile | null;
  cloudStats: CloudStats | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onQuickSwitchUser: (type: 'alex' | 'sarah') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  cloudStats,
  onOpenAuth,
  onLogout,
  onQuickSwitchUser
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top subtle status & demo switcher bar with rainbow micro-accents */}
      <div className="bg-stone-50/90 px-4 py-1.5 text-[11px] border-b border-stone-200/60 flex items-center justify-between text-stone-500 font-sans">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            Cloud DB Active
          </span>
          <span className="text-stone-300 hidden sm:inline">|</span>
          <span className="text-stone-500 hidden sm:inline text-[11px]">
            Region: <span className="font-mono text-emerald-700 font-medium">{cloudStats?.activeRegion || 'ap-southeast-1'}</span>
          </span>
        </div>

        {/* Demo Account Switcher with vibrant Green and Coral accents */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 text-[11px] hidden sm:inline font-medium">Demo Profiles:</span>
          <div className="flex items-center bg-white rounded-xl p-0.5 border border-stone-200 shadow-2xs text-[11px]">
            <button
              onClick={() => onQuickSwitchUser('alex')}
              className={`px-2.5 py-0.5 rounded-lg transition-all ${
                user?.email.includes('alex') 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-xs' 
                  : 'text-stone-600 hover:text-emerald-700 font-medium'
              }`}
            >
              🥗 Alex (Veggie)
            </button>
            <button
              onClick={() => onQuickSwitchUser('sarah')}
              className={`px-2.5 py-0.5 rounded-lg transition-all ${
                user?.email.includes('sarah') 
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold shadow-xs' 
                  : 'text-stone-600 hover:text-rose-600 font-medium'
              }`}
            >
              🥩 Sarah (Fitness)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with fresh Avocado to Citrus gradient */}
          <div 
            onClick={() => setCurrentTab('tracker')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Salad className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-stone-900">
                  Diet<span className="text-emerald-600">Cloud</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-200">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-stone-500 hidden sm:block font-medium">Whole Food Nutrition & Fuel</p>
            </div>
          </div>

          {/* Interactive Navigation Links with distinct color highlights */}
          <nav className="flex items-center gap-1 font-medium text-xs sm:text-sm">
            {/* Today's Fuel: Mint Green */}
            <button
              onClick={() => setCurrentTab('tracker')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                currentTab === 'tracker'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
                  : 'text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Today's Fuel</span>
            </button>

            {/* AI Planner: Warm Golden Yellow */}
            <button
              onClick={() => setCurrentTab('generator')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                currentTab === 'generator'
                  ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300 shadow-2xs'
                  : 'text-stone-600 hover:text-amber-700 hover:bg-amber-50/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Planner</span>
            </button>

            {/* Recipes: Tangerine Orange */}
            <button
              onClick={() => setCurrentTab('discovery')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                currentTab === 'discovery'
                  ? 'bg-orange-50 text-orange-900 font-bold border border-orange-300 shadow-2xs'
                  : 'text-stone-600 hover:text-orange-700 hover:bg-orange-50/50'
              }`}
            >
              <ChefHat className="w-4 h-4 text-orange-500" />
              <span className="hidden sm:inline">Recipes</span>
            </button>

            {/* Grocery: Fresh Lime Green */}
            <button
              onClick={() => setCurrentTab('grocery')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                currentTab === 'grocery'
                  ? 'bg-lime-50 text-lime-900 font-bold border border-lime-300 shadow-2xs'
                  : 'text-stone-600 hover:text-lime-700 hover:bg-lime-50/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-lime-600" />
              <span className="hidden md:inline">Grocery</span>
            </button>

            {/* Saved Plans: Berry Pink */}
            <button
              onClick={() => setCurrentTab('plans')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                currentTab === 'plans'
                  ? 'bg-pink-50 text-pink-900 font-bold border border-pink-300 shadow-2xs'
                  : 'text-stone-600 hover:text-pink-700 hover:bg-pink-50/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-pink-600" />
              <span className="hidden md:inline">Saved Plans</span>
            </button>

            {/* Profile: Sky Azure */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                currentTab === 'profile'
                  ? 'bg-sky-50 text-sky-900 font-bold border border-sky-300 shadow-2xs'
                  : 'text-stone-600 hover:text-sky-700 hover:bg-sky-50/50'
              }`}
            >
              <User className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </nav>

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentTab('profile')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-stone-100 text-stone-800 transition-colors"
                >
                  <div 
                    className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs"
                    title={user.name}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-stone-700 hidden lg:inline max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
