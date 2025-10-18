import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Workout, Exercise } from '../types';
import { useWorkouts } from '../contexts/WorkoutContext';
import { ArrowLeftIcon, ChevronDownIcon, ChevronRightIcon, PencilIcon } from './icons';

// A simple, read-only exercise card for the view-only page
const ViewOnlyExerciseCard: React.FC<{
    exercise: Exercise;
    isExpanded: boolean;
    onToggleExpand: () => void;
    isUltraCompact: boolean;
}> = ({ exercise, isExpanded, onToggleExpand, isUltraCompact }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
    >
        {isUltraCompact ? (
            <>
                <div className="p-3">
                    <h3 className="text-md font-semibold text-foreground">{exercise.name}</h3>
                </div>
                <div className="border-t border-border px-3 pt-2 pb-2">
                    <ul className="space-y-1 text-sm max-h-48 overflow-y-auto pr-2 -mr-2">
                        {exercise.setGroups.length > 0 ? (
                            exercise.setGroups.map(sg => (
                                <li key={sg.id} className="flex justify-between items-center gap-2">
                                    <div className="truncate">
                                        <span className="font-semibold text-foreground mr-2">{sg.name}:</span>
                                        <span className="text-muted-foreground">{sg.target}</span>
                                    </div>
                                    {sg.restSeconds != null && (
                                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                                            {sg.restSeconds}s Rest
                                        </span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="text-xs text-muted-foreground italic">Nessun set.</li>
                        )}
                    </ul>
                </div>
            </>
        ) : (
            <>
                <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={onToggleExpand}
                >
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">{exercise.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {exercise.setGroups.map(sg => (
                                <span key={sg.id} className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground whitespace-nowrap">
                                    {sg.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDownIcon className="h-6 w-6 text-muted-foreground" />
                    </motion.div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="border-t border-border">
                                <div className="divide-y divide-border px-4">
                                    {exercise.setGroups.length > 0 ? (
                                        exercise.setGroups.map(sg => (
                                            <div key={sg.id} className="flex justify-between items-center py-4">
                                                <div>
                                                    <p className="font-semibold text-foreground">{sg.name}</p>
                                                    <p className="text-sm text-muted-foreground">{sg.target}</p>
                                                </div>
                                                {sg.restSeconds != null && (
                                                    <div className="text-right">
                                                        <p className="text-xs text-muted-foreground">Rest</p>
                                                        <p className="text-xl font-bold">{sg.restSeconds}s</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">No sets defined for this exercise.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        )}
    </motion.div>
);

interface WorkoutOverviewProps {
  workoutId: string;
  onStartWorkout: (workoutId: string) => void;
  onBack: () => void;
  onEdit: (workoutId: string) => void;
}

const WorkoutOverview: React.FC<WorkoutOverviewProps> = ({ workoutId, onStartWorkout, onBack, onEdit }) => {
    const { getWorkoutById } = useWorkouts();
    const workout = getWorkoutById(workoutId);
    const [expandedExerciseIds, setExpandedExerciseIds] = useState<string[]>([]);
    const [isUltraCompactMode, setIsUltraCompactMode] = useState(false);

    if (!workout) {
        return (
          <div className="bg-background text-foreground min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">Workout not found.</h2>
            <button onClick={onBack} className="mt-4 px-6 py-2 bg-muted rounded-lg">Go Back</button>
          </div>
        );
    }
    
    const useLongPress = (callback: () => void, ms = 400) => {
        const timeout = useRef<ReturnType<typeof setTimeout>>();
        const start = () => {
            timeout.current = setTimeout(callback, ms);
        };
        const clear = () => {
            timeout.current && clearTimeout(timeout.current);
        };
        return {
            onMouseDown: start,
            onMouseUp: clear,
            onMouseLeave: clear,
            onTouchStart: start,
            onTouchEnd: clear,
            onContextMenu: (e: React.MouseEvent) => e.preventDefault()
        };
    };

    const handleToggleExpand = (exerciseId: string) => {
        setExpandedExerciseIds(prevIds =>
            prevIds.includes(exerciseId)
                ? prevIds.filter(id => id !== exerciseId)
                : [...prevIds, exerciseId]
        );
    };
    
    const allExpanded = workout.exercises.length > 0 && expandedExerciseIds.length === workout.exercises.length;

    const handleToggleUltraCompact = () => {
        const newCompactState = !isUltraCompactMode;
        setIsUltraCompactMode(newCompactState);
        if (newCompactState) {
            setExpandedExerciseIds(workout.exercises.map(ex => ex.id));
        } else {
            setExpandedExerciseIds([]);
        }
    };

    const handleToggleAll = () => {
        if (isUltraCompactMode) {
            setIsUltraCompactMode(false);
            setExpandedExerciseIds([]);
            return;
        }

        if (allExpanded) {
            setExpandedExerciseIds([]);
        } else {
            setExpandedExerciseIds(workout.exercises.map(ex => ex.id));
        }
    };

    const toggleAllLongPress = useLongPress(handleToggleUltraCompact);

    const parseWorkoutName = (name: string) => {
      const match = name.match(/^(.*?)\s*\((.*?)\)\s*$/);
      if (match) {
          return { mainName: match[1].trim(), subName: match[2].trim() };
      }
      return { mainName: name.trim(), subName: '' };
    };

    const { mainName, subName } = parseWorkoutName(workout.name);

    return (
        <div className="bg-background text-foreground h-screen flex flex-col">
            <div className="flex-grow overflow-y-auto p-4 md:p-6">
                <header className="flex items-center mb-10 gap-4 max-w-3xl mx-auto">
                    <button onClick={onBack} className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                        <ArrowLeftIcon className="h-7 w-7" />
                    </button>
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold">{mainName}</h1>
                        {subName && <h2 className="text-xl font-semibold text-muted-foreground">{subName}</h2>}
                    </div>
                     <div className="flex items-center gap-2">
                        <button
                            {...toggleAllLongPress}
                            onClick={handleToggleAll}
                            className={`text-2xl p-2 rounded-full transition-all duration-300 ${isUltraCompactMode ? 'text-primary bg-primary/10 rotate-90' : 'text-muted-foreground hover:text-primary hover:bg-card'}`}
                            title={allExpanded ? 'Comprimi tutto' : 'Espandi tutto'}
                            aria-label={allExpanded ? 'Comprimi tutto' : 'Espandi tutto'}
                        >
                            <AnimatePresence mode="wait">
                                <motion.i
                                    key={isUltraCompactMode ? 'compact' : (allExpanded ? 'compress' : 'expand')}
                                    className={isUltraCompactMode ? "ph ph-rows" : (allExpanded ? "ph ph-arrows-in-simple" : "ph ph-arrows-out-simple")}
                                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </AnimatePresence>
                        </button>
                        <button onClick={() => onEdit(workout.id)} className="p-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                            <PencilIcon className="h-6 w-6" />
                        </button>
                    </div>
                </header>

                <div className="space-y-4 mb-8 max-w-3xl mx-auto">
                    <AnimatePresence>
                        {workout.exercises.map(exercise => (
                            <ViewOnlyExerciseCard
                                key={exercise.id}
                                exercise={exercise}
                                isExpanded={expandedExerciseIds.includes(exercise.id)}
                                onToggleExpand={() => handleToggleExpand(exercise.id)}
                                isUltraCompact={isUltraCompactMode}
                            />
                        ))}
                    </AnimatePresence>
                    {workout.exercises.length === 0 && (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-xl bg-card/50">
                            <h3 className="text-lg font-semibold text-foreground">This workout is empty.</h3>
                            <p className="text-muted-foreground mt-2 mb-6">Click the edit button to add exercises.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 p-4 bg-background border-t border-border">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => onStartWorkout(workout.id)}
                        className="w-full px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={workout.exercises.length === 0}
                    >
                        Start Workout
                        <ChevronRightIcon className="h-6 w-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutOverview;
