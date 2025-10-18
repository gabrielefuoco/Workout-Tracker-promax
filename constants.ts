

import type { Workout } from './types';

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: "workout-1",
    name: "Allenamento A (Tirata & Spinta Verticale)",
    exercises: [
      { id: "ex1-1", name: "T-bar Row Machine", setGroups: [
        { id: "sg1-1-1", name: "Top Set", target: "4-6 @ RIR 0-1", performedSets: [{ id: "ps1-1-1-1", reps: 5, weight: 70, rir: 0, completed: false }], restSeconds: 180 },
        { id: "sg1-1-2", name: "Backoff", target: "6-8 @ RIR 0", performedSets: [{ id: "ps1-1-2-1", reps: 5, weight: 65, rir: 0, completed: false }], restSeconds: 120 }
      ]},
      { id: "ex1-2", name: "Kelso Shrugs", setGroups: [
        { id: "sg1-2-1", name: "Top Set", target: "8-10 @ RIR 1", performedSets: [{ id: "ps1-2-1-1", reps: 6, weight: 60, rir: 1, completed: false }], restSeconds: 90 },
        { id: "sg1-2-2", name: "Backoff", target: "10-12 @ RIR 0", performedSets: [{ id: "ps1-2-2-1", reps: 8, weight: 60, rir: 1, completed: false }] }
      ]},
      { id: "ex1-3", name: "DB OHP", setGroups: [
        { id: "sg1-3-1", name: "Top Set", target: "4-6 @ RIR 0-1", performedSets: [{ id: "ps1-3-1-1", reps: 5, weight: 30, rir: 1.5, completed: false }, { id: "ps1-3-1-2", reps: 5, weight: 30, rir: 1.5, completed: false }], restSeconds: 150 },
        { id: "sg1-3-2", name: "Backoff", target: "6-8 @ RIR 0", performedSets: [], restSeconds: 120 }
      ]},
      { id: "ex1-4", name: "Incline Lateral Raises", setGroups: [
        { id: "sg1-4-1", name: "Top Set", target: "4-8 @ RIR 1", performedSets: [{ id: "ps1-4-1-1", reps: 7, weight: 10, rir: 1, completed: false }], restSeconds: 90 }
      ]},
      { id: "ex1-5", name: "DB Y-Raises", setGroups: [
        { id: "sg1-5-1", name: "Top Set", target: "6-8 @ RIR 0", performedSets: [{ id: "ps1-5-1-1", reps: 8, weight: 8, rir: 0, completed: false }], restSeconds: 90 }
      ]},
      { id: "ex1-6", name: "Incline Hammer Curl", setGroups: [
        { id: "sg1-6-1", name: "Top Set", target: "6-8 @ RIR 1", performedSets: [{ id: "ps1-6-1-1", reps: 6, weight: 20, rir: 0, completed: false }], restSeconds: 90 }
      ]},
      { id: "ex1-7", name: "Single Arm Pushdown", setGroups: [
        { id: "sg1-7-1", name: "Top Set", target: "6-8 @ RIR 1", performedSets: [{ id: "ps1-7-1-1", reps: 6, weight: 31, rir: 0, completed: false }], restSeconds: 90 }
      ]},
      { id: "ex1-8", name: "Belt Squat", setGroups: [
        { id: "sg1-8-1", name: "Top Set", target: "4-6 @ RIR 1-2", performedSets: [{ id: "ps1-8-1-1", reps: 5, weight: 70, rir: 0, completed: false }], restSeconds: 180 },
        { id: "sg1-8-2", name: "Backoff", target: "6-8 @ RIR 1-2", performedSets: [{ id: "ps1-8-2-1", reps: 5, weight: 60, rir: 1, completed: false }], restSeconds: 120 }
      ]},
      { id: "ex1-9", name: "Leg Curl", setGroups: [
        { id: "sg1-9-1", name: "Top Set", target: "4-6 @ RIR 1", performedSets: [{ id: "ps1-9-1-1", reps: 5, weight: 75, rir: 1, completed: false }], restSeconds: 120 },
        { id: "sg1-9-2", name: "Backoff", target: "8-10 @ RIR 0", performedSets: [] }
      ]}
    ]
  },
  {
    id: "workout-2",
    name: "Allenamento B (Spinta Orizzontale & Gambe)",
    exercises: [
      { id: "ex2-1", name: "Ez Curl", setGroups: [
        { id: "sg2-1-1", name: "Top Set", target: "4-8 @ RIR 1", performedSets: [{ id: "ps2-1-1-1", reps: 4, weight: 17.5, rir: 1.5, completed: false }, { id: "ps2-1-1-2", reps: 4, weight: 17.5, rir: 1.5, completed: false }], restSeconds: 90 },
        { id: "sg2-1-2", name: "Backoff", target: "4-8 @ RIR 0", performedSets: [] }
      ]},
      { id: "ex2-2", name: "Single Arm Pushdown", setGroups: [
        { id: "sg2-2-1", name: "Top Set", target: "4-8 @ RIR 1", performedSets: [{ id: "ps2-2-1-1", reps: 4, weight: 33, rir: 0, completed: false }], restSeconds: 90 },
        { id: "sg2-2-2", name: "Backoff", target: "6-8 @ RIR 0", performedSets: [{ id: "ps2-2-2-1", reps: 6, weight: 30, rir: 0, completed: false }] }
      ]},
      { id: "ex2-3", name: "Machine Lateral Raises", setGroups: [
        { id: "sg2-3-1", name: "Top Set", target: "6-8 @ RIR 0", performedSets: [{ id: "ps2-3-1-1", reps: 4, weight: 25, rir: null, completed: false }], restSeconds: 90 },
        { id: "sg2-3-2", name: "Backoff", target: "6-8 @ RIR 0", performedSets: [{ id: "ps2-3-2-1", reps: 6, weight: 20, rir: 0, completed: false }] }
      ]},
      { id: "ex2-4", name: "Lat Pulldown", setGroups: [
        { id: "sg2-4-1", name: "Top Set", target: "4-8 reps @ RIR 1", performedSets: [{ id: "ps2-4-1-1", reps: 5, weight: 70, rir: 1, completed: false }], restSeconds: 150 },
        { id: "sg2-4-2", name: "Backoff", target: "6-8 reps @ RIR 0", performedSets: [{ id: "ps2-4-2-1", reps: 6, weight: 65, rir: 1, completed: false }], restSeconds: 120 }
      ]},
      { id: "ex2-5", name: "Chest Press", setGroups: [
        { id: "sg2-5-1", name: "Top Set", target: "4-6 @ RIR 1-2", performedSets: [{ id: "ps2-5-1-1", reps: 6, weight: 52.5, rir: 0.5, completed: false }], restSeconds: 180 },
        { id: "sg2-5-2", name: "Backoff", target: "6-8 @ RIR 0-1", performedSets: [{ id: "ps2-5-2-1", reps: 5, weight: 50, rir: 1, completed: false }], restSeconds: 120 }
      ]},
      { id: "ex2-6", name: "RDL", setGroups: [
        { id: "sg2-6-1", name: "Top Set", target: "4-6 reps @ RIR 1-2", performedSets: [{ id: "ps2-6-1-1", reps: 5, weight: 140, rir: 1, completed: false }], restSeconds: 180 }
      ]},
      { id: "ex2-7", name: "Shrugs", setGroups: [
        { id: "sg2-7-1", name: "Top Set", target: "10-12 @ RIR 1", performedSets: [{ id: "ps2-7-1-1", reps: 6, weight: 140, rir: 1.5, completed: false }], restSeconds: 90 }
      ]},
      { id: "ex2-8", name: "Hip Thrust", setGroups: [
        { id: "sg2-8-1", name: "Top Set", target: "4-6 @ RIR 0-1", performedSets: [{ id: "ps2-8-1-1", reps: 4, weight: 85, rir: 0, completed: false }], restSeconds: 150 },
        { id: "sg2-8-2", name: "Backoff", target: "6-8 @ RIR 0", performedSets: [{ id: "ps2-8-2-1", reps: 6, weight: 75, rir: 0, completed: false }], restSeconds: 120 }
      ]},
      { id: "ex2-9", name: "Leg Extension", setGroups: [
        { id: "sg2-9-1", name: "Top Set", target: "6-8 @ RIR 1", performedSets: [{ id: "ps2-9-1-1", reps: 6, weight: 45, rir: 1.5, completed: false }, { id: "ps2-9-1-2", reps: 6, weight: 45, rir: 1.5, completed: false }], restSeconds: 90 },
        { id: "sg2-9-2", name: "Backoff", target: "6-8 @ RIR 0", performedSets: [] }
      ]}
    ]
  }
];