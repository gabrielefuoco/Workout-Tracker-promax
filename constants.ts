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
        id: 'ex-bench',
        name: 'Bench Press',
        setGroups: [
          {
            id: 'sg-bench-1',
            name: 'Working Sets',
            target: '3x8',
            restSeconds: 90,
            performedSets: [
              { id: 'ps-bench-1', reps: 8, weight: 80, completed: false, rir: 2 },
              { id: 'ps-bench-2', reps: 8, weight: 80, completed: false, rir: 2 },
              { id: 'ps-bench-3', reps: 8, weight: 80, completed: false, rir: 1 },
            ],
          },
        ],
      },
      {
        id: 'ex-ohp',
        name: 'Overhead Press',
        setGroups: [
          {
            id: 'sg-ohp-1',
            name: 'Working Sets',
            target: '4x10',
            restSeconds: 75,
            performedSets: [
              { id: 'ps-ohp-1', reps: 10, weight: 50, completed: false, rir: 2 },
              { id: 'ps-ohp-2', reps: 10, weight: 50, completed: false, rir: 2 },
              { id: 'ps-ohp-3', reps: 10, weight: 50, completed: false, rir: 1 },
              { id: 'ps-ohp-4', reps: 10, weight: 50, completed: false, rir: 1 },
            ],
          },
        ],
      },
      {
        id: 'ex-tricep-ext',
        name: 'Tricep Extension',
        setGroups: [
          {
            id: 'sg-tricep-1',
            name: 'Working Sets',
            target: '3x12',
            restSeconds: 60,
            performedSets: [
              { id: 'ps-tricep-1', reps: 12, weight: 20, completed: false, rir: 1 },
              { id: 'ps-tricep-2', reps: 12, weight: 20, completed: false, rir: 1 },
              { id: 'ps-tricep-3', reps: 12, weight: 20, completed: false, rir: 0 },
            ],
          },
        ],
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
            id: 'ex-deadlift',
            name: 'Deadlift',
            setGroups: [
                {
                    id: 'sg-deadlift-1', name: 'Top Set', target: '1x5', restSeconds: 180,
                    performedSets: [
                        { id: 'ps-deadlift-1', reps: 5, weight: 140, completed: false, rir: 1 }
                    ]
                }
            ]
        },
        {
            id: 'ex-pullup',
            name: 'Weighted Pull-ups',
            setGroups: [
                {
                    id: 'sg-pullup-1', name: 'Working Sets', target: '3x6', restSeconds: 120,
                    performedSets: [
                        { id: 'ps-pullup-1', reps: 6, weight: 10, completed: false, rir: 2 },
                        { id: 'ps-pullup-2', reps: 6, weight: 10, completed: false, rir: 2 },
                        { id: 'ps-pullup-3', reps: 6, weight: 10, completed: false, rir: 1 },
                    ]
                }
            ]
        },
        {
            id: 'ex-row',
            name: 'Barbell Row',
            setGroups: [
                 {
                    id: 'sg-row-1', name: 'Working Sets', target: '3x8', restSeconds: 90,
                    performedSets: [
                        { id: 'ps-row-1', reps: 8, weight: 70, completed: false, rir: 2 },
                        { id: 'ps-row-2', reps: 8, weight: 70, completed: false, rir: 2 },
                        { id: 'ps-row-3', reps: 8, weight: 70, completed: false, rir: 1 },
                    ]
                }
            ]
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
