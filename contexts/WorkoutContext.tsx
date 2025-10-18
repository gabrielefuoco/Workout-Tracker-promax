import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { INITIAL_WORKOUTS } from '../constants';
import type { Workout, PerformedSet } from '../types';

interface WorkoutContextType {
  workouts: Workout[];
  getWorkoutById: (id: string) => Workout | undefined;
  addWorkout: () => Workout;
  updateWorkout: (updatedWorkout: Workout) => void;
  deleteWorkout: (workoutId: string) => void;
  updateWorkoutSet: (
    workoutId: string, 
    exerciseId: string, 
    setGroupId: string, 
    setId: string, 
    updates: Partial<PerformedSet>
  ) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', INITIAL_WORKOUTS);

  const getWorkoutById = (id: string) => {
    return workouts.find(w => w.id === id);
  };
  
  const addWorkout = (): Workout => {
    const newWorkout: Workout = {
      id: `workout-${Date.now()}`,
      name: 'New Workout',
      exercises: []
    };
    setWorkouts([...workouts, newWorkout]);
    return newWorkout;
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
  };
  
  const deleteWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter(w => w.id !== workoutId));
  }

  const updateWorkoutSet = (
    workoutId: string, 
    exerciseId: string, 
    setGroupId: string, 
    setId: string, 
    updates: Partial<PerformedSet>
  ) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => {
        if (workout.id !== workoutId) return workout;
        
        return {
          ...workout,
          exercises: workout.exercises.map(exercise => {
            if (exercise.id !== exerciseId) return exercise;

            return {
              ...exercise,
              setGroups: exercise.setGroups.map(setGroup => {
                if (setGroup.id !== setGroupId) return setGroup;
                
                return {
                  ...setGroup,
                  performedSets: setGroup.performedSets.map(pSet => {
                    if (pSet.id !== setId) return pSet;
                    
                    return { ...pSet, ...updates };
                  })
                }
              })
            }
          })
        }
      })
    );
  };


  const value = {
    workouts,
    getWorkoutById,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    updateWorkoutSet,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};
