import type { UserProfile, DietPlan, MealItem, StoredFile, CloudStats, TestCaseResult, DietaryPreference, FitnessGoal, ActivityLevel } from '../types/index.ts';

const TOKEN_KEY = 'cloud_diet_auth_token';
const USER_KEY = 'cloud_diet_user_data';

export const ApiService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setAuth(token: string, user: UserProfile): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCachedUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({ success: false, message: 'Invalid JSON response from server' }));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  },

  // Auth APIs
  async register(data: {
    name: string;
    email: string;
    password: string;
    age: number;
    heightCm: number;
    weightKg: number;
    activityLevel: ActivityLevel;
    dietaryPreference: DietaryPreference;
    goal: FitnessGoal;
    allergies?: string;
  }): Promise<{ token: string; user: UserProfile; message: string }> {
    const res = await this.request<{ success: boolean; token: string; user: UserProfile; message: string }>('/api/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    this.setAuth(res.token, res.user);
    return res;
  },

  async login(email: string, password: string): Promise<{ token: string; user: UserProfile; message: string }> {
    const res = await this.request<{ success: boolean; token: string; user: UserProfile; message: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setAuth(res.token, res.user);
    return res;
  },

  async getProfile(): Promise<UserProfile> {
    const res = await this.request<{ success: boolean; profile: UserProfile }>('/api/profile');
    if (res.profile) {
      localStorage.setItem(USER_KEY, JSON.stringify(res.profile));
    }
    return res.profile;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await this.request<{ success: boolean; profile: UserProfile; message: string }>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    if (res.profile) {
      localStorage.setItem(USER_KEY, JSON.stringify(res.profile));
    }
    return res.profile;
  },

  // Diet Plan Generation APIs
  async generatePlan(params: {
    mode?: 'gemini' | 'rule_based' | 'simulate_failure';
    profileOverride?: Partial<UserProfile>;
    cuisineStyle?: string;
    targetCaloriesOverride?: number;
    healthFocus?: string[];
    favoriteFoods?: string;
    mealCount?: number;
  }): Promise<{ plan: DietPlan; engine: string; message: string }> {
    return this.request<{ success: boolean; plan: DietPlan; engine: string; message: string }>('/api/generate-plan', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async swapMeal(data: {
    slot: 'breakfast' | 'lunch' | 'snack' | 'dinner';
    dietaryPreference: DietaryPreference;
    calories: number;
    currentTitle?: string;
    cuisineStyle?: string;
    allergies?: string;
  }): Promise<{ success: boolean; meal: MealItem; message: string }> {
    return this.request<{ success: boolean; meal: MealItem; message: string }>('/api/swap-meal', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async savePlan(plan: DietPlan): Promise<DietPlan> {
    const res = await this.request<{ success: boolean; plan: DietPlan; message: string }>('/api/plans', {
      method: 'POST',
      body: JSON.stringify({ plan })
    });
    return res.plan;
  },

  async getSavedPlans(): Promise<DietPlan[]> {
    const res = await this.request<{ success: boolean; count: number; plans: DietPlan[] }>('/api/plans');
    return res.plans || [];
  },

  async getPlanById(id: string): Promise<DietPlan> {
    const res = await this.request<{ success: boolean; plan: DietPlan }>(`/api/plans/${id}`);
    return res.plan;
  },

  async updatePlan(id: string, updates: Partial<DietPlan>): Promise<DietPlan> {
    const res = await this.request<{ success: boolean; plan: DietPlan; message: string }>(`/api/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.plan;
  },

  async deletePlan(id: string): Promise<void> {
    await this.request(`/api/plans/${id}`, {
      method: 'DELETE'
    });
  },

  // Cloud Object Storage APIs
  async uploadFile(fileData: {
    filename: string;
    contentType: string;
    dataUrl: string;
  }): Promise<StoredFile> {
    const res = await this.request<{ success: boolean; file: StoredFile; message: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify(fileData)
    });
    return res.file;
  },

  async updateFile(id: string, updates: { filename?: string }): Promise<StoredFile> {
    const res = await this.request<{ success: boolean; file: StoredFile; message: string }>(`/api/files/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.file;
  },

  async getStoredFiles(): Promise<StoredFile[]> {
    const res = await this.request<{ success: boolean; count: number; files: StoredFile[] }>('/api/files');
    return res.files || [];
  },

  async deleteStoredFile(id: string): Promise<void> {
    await this.request(`/api/files/${id}`, {
      method: 'DELETE'
    });
  },

  // Schema & Database Inspection APIs
  async getAllUsers(): Promise<UserProfile[]> {
    const res = await this.request<{ success: boolean; count: number; users: UserProfile[] }>('/api/users');
    return res.users || [];
  },

  async getDatabaseSchema(): Promise<any> {
    const res = await this.request<{ success: boolean; schema: any }>('/api/schema');
    return res.schema;
  },

  // Monitoring & Telemetry
  async getCloudStats(): Promise<CloudStats> {
    const res = await this.request<{ success: boolean; stats: CloudStats }>('/api/cloud-stats');
    return res.stats;
  },

  // Automated Testing
  async runCloudTests(): Promise<{
    totalTests: number;
    passed: number;
    failed: number;
    results: TestCaseResult[];
  }> {
    return this.request<{
      success: boolean;
      totalTests: number;
      passed: number;
      failed: number;
      results: TestCaseResult[];
    }>('/api/run-tests', {
      method: 'POST'
    });
  }
};
