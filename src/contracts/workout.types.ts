// src/contracts/workout.types.ts

// Stato derivato dal Timestamp di Firebase, qui simulato con number
type Timestamp = number;

/**
 * Stati possibili di una sessione di allenamento, come da protocollo.
 */
export type WorkoutSessionStatus = 'active' | 'processing' | 'completed' | 'failed';

/**
 * Contratto per un singolo set, i dati grezzi scritti dal client.
 */
export interface IWorkoutSet {
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  timestamp: Timestamp;
  isWarmup: boolean;
}

/**
 * Contratto per un'istanza di un esercizio all'interno di una sessione.
 */
export interface ISessionExercise {
  id: string; // UUID generato client-side
  exerciseId: string; // Riferimento a un catalogo globale
  name: string; // Denormalizzato per letture veloci
  order: number; // Ordine di esecuzione
  notes?: string;
  sets: IWorkoutSet[];
}

/**
 * Contratto per i dati aggregati, calcolati e scritti esclusivamente dal backend.
 */
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

/**
 * Il documento sovrano: la sessione di allenamento.
 */
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

/**
 * Contratto per un esercizio all'interno di un template.
 */
export interface ITemplateExercise {
    exerciseId: string;
    name: string;
    order: number;
    targetSets: number;
    targetReps: string;
    targetWeight?: number;
    restSeconds?: number;
    notes?: string;
}

/**
 * Contratto per i template di allenamento.
 */
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