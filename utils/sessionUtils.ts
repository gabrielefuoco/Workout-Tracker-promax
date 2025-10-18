import { IWorkoutSession, ISessionExercise, IAggregatedData, IWorkoutSet } from '../types';

// This function simulates the 'calculateAggregates' Cloud Function
export const calculateAggregatedData = (exercises: ISessionExercise[], startTime: number, endTime: number): IAggregatedData => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    let maxWeight = 0;

    exercises.forEach(ex => {
        ex.sets.forEach(set => {
            if (!set.isWarmup) { // As per protocol, exclude warmups from volume
                totalVolume += set.reps * set.weight;
                totalSets++;
                totalReps += set.reps;
            }
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
        prsAchieved: [] // PR logic to be implemented later
    };
};
