import type { IWorkoutSession, IWorkoutSet, ISessionExercise, IAggregatedData, WorkoutTemplate, Exercise, PerformedSet, SetGroup } from './types';
// FIX: Changed date-fns import to use named import from the main package to fix call signature errors.
import { subDays } from 'date-fns';

const now = new Date();

const generateSets = (performedSets: { reps: number; weight: number; rir?: number | null; }[]): IWorkoutSet[] => {
    return performedSets.map(ps => ({
        reps: ps.reps,
        weight: ps.weight,
        rpe: ps.rir !== null && ps.rir !== undefined ? 10 - ps.rir : undefined,
        timestamp: Date.now(),
        isWarmup: false,
    }));
};

const calculateAggregatedData = (exercises: ISessionExercise[], startTime: number, endTime: number): IAggregatedData => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    let maxWeight = 0;
    
    exercises.forEach(ex => {
        ex.sets.forEach(set => {
            totalVolume += set.reps * set.weight;
            totalSets++;
            totalReps += set.reps;
            if (set.weight > maxWeight) {
                maxWeight = set.weight;
            }
        });
    });

    return {
        totalVolume: Math.round(totalVolume),
        totalSets,
        totalReps,
        durationMinutes: Math.round((endTime - startTime) / (1000 * 60)),
        maxWeight,
        prsAchieved: [] // For simplicity, no PRs in initial data
    };
};

const session1Exercises: ISessionExercise[] = [
      { id: "ex1-1", exerciseId: "t-bar-row", name: "T-bar Row Machine", order: 0, sets: generateSets([{ reps: 5, weight: 70 }, { reps: 5, weight: 65 }]) },
      { id: "ex1-2", exerciseId: "kelso-shrugs", name: "Kelso Shrugs", order: 1, sets: generateSets([{ reps: 6, weight: 60 }, { reps: 8, weight: 60 }]) },
      { id: "ex1-3", exerciseId: "db-ohp", name: "DB OHP", order: 2, sets: generateSets([{ reps: 5, weight: 30 }, { reps: 5, weight: 30 }]) },
];
const session1StartTime = subDays(now, 4).getTime();
const session1EndTime = session1StartTime + (90 * 60 * 1000); // 90 minutes later

const session2Exercises: ISessionExercise[] = [
      { id: "ex2-1", exerciseId: "ez-curl", name: "Ez Curl", order: 0, sets: generateSets([{ reps: 4, weight: 17.5 }, { reps: 4, weight: 17.5 }]) },
      { id: "ex2-5", exerciseId: "chest-press", name: "Chest Press", order: 1, sets: generateSets([{ reps: 6, weight: 52.5 }, { reps: 5, weight: 50 }]) },
      { id: "ex2-6", exerciseId: "rdl", name: "RDL", order: 2, sets: generateSets([{ reps: 5, weight: 140 }]) },
];
const session2StartTime = subDays(now, 2).getTime();
const session2EndTime = session2StartTime + (75 * 60 * 1000); // 75 minutes later

export const INITIAL_SESSIONS: IWorkoutSession[] = [
  {
    id: "session-1",
    name: "Allenamento A (Tirata & Spinta Verticale)",
    startTime: session1StartTime,
    endTime: session1EndTime,
    status: 'completed',
    exercises: session1Exercises,
    aggregatedData: calculateAggregatedData(session1Exercises, session1StartTime, session1EndTime),
    processedAt: session1EndTime,
  },
  {
    id: "session-2",
    name: "Allenamento B (Spinta Orizzontale & Gambe)",
    startTime: session2StartTime,
    endTime: session2EndTime,
    status: 'completed',
    exercises: session2Exercises,
    aggregatedData: calculateAggregatedData(session2Exercises, session2StartTime, session2EndTime),
    processedAt: session2EndTime,
  }
];

const createPerformedSets = (targets: { reps: number, weight: number, rir?: number | null }[]): PerformedSet[] => {
    return targets.map((t, i) => ({
        id: `ps-${Date.now()}-${i}`,
        reps: t.reps,
        weight: t.weight,
        rir: t.rir,
        completed: false,
    }));
};

const workout1Exercises: Exercise[] = [
    {
        id: 'ex-1', name: 'T-bar Row Machine', setGroups: [
            { id: 'sg-1-1', name: 'Top Set', target: '4-6 @ RIR 0-1', performedSets: createPerformedSets([{ reps: 5, weight: 70, rir: 0 }]), restSeconds: 120 },
            { id: 'sg-1-2', name: 'Backoff', target: '6-8 @ RIR 0', performedSets: createPerformedSets([{ reps: 5, weight: 65, rir: 0 }]), restSeconds: 90 },
        ],
    },
    {
        id: 'ex-2', name: 'Kelso Shrugs', setGroups: [
            { id: 'sg-2-1', name: 'Top Set', target: '8-10 @ RIR 1', performedSets: createPerformedSets([{ reps: 6, weight: 60, rir: 1 }]), restSeconds: 90 },
            { id: 'sg-2-2', name: 'Backoff', target: '10-12 @ RIR 0', performedSets: createPerformedSets([{ reps: 8, weight: 60, rir: 1 }]), restSeconds: 75 },
        ],
    },
    {
        id: 'ex-3', name: 'DB OHP', setGroups: [
            { id: 'sg-3-1', name: 'Top Set', target: '4-6 @ RIR 0-1', performedSets: createPerformedSets([{ reps: 5, weight: 30, rir: 1.5 }, { reps: 5, weight: 30, rir: 1.5 }]), restSeconds: 120 },
            { id: 'sg-3-2', name: 'Backoff', target: '6-8 @ RIR 0', performedSets: createPerformedSets([]), restSeconds: 90 },
        ],
    },
    {
        id: 'ex-4', name: 'Incline Lateral Raises', setGroups: [
            { id: 'sg-4-1', name: 'Top Set', target: '4-8 @ RIR 1', performedSets: createPerformedSets([{ reps: 7, weight: 10, rir: 1 }]), restSeconds: 60 },
        ],
    },
    {
        id: 'ex-5', name: 'DB Y-Raises', setGroups: [
            { id: 'sg-5-1', name: 'Top Set', target: '6-8@ RIR 0', performedSets: createPerformedSets([{ reps: 8, weight: 8, rir: 0 }]), restSeconds: 60 },
        ],
    },
    {
        id: 'ex-6', name: 'Incline Hammer Curl', setGroups: [
            { id: 'sg-6-1', name: 'Top Set', target: '6-8 @ RIR 1', performedSets: createPerformedSets([{ reps: 6, weight: 20, rir: 0 }]), restSeconds: 75 },
        ],
    },
    {
        id: 'ex-7', name: 'Single Arm Pushdown', setGroups: [
            { id: 'sg-7-1', name: 'Top Set', target: '6-8 @ RIR 1', performedSets: createPerformedSets([{ reps: 6, weight: 31, rir: 0 }]), restSeconds: 75 },
        ],
    },
    {
        id: 'ex-8', name: 'Belt Squat', setGroups: [
            { id: 'sg-8-1', name: 'Top Set', target: '4-6 @ RIR 1-2', performedSets: createPerformedSets([{ reps: 5, weight: 70, rir: 0 }]), restSeconds: 180 },
            { id: 'sg-8-2', name: 'Backoff', target: '6-8 @ RIR 1-2', performedSets: createPerformedSets([{ reps: 5, weight: 60, rir: 1 }]), restSeconds: 120 },
        ],
    },
    {
        id: 'ex-9', name: 'Leg Curl', setGroups: [
            { id: 'sg-9-1', name: 'Top Set', target: '4-6 @ RIR 1', performedSets: createPerformedSets([{ reps: 5, weight: 75, rir: 1 }]), restSeconds: 120 },
            { id: 'sg-9-2', name: 'Backoff', target: '8-10 @ RIR 0', performedSets: createPerformedSets([]), restSeconds: 90 },
        ],
    },
];

