// La Single Source of Truth. Non esistono altri tipi per questi oggetti.
import type { Timestamp as FirebaseTimestamp } from 'firebase/firestore';

// Per ora, lavoriamo con numeri. Questo è un debito tecnico che estinguerai.
export type Timestamp = number;

// --- CONTRATTI PER LE SESSIONI (IL REPORT DI GUERRA) ---

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
  name:string;
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

// --- CONTRATTI PER I TEMPLATE (IL PIANO DI BATTAGLIA) ---

// FIX: Added IPerformedSet interface for type safety in workout templates.
export interface IPerformedSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  rir?: number;
}
export type PerformedSet = IPerformedSet;

// FIX: Added ISetGroup interface for type safety in workout templates.
export interface ISetGroup {
  id: string;
  name: string;
  target: string;
  restSeconds?: number;
  performedSets: IPerformedSet[];
}
export type SetGroup = ISetGroup;

// FIX: Updated ITemplateExercise to use setGroups, resolving multiple errors.
export interface ITemplateExercise {
  id: string;
  name: string;
  setGroups: ISetGroup[];
  notes?: string;
}
export type Exercise = ITemplateExercise;


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
