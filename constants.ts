import type { IWorkoutTemplate, IWorkoutSession } from './types';

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

export const INITIAL_WORKOUT_TEMPLATES: IWorkoutTemplate[] = [
  {
    id: 'template-1',
    name: 'Push Day (Hypertrophy)',
    description: 'Focus on chest, shoulders, and triceps.',
    exercises: [
      {
        exerciseId: 'ex-bench',
        name: 'Bench Press',
        order: 0,
        targetSets: 3,
        targetReps: '8-10',
        targetWeight: 80,
        restSeconds: 90,
        notes: "Keep elbows tucked at 45 degrees."
      },
      {
        exerciseId: 'ex-ohp',
        name: 'Overhead Press',
        order: 1,
        targetSets: 4,
        targetReps: '10-12',
        targetWeight: 50,
        restSeconds: 75,
      },
      {
        exerciseId: 'ex-tricep-ext',
        name: 'Tricep Extension',
        order: 2,
        targetSets: 3,
        targetReps: '12-15',
        restSeconds: 60,
        notes: "Focus on the stretch."
      },
    ],
    createdAt: now - 10 * oneDay,
    updatedAt: now - 5 * oneDay,
    lastUsedAt: now - 2 * oneDay,
    useCount: 5,
  },
  {
    id: 'template-2',
    name: 'Pull Day (Strength)',
    description: 'Heavy pulls and back thickness.',
    exercises: [
        {
            exerciseId: 'ex-deadlift',
            name: 'Deadlift',
            order: 0,
            targetSets: 1,
            targetReps: '5',
            targetWeight: 140,
            restSeconds: 180,
        },
        {
            exerciseId: 'ex-pullup',
            name: 'Weighted Pull-ups',
            order: 1,
            targetSets: 3,
            targetReps: '6-8',
            targetWeight: 10,
            restSeconds: 120,
        },
        {
            exerciseId: 'ex-row',
            name: 'Barbell Row',
            order: 2,
            targetSets: 3,
            targetReps: '8-10',
            targetWeight: 70,
            restSeconds: 90,
        },
    ],
    createdAt: now - 20 * oneDay,
    updatedAt: now - 4 * oneDay,
    lastUsedAt: now - 4 * oneDay,
    useCount: 12,
  },
  {
    id: 'template-3',
    name: 'Leg Day (Volume)',
    description: 'Quads, hamstrings, and glutes.',
    exercises: [],
    createdAt: now - 30 * oneDay,
    updatedAt: now - 30 * oneDay,
    lastUsedAt: null,
    useCount: 0,
  }
];

export const INITIAL_WORKOUT_SESSIONS: IWorkoutSession[] = [
    {
        id: 'session-1',
        name: 'Push Day (Hypertrophy)',
        startTime: now - 2 * oneDay,
        endTime: now - 2 * oneDay + (90 * 60 * 1000), // 90 minutes later
        status: 'completed',
        exercises: [
            {
                id: 'se-1',
                exerciseId: 'ex-bench',
                name: 'Bench Press',
                order: 0,
                sets: [
                    { reps: 8, weight: 80, timestamp: now - 2 * oneDay, isWarmup: false },
                    { reps: 8, weight: 80, timestamp: now - 2 * oneDay, isWarmup: false },
                    { reps: 7, weight: 80, timestamp: now - 2 * oneDay, isWarmup: false },
                ]
            },
            {
                id: 'se-2',
                exerciseId: 'ex-ohp',
                name: 'Overhead Press',
                order: 1,
                sets: [
                    { reps: 10, weight: 50, timestamp: now - 2 * oneDay, isWarmup: false },
                    { reps: 9, weight: 50, timestamp: now - 2 * oneDay, isWarmup: false },
                    { reps: 8, weight: 50, timestamp: now - 2 * oneDay, isWarmup: false },
                    { reps: 8, weight: 50, timestamp: now - 2 * oneDay, isWarmup: false },
                ]
            }
        ],
        aggregatedData: {
            totalVolume: 6190,
            totalSets: 7,
            totalReps: 58,
            durationMinutes: 78,
            maxWeight: 80,
            prsAchieved: []
        },
        processedAt: now - 2 * oneDay + (90 * 60 * 1000),
    },
    {
        id: 'session-2',
        name: 'Pull Day (Strength)',
        startTime: now - 4 * oneDay,
        endTime: now - 4 * oneDay + (60 * 60 * 1000),
        status: 'completed',
        exercises: [
            {
                id: 'se-3',
                exerciseId: 'ex-deadlift',
                name: 'Deadlift',
                order: 0,
                sets: [
                    { reps: 5, weight: 140, timestamp: now - 4 * oneDay, isWarmup: false },
                ]
            }
        ],
        aggregatedData: {
            totalVolume: 700,
            totalSets: 1,
            totalReps: 5,
            durationMinutes: 55,
            maxWeight: 140,
            prsAchieved: [{
                exerciseId: 'ex-deadlift',
                exerciseName: 'Deadlift',
                description: '5-rep max',
                previousValue: 135,
                newValue: 140,
            }]
        },
        processedAt: now - 4 * oneDay + (60 * 60 * 1000),
    }
];