const workout2Exercises: Exercise[] = [
     {
        id: 'ex-10', name: 'Ez Curl', setGroups: [
            { id: 'sg-10-1', name: 'Top Set', target: '4-8 @ RIR 1', performedSets: createPerformedSets([{ reps: 4, weight: 17.5, rir: 1.5 }, { reps: 4, weight: 17.5, rir: 1.5 }]), restSeconds: 75 },
            { id: 'sg-10-2', name: 'Backoff', target: '4-8 @ RIR 0', performedSets: createPerformedSets([]), restSeconds: 60 },
        ],
    },
    {
        id: 'ex-11', name: 'Single Arm Pushdown', setGroups: [
            { id: 'sg-11-1', name: 'Top Set', target: '4-8 @ RIR 1', performedSets: createPerformedSets([{ reps: 4, weight: 33, rir: 0 }]), restSeconds: 75 },
            { id: 'sg-11-2', name: 'Backoff', target: '6-8 @ RIR 0', performedSets: createPerformedSets([{ reps: 6, weight: 30, rir: 0 }]), restSeconds: 60 },
        ],
    },
    {
        id: 'ex-12', name: 'Machine Lateral Raises', setGroups: [
            { id: 'sg-12-1', name: 'Top Set', target: '6-8 @ RIR 0', performedSets: createPerformedSets([{ reps: 4, weight: 25, rir: undefined }]), restSeconds: 60 },
            { id: 'sg-12-2', name: 'Backoff', target: '6-8 @ RIR 0', performedSets: createPerformedSets([{ reps: 6, weight: 20, rir: 0 }]), restSeconds: 60 },
        ],
    },
    {
        id: 'ex-13', name: 'Lat Pulldown', setGroups: [
            { id: 'sg-13-1', name: 'Top Set', target: '4-8 reps @ RIR 1', performedSets: createPerformedSets([{ reps: 5, weight: 70, rir: 1 }]), restSeconds: 120 },
            { id: 'sg-13-2', name: 'Backoff', target: '6-8 reps @ RIR 0', performedSets: createPerformedSets([{ reps: 6, weight: 65, rir: 1 }]), restSeconds: 90 },
        ],
    },
    {
        id: 'ex-14', name: 'Chest Press', setGroups: [
            { id: 'sg-14-1', name: 'Top Set', target: '4-6 @ RIR 1-2', performedSets: createPerformedSets([{ reps: 6, weight: 52.5, rir: 0.5 }]), restSeconds: 120 },
            { id: 'sg-14-2', name: 'Backoff', target: '6-8 @ RIR 0-1', performedSets: createPerformedSets([{ reps: 5, weight: 50, rir: 1 }]), restSeconds: 90 },
        ],
    },
    {
        id: 'ex-15', name: 'RDL', setGroups: [
            { id: 'sg-15-1', name: 'Top Set', target: '4-6 reps @ RIR 1-2', performedSets: createPerformedSets([{ reps: 5, weight: 140, rir: 1 }]), restSeconds: 180 },
        ],
    },
    {
        id: 'ex-16', name: 'Shrugs', setGroups: [
            { id: 'sg-16-1', name: 'Top Set', target: '10-12 @ RIR 1', performedSets: createPerformedSets([{ reps: 6, weight: 140, rir: 1.5 }]), restSeconds: 75 },
        ],
    },
    {
        id: 'ex-17', name: 'Hip Thrust', setGroups: [
            { id: 'sg-17-1', name: 'Top Set', target: '4-6 @ RIR 0-1', performedSets: createPerformedSets([{ reps: 4, weight: 85, rir: 0 }]), restSeconds: 120 },
            { id: 'sg-17-2', name: 'Backoff', target: '6-8 @ RIR 0', performedSets: createPerformedSets([{ reps: 6, weight: 75, rir: 0 }]), restSeconds: 90 },
        ],
    },
    {
        id: 'ex-18', name: 'Leg Extension', setGroups: [
            { id: 'sg-18-1', name: 'Top Set', target: '6-8 @ RIR 1', performedSets: createPerformedSets([{ reps: 6, weight: 45, rir: 1.5 }, { reps: 6, weight: 45, rir: 1.5 }]), restSeconds: 90 },
            { id: 'sg-18-2', name: 'Backoff', target: '6-8 @ RIR 0', performedSets: createPerformedSets([]), restSeconds: 75 },
        ],
    },
];

export const INITIAL_TEMPLATES: WorkoutTemplate[] = [
    {
        id: 'workout-1',
        name: 'Allenamento A (Tirata & Spinta Verticale)',
        exercises: workout1Exercises,
    },
    {
        id: 'workout-2',
        name: 'Allenamento B (Spinta Orizzontale & Gambe)',
        exercises: workout2Exercises,
    }
];