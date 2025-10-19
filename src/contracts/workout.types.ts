// src/contracts/workout.types.ts

// Per ora, non hai Firebase. Definisci Timestamp come un tipo Date.
// Quando installerai Firebase, cambierai solo questa riga.
export type Timestamp = Date;

/**
 * Contratto per un singolo set. Questa è l'unità atomica di input.
 */
export interface IWorkoutSet {
  reps: number;
  weight: number;
  rpe?: number;
  timestamp: Timestamp;
  isWarmup: boolean;
}

/**
 * Contratto per un esercizio all'interno di una sessione attiva.
 */
export interface ISessionExercise {
  id: string; // UUID generato dal client
  exerciseId: string; // Riferimento al catalogo globale
  name: string; // Denormalizzato per non dover fare join
  order: number;
  notes?: string;
  sets: IWorkoutSet[];
}

/**
 * Gli unici stati che una sessione può avere. Nessun altro.
 */
export type WorkoutSessionStatus = 'active' | 'processing' | 'completed' | 'failed';

/**
 * Il documento sovrano: la sessione di allenamento.
 * La tua intera UI dipenderà da questa struttura.
 */
export interface IWorkoutSession {
  id: string;
  name: string;
  startTime: Timestamp;
  endTime: Timestamp | null;
  notes?: string;
  status: WorkoutSessionStatus;
  exercises: ISessionExercise[];
  // Questi dati sono calcolati dal backend, quindi saranno null
  // durante la sessione attiva e nel nostro mock.
  aggregatedData: {
    totalVolume: number;
    totalSets: number;
    totalReps: number;
    durationMinutes: number;
  } | null;
  errorMessage?: string;
}
