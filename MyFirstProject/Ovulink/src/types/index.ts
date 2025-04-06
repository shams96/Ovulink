// User types
export interface User {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  email: string;
  partnerId?: string;
}

// Cycle tracking types
export interface CycleDay {
  date: string;
  temperature?: number;
  cervicalMucus?: 'dry' | 'sticky' | 'creamy' | 'watery' | 'eggWhite';
  cervicalPosition?: 'low' | 'medium' | 'high';
  cervicalFirmness?: 'firm' | 'medium' | 'soft';
  cervicalOpening?: 'closed' | 'medium' | 'open';
  ovulationTest?: 'negative' | 'positive';
  menstruation?: 'none' | 'light' | 'medium' | 'heavy';
  notes?: string;
}

export interface Cycle {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  days: CycleDay[];
  predictedOvulationDate?: string;
  predictedPeriodDate?: string;
}

// Male health tracking types
export interface SpermTest {
  id: string;
  userId: string;
  date: string;
  count: number; // millions per ml
  motility: number; // percentage
  morphology: number; // percentage
  volume: number; // ml
  notes?: string;
}

export interface DailyLog {
  date: string;
  userId: string;
  sleep: {
    duration: number; // hours
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  stress: 'none' | 'low' | 'medium' | 'high';
  exercise: {
    duration: number; // minutes
    intensity: 'none' | 'light' | 'moderate' | 'intense';
    type?: string;
  };
  nutrition: {
    water: number; // glasses
    alcohol: number; // drinks
    caffeine: number; // servings
    mealQuality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  supplements: string[];
  symptoms: string[];
  mood: 'very bad' | 'bad' | 'neutral' | 'good' | 'very good';
  notes?: string;
}

// App state types
export interface AuthState {
  user: User | null;
  partner: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CycleState {
  cycles: Cycle[];
  currentCycle: Cycle | null;
  loading: boolean;
  error: string | null;
}

export interface MaleHealthState {
  spermTests: SpermTest[];
  loading: boolean;
  error: string | null;
}

export interface DailyLogState {
  logs: Record<string, DailyLog>;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  cycle: CycleState;
  maleHealth: MaleHealthState;
  dailyLog: DailyLogState;
}
