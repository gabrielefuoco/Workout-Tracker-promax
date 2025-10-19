// src/contracts/workout.schemas.ts
import { z } from 'zod';

// Zod non ha un tipo Timestamp, quindi lo definiamo come Date.
const TimestampSchema = z.date();

export const WorkoutSetSchema = z.object({
  reps: z.number().int().positive().max(100),
  weight: z.number().nonnegative().max(1000),
  rpe: z.number().int().min(1).max(10).optional(),
  timestamp: TimestampSchema,
  isWarmup: z.boolean().default(false),
});

export const SessionExerciseSchema = z.object({
  id: z.string().uuid(),
  exerciseId: z.string().min(1),
  name: z.string().min(1).max(100),
  order: z.number().int().nonnegative(),
  notes: z.string().max(500).optional(),
  sets: z.array(WorkoutSetSchema).min(1),
});

export const WorkoutSessionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  startTime: TimestampSchema,
  endTime: TimestampSchema.nullable(),
  notes: z.string().max(1000).optional(),
  status: z.enum(['active', 'processing', 'completed', 'failed']),
  exercises: z.array(SessionExerciseSchema),
  aggregatedData: z.any().nullable(),
  errorMessage: z.string().optional(),
});
