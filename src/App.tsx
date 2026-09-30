import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { DailyTrackerView } from './components/DailyTrackerView.tsx';
import { PlanGenerator } from './components/PlanGenerator.tsx';
import { PlanResultView } from './components/PlanResultView.tsx';
import { RecipeDiscoveryView } from './components/RecipeDiscoveryView.tsx';
import { GroceryListView } from './components/GroceryListView.tsx';
import { SavedPlansView } from './components/SavedPlansView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { ApiService } from './services/api.ts';
import type { UserProfile, DietPlan, CloudStats, MealItem } from './types/index.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('tracker');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cloudStats, setCloudStats] = useState<CloudStats | null>(null);
  const [activePlan, setActivePlan] = useState<DietPlan | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize cached user & cloud stats on mount
  useEffect(() => {
    const cached = ApiService.getCachedUser();
    if (cached) {
      setUser(cached);
    } else {
      // Pre-seed demo user Alex so the student has an immediately functioning dashboard!
      handleQuickSwitchUser('alex');
    }

    refreshCloudStats();
    const interval = setInterval(refreshCloudStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const refreshCloudStats = async () => {
    try {
      const stats = await ApiService.getCloudStats();
      setCloudStats(stats);
    } catch (err) {
      console.warn('Could not fetch cloud stats', err);
    }
  };

  const handleLogout = () => {
    ApiService.clearAuth();
    setUser(null);
    setCurrentTab('tracker');
  };

  const handleQuickSwitchUser = async (type: 'alex' | 'sarah') => {
    try {
      const email = type === 'alex' ? 'alex@demo.cloud' : 'sarah@demo.cloud';
      const res = await ApiService.login(email, 'password123');
      setUser(res.user);
      refreshCloudStats();
    } catch (err) {
      console.warn('Quick switch login failed', err);
    }
  };

  const handlePlanGenerated = (plan: DietPlan) => {
    setActivePlan(plan);
    setCurrentTab('result');
    refreshCloudStats();
  };

  const handleSelectSavedPlan = (plan: DietPlan) => {
    setActivePlan(plan);
    setCurrentTab('result');
  };

  const handleApplyTodayPlan = (plan: DietPlan) => {
    setActivePlan(plan);
    setCurrentTab('tracker');
  };

  const handleAddRecipeToToday = (meal: MealItem, slot: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
    if (activePlan) {
      const updated: DietPlan = {
        ...activePlan,
        [slot]: meal
      };
      setActivePlan(updated);
    }
    setCurrentTab('tracker');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-stone-900 flex flex-col font-sans selection:bg-emerald-600/20 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        cloudStats={cloudStats}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onQuickSwitchUser={handleQuickSwitchUser}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'tracker' && (
          <DailyTrackerView
            user={user}
            activePlan={activePlan}
            onOpenGenerator={() => setCurrentTab('generator')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'generator' && (
          <PlanGenerator
            user={user}
            onPlanGenerated={handlePlanGenerated}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'discovery' && (
          <RecipeDiscoveryView
            onAddToToday={handleAddRecipeToToday}
            onOpenGenerator={() => setCurrentTab('generator')}
          />
        )}

        {currentTab === 'grocery' && (
          <GroceryListView
            activePlan={activePlan}
            onOpenGenerator={() => setCurrentTab('generator')}
          />
        )}

        {currentTab === 'result' && activePlan && (
          <PlanResultView
            plan={activePlan}
            user={user}
            onBack={() => setCurrentTab('generator')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onApplyTodayPlan={handleApplyTodayPlan}
            onNavigateToGrocery={() => setCurrentTab('grocery')}
          />
        )}

        {currentTab === 'plans' && (
          <SavedPlansView
            user={user}
            onSelectPlan={handleSelectSavedPlan}
            onOpenGenerator={() => setCurrentTab('generator')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onApplyTodayPlan={handleApplyTodayPlan}
          />
        )}

        {currentTab === 'profile' && user && (
          <ProfileView
            user={user}
            onUpdateProfile={(updated) => setUser(updated)}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(authedUser) => {
          setUser(authedUser);
          refreshCloudStats();
        }}
      />

      {/* Clean Light Footer */}
      <footer className="bg-white border-t border-stone-200/80 py-6 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-800">DietCloud AI</span>
            <span>·</span>
            <span>Personalized Daily Nutrition & Whole-Food Tracking</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
              Cloud Database Active
            </span>
            <span>·</span>
            <span>Educational Simulation & Wellness Demo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
