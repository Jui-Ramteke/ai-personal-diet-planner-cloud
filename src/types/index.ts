export type DietaryPreference = 'Vegetarian' | 'Vegan' | 'General/Non-Vegetarian' | 'Keto' | 'Mediterranean' | 'Pescatarian';

export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';

export type FitnessGoal = 'General balanced eating' | 'Weight-management demo' | 'Fitness-oriented demo' | 'Endurance';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  goal: FitnessGoal;
  allergies?: string;
  cuisinePreference?: string;
  targetCalories?: number;
  createdAt: string;
}

export interface MicronutrientInfo {
  fiberG: number;
  sugarG?: number;
  sodiumMg?: number;
  potassiumMg?: number;
  calciumMg?: number;
  ironMg?: number;
  magnesiumMg?: number;
  zincMg?: number;
  vitaminAMcg?: number;
  vitaminCMg?: number;
  vitaminDIU?: number;
  vitaminB12Mcg?: number;
  omega3Mg?: number;
  keyPolyphenols?: string[];
  healthBenefits?: string[];
}

export interface DetailedRecipe extends MealItem {
  id: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'smoothies';
  dietStyle: 'Vegetarian' | 'High Protein' | 'Vegan' | 'Low Carb' | 'Mediterranean' | 'Pescatarian' | 'Keto';
  difficulty: 'Easy' | 'Medium' | 'Chef Special';
  proteinG: number;
  carbsG: number;
  fatG: number;
  micronutrients?: MicronutrientInfo;
  chefTip?: string;
  servings?: number;
}

export interface WellnessHabit {
  id: string;
  label: string;
  category: 'Nutrition' | 'Hydration' | 'Movement' | 'Recovery' | 'Mindfulness';
  completed: boolean;
  color: string;
  icon?: string;
}

export interface MealItem {
  title: string;
  items: string[];
  portion: string;
  estimatedCalories: number;
  prepTimeMinutes?: number;
  tags?: string[];
  imageUrl?: string;
  instructions?: string[];
  cuisine?: string;
  micronutrients?: MicronutrientInfo;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  chefTip?: string;
}

export interface LoggedFood {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  mealSlot: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  loggedAt: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  aisle: 'Fresh Produce' | 'Grains & Pantry' | 'Proteins & Dairy' | 'Superfoods & Nuts' | 'Herbs & Seasonings';
  checked: boolean;
}

export interface WeightLog {
  date: string;
  weightKg: number;
}

export interface NutritionSummary {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  microNutrientNotes: string;
}

export interface HydrationReminder {
  targetLiters: number;
  glassesPerDay: number;
  schedule: string[];
  electrolyteTip: string;
}

export interface TableSchemaField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignTable?: string;
  nullable: boolean;
  description: string;
}

export interface CollectionSchema {
  name: string;
  type: 'NoSQL Document Collection' | 'Relational SQL Table';
  description: string;
  primaryKey: string;
  fields: TableSchemaField[];
  sampleRecordCount: number;
}

export interface DietPlan {
  id: string;
  userId: string;
  title: string;
  generatedBy: 'gemini-3.8-flash' | 'rule_based_fallback' | 'rule_based' | string;
  dietaryPreference: DietaryPreference;
  goal: FitnessGoal;
  cuisineStyle?: string;
  healthFocus?: string[];
  breakfast: MealItem;
  lunch: MealItem;
  snack: MealItem;
  dinner: MealItem;
  nutritionSummary: NutritionSummary;
  hydrationReminder: HydrationReminder;
  disclaimer: string;
  createdAt: string;
  cloudDbRef?: string;
}

export interface StoredFile {
  id: string;
  userId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  bucket: string;
  etag: string;
  storageClass: 'STANDARD' | 'COLDLINE';
  dataUrl?: string;
  uploadedAt: string;
}

export interface CloudStats {
  dbStatus: 'CONNECTED' | 'DEGRADED';
  dbEngine: string;
  totalUsers: number;
  totalPlans: number;
  totalObjects: number;
  bucketUsedBytes: number;
  bucketMaxBytes: number;
  activeRegion: string;
  averageLatencyMs: number;
  uptimeSeconds: number;
  apiRequestsCount: number;
}

export interface TestCaseResult {
  id: string;
  scenario: string;
  inputDescription: string;
  expectedResult: string;
  actualResult: string;
  status: 'PASS' | 'FAIL' | 'RUNNING' | 'PENDING';
  latencyMs?: number;
  httpStatus?: number;
}
