// types.ts - LA TUA UNICA LEGGE
export type Timestamp = number;

// --- TIPI PER LE SESSIONI (COSA HAI FATTO) ---
export interface IWorkoutSet {
  reps: number;
  weight: number;
  rpe?: number;
  timestamp: Timestamp;
  isWarmup: boolean;
}

export interface ISessionExercise {
  id: string;
  exerciseId: string;
  name: string;
  order: number;
  notes?: string;
  sets: IWorkoutSet[];
}

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

// --- TIPI PER I TEMPLATE (COSA VUOI FARE) ---
export interface ITemplateExercise {
    exerciseId: string; // ID di riferimento dal catalogo
    name: string;
    order: number;
    targetSets: number;
    targetReps: string; // Can be a range like "8-12"
    targetWeight?: number;
    restSeconds?: number;
    notes?: string;
}

export interface IWorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: ITemplateExercise[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastUsedAt: Timestamp | null;
  useCount: number;
}
