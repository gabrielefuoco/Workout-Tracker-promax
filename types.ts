export type Timestamp = number; // Unix timestamp in milliseconds

// Contratto per un singolo set, i dati grezzi scritti dal client
export interface IWorkoutSet {
  reps: number;
  weight: number;
  rpe?: number;
  timestamp: Timestamp;
  isWarmup: boolean;
}

// Contratto per un'istanza di un esercizio all'interno di una sessione
export interface ISessionExercise {
  id: string;
  exerciseId: string;
  name: string;
  order: number;
  notes?: string;
  sets: IWorkoutSet[];
}

// Contratto per i dati aggregati
export interface IAggregatedData {
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  durationMinutes: number;
  maxWeight: number;
  prsAchieved: Array<{
    exerciseId: string;
    exerciseName: string;
    description: string;
    previousValue: number;
    newValue: number;
  }>;
}

export type WorkoutSessionStatus = 'active' | 'processing' | 'completed' | 'failed';

// Il documento sovrano: la sessione di allenamento
export interface IWorkoutSession {
  id: string;
  name: string;
  startTime: Timestamp;
  endTime: Timestamp | null;
  notes?: string;
  status: WorkoutSessionStatus;
  exercises: ISessionExercise[];
  aggregatedData: IAggregatedData | null;
  processedAt?: Timestamp | null;
  errorMessage?: string;
}

// Contratto per template di allenamento
export interface IWorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Array<{
    exerciseId: string;
    name: string;
    order: number;
    targetSets: number;
    targetReps: number;
    targetWeight?: number;
    notes?: string;
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastUsedAt: Timestamp | null;
  useCount: number;
}
// FIX: Add missing type definitions for Workout, Exercise, SetGroup, and PerformedSet.
// These types are used for workout templates/plans, distinct from workout sessions.
export interface PerformedSet {
  id: string;
  reps: number;
  weight: number;
  rir?: number | null;
  completed: boolean;
}

export interface SetGroup {
  id: string;
  name: string;
  target: string;
  performedSets: PerformedSet[];
  restSeconds?: number;
}

export interface Exercise {
  id: string;
  name: string;
  setGroups: SetGroup[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}
