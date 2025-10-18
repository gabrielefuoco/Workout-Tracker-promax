

export interface PerformedSet {
  id: string;
  reps: number;
  weight: number;
  rir?: number | null;
  completed: boolean;
}

export interface SetGroup {
  id: string;
  name: string;
  target: string;
  performedSets: PerformedSet[];
  restSeconds?: number;
}

export interface Exercise {
  id: string;
  name: string;
  setGroups: SetGroup[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}