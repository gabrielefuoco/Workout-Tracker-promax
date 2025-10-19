import type { Timestamp } from 'firebase/firestore';

// Re-export Timestamp to be available to other files that need it.
export type { Timestamp };


// === TEMPLATE TYPES ===
// These types model a reusable workout plan or template. This is the PLAN.

/**
 * A single target set as defined in a template.
 * This is used during a workout session to track progress against a target.
 */
export interface PerformedSet {
  id: string; // Client-generated UUID
  reps: number; // Target reps for this set
  weight: number; // Target weight for this set
  rir?: number | null; // Target Reps in Reserve
  completed: boolean; // Used in focus mode to track progress
}

/**
 * A group of sets for an exercise, e.g., "Warmup", "Top Set", "Backoff Sets".
 */
export interface SetGroup {
  id: string; // Client-generated UUID
  name: string;
  target: string; // A descriptive target, e.g., "5-8 reps @ RIR 2"
  performedSets: PerformedSet[];
  restSeconds?: number;
}

/**
 * An exercise within a workout template, containing one or more set groups.
 */
export interface Exercise {
  id: string; // Client-generated UUID
  name: string;
  setGroups: SetGroup[];
}

/**
 * The sovereign document for a workout template.
 */
export interface IWorkoutTemplate {
  id: string; // Firestore document ID
  name: string;
  description?: string;
  exercises: Exercise[];
  // Metadata for sorting and display
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastUsedAt: Timestamp | null;
  useCount?: number;
}


// === SESSION TYPES ===
// These types model a completed workout session log. This is the REPORT of what actually happened.

/**
 * A single set as it was actually performed during a workout session.
 */
export interface IWorkoutSet {
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion
  timestamp: Timestamp;
  isWarmup: boolean;
}

/**
 * An exercise as it was performed within a workout session.
 */
export interface ISessionExercise {
  id: string; // Client-generated UUID for this specific instance
  exerciseId: string; // Reference to the exercise in the template/catalog
  name: string; // Denormalized name for easier display
  order: number;
  notes?: string;
  sets: IWorkoutSet[];
}

/**
 * The possible states of a workout session document.
 */
export type WorkoutSessionStatus = 'active' | 'processing' | 'completed' | 'failed';

/**
 * Aggregated data calculated for a session post-workout.
 */
export interface IAggregatedData {
    totalVolume: number;
    totalSets: number;
    totalReps: number;
    durationMinutes: number;
    maxWeight: number;
}

/**
 * The sovereign document for a logged workout session.
 */
export interface IWorkoutSession {
  id: string; // Firestore document ID
  name: string; // Name of the workout template used
  startTime: Timestamp;
  endTime: Timestamp | null;
  notes?: string;
  status: WorkoutSessionStatus;
  exercises: ISessionExercise[];
  aggregatedData: IAggregatedData | null;
  processedAt?: Timestamp | null;
  errorMessage?: string;
}