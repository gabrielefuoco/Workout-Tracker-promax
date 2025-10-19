import { z } from 'zod';

// Definiamo un tipo custom per il Timestamp di Firebase per non bloccare lo schema
const timestampSchema = z.custom<number>((val) => typeof val === 'number');

export const WorkoutSetSchema = z.object({
  reps: z.number().int().min(0, "Le ripetizioni non possono essere negative."),
  weight: z.number().min(0, "Il peso non può essere negativo."),
  rpe: z.number().min(1).max(10).optional().nullable(),
  timestamp: timestampSchema,
  isWarmup: z.boolean().default(false),
});

export const SessionExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  name: z.string(),
  order: z.number(),
  notes: z.string().optional().nullable(),
  sets: z.array(WorkoutSetSchema),
});

export const WorkoutSessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    startTime: timestampSchema,
    endTime: timestampSchema.nullable(),
    status: z.enum(['active', 'processing', 'completed', 'failed']),
    exercises: z.array(SessionExerciseSchema),
    aggregatedData: z.any().nullable(),
    processedAt: timestampSchema.optional().nullable(),
    errorMessage: z.string().optional().nullable(),
});

// Tipi inferiti per l'uso nel codice
export type IWorkoutSetInput = z.infer<typeof WorkoutSetSchema>;
