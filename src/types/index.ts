export type DayKey = 'mo' | 'di' | 'mi' | 'do' | 'fr' | 'sa' | 'so';
export type WorkoutType = 'easy' | 'long' | 'tempo' | 'race' | 'test';
export type Theme = 'light' | 'dark';

export interface Settings {
  name: string;
  startDate: string; // ISO date — Woche 1 startet hier
  weekOffset: number; // manueller Override; wird auf berechnete Woche addiert
  hfMax: number;
  rhrBaseline: number;
  weight: number;
  height: number;
  goalPace: string; // "5:40"
  weeklyVolumeTarget: number;
}

export interface DailyLog {
  date: string;
  sleep?: number;
  rhr?: number;
  energy?: number;
  stress?: number;
  mood?: number;
  weight?: number;
  strength?: string;
  blackroll?: string;
  nutrition?: string;
  notes?: string;
  hund?: number;
  training?: WorkoutLog;
}

export interface WorkoutLog {
  type?: WorkoutType;
  completed: boolean;
  date?: string; // ISO yyyy-mm-dd, gesetzt beim Loggen
  distance?: number;
  duration?: number;
  avgHr?: number;
  maxHr?: number;
  rpe?: number;
  weather?: string;
  youtube?: string;
  blackroll?: string;
  stravaId?: string;
  notes?: string;
  splits?: KmSplit[];
  zones?: ZoneDistribution;
}

export interface KmSplit {
  km: number;
  time: number;
  pace: string;
  hr?: number;
}

export interface ZoneDistribution {
  z1: number;
  z2: number;
  z3: number;
  z4: number;
  z5: number;
}

export interface PlanWeek {
  week: number;
  phase: 1 | 2 | 3;
  workouts: PlannedWorkout[];
  deload?: boolean;
  test?: 'A' | 'B' | 'C';
  race?: boolean;
}

export interface PlannedWorkout {
  day: DayKey;
  label: string;
  minutes: number;
  zone: string;
  description: string;
  type: WorkoutType;
}

export interface WorkoutTypeDetail {
  name: string;
  flow: WorkoutPhase[];
  blackroll: string;
  pre: NutritionAdvice;
  during?: NutritionAdvice;
  post: NutritionAdvice;
  notes: string;
}

export interface WorkoutPhase {
  phase: string;
  duration: string;
  desc: string;
}

export interface NutritionAdvice {
  time: string;
  options: string[];
}

export type ShoppingCategory =
  | 'Obst & Gemüse'
  | 'Kühlware'
  | 'Tiefkühl'
  | 'Trockenwaren'
  | 'Konserven'
  | 'Vorrat'
  | 'Sonstiges';

export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'EL' | 'TL' | 'St' | 'Dose' | 'Pck' | 'Prise';

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
  category: ShoppingCategory;
}

export interface Macros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Recipe {
  id: string;
  name: string;
  portions: number;
  time: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'during';
  note?: string;
  ingredients: Ingredient[];
  instructions?: string;
  macros: Macros;
  tags: string[];
}

export interface ShoppingState {
  selected: Record<string, number>;
  custom: string[];
  checked: Record<string, boolean>;
}

export interface AppState {
  settings: Settings;
  logs: Record<string, DailyLog>;
  trainings: Record<number, Record<string, WorkoutLog>>;
  shopping: ShoppingState;
  theme: Theme;
  stravaAthleteId: number | null;
}

export type ScreenKey = 'heute' | 'plan' | 'rezepte' | 'verlauf' | 'mehr';
