import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Workout, PerformedSet } from '../types';
import Timer from './Timer';
import { CheckIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { useWorkouts } from '../contexts/WorkoutContext';

interface FocusModeProps {
  workoutId: string;
  onFinishWorkout: () => void;
  onExit: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ workoutId, onFinishWorkout, onExit }) => {
  const { getWorkoutById, updateWorkoutSet } = useWorkouts();
  const workout = getWorkoutById(workoutId)!;

  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);
  const [restDuration, setRestDuration] = useState(90);

  // Flatten sets for easier navigation, memoized for performance
  const allSets = useMemo(() => workout.exercises.flatMap((ex, exIndex) => 
      ex.setGroups.flatMap(sg => 
          sg.performedSets.map(ps => ({ 
            ...ps, 
            exerciseId: ex.id, 
            setGroupId: sg.id, 
            exerciseName: ex.name, 
            setGroupName: sg.name, 
            target: sg.target, 
            exerciseIndex: exIndex,
            restSeconds: sg.restSeconds
          }))
      )
  ), [workout]);
  
  const currentSetInfo = allSets[currentSetIndex];
  const currentExerciseIndex = currentSetInfo?.exerciseIndex ?? 0;

  useEffect(() => {
    // Find first uncompleted set and start from there
    const firstUncompletedIndex = allSets.findIndex(set => !set.completed);
    if (firstUncompletedIndex !== -1) {
        setCurrentSetIndex(firstUncompletedIndex);
    } else if (allSets.length > 0 && allSets.every(s => s.completed)) {
        setIsWorkoutFinished(true);
    }
  }, [allSets]);

  const handleSetCompletion = (completed: boolean) => {
    if (!currentSetInfo) return;
    updateWorkoutSet(workout.id, currentSetInfo.exerciseId, currentSetInfo.setGroupId, currentSetInfo.id, { completed });

    if (completed) {
        setRestDuration(currentSetInfo.restSeconds || 90);
        if (currentSetIndex < allSets.length - 1) {
            setIsResting(true);
        } else {
            setIsWorkoutFinished(true);
        }
    }
  };
  
  const handleNext = () => {
    setIsResting(false);
    if (currentSetIndex < allSets.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
    } else {
        setIsWorkoutFinished(true);
    }
  }
  
  const handlePrevious = () => {
    if (currentSetIndex > 0) {
        setCurrentSetIndex(currentSetIndex - 1);
    }
  }
  
  const handleValueChange = (field: 'reps' | 'weight' | 'rir', value: number | null) => {
      if (!currentSetInfo) return;

      if (value === null) {
          if (field !== 'rir') return;
      } else if (isNaN(value)) {
          return;
      }
      
      updateWorkoutSet(workout.id, currentSetInfo.exerciseId, currentSetInfo.setGroupId, currentSetInfo.id, { [field]: value });
  }

  const handleFinish = () => {
      // Reset completion status for the next session
      const finalWorkout = JSON.parse(JSON.stringify(workout)) as Workout;
      finalWorkout.exercises.forEach((ex) => {
          ex.setGroups.forEach((sg) => {
              sg.performedSets.forEach((ps) => {
                  updateWorkoutSet(finalWorkout.id, ex.id, sg.id, ps.id, { completed: false });
              });
          });
      });
      onFinishWorkout();
  }

  if (isWorkoutFinished) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-foreground p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold mb-4">Workout Complete!</h2>
          <p className="text-xl text-muted-foreground mb-8">Great job!</p>
          <button onClick={handleFinish} className="px-8 py-4 bg-gradient-to-br from-primary to-primary-focus text-primary-foreground font-bold rounded-xl shadow-lg hover:brightness-110 transition-transform transform hover:scale-105">
            Finish & View Summary
          </button>
        </motion.div>
      </div>
    );
  }
  
  if (allSets.length === 0) {
      return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-foreground p-4">
            <h2 className="text-3xl font-bold">No sets in this workout.</h2>
            <button onClick={onExit} className="mt-4 px-6 py-2 bg-muted rounded-lg">Go Back</button>
        </div>
      );
  }

  const progress = ((allSets.filter(s => s.completed).length) / allSets.length) * 100;

  return (
    <div className="fixed inset-0 bg-background flex flex-col text-foreground p-4 overflow-y-auto">
      <AnimatePresence>
        {isResting && <Timer initialSeconds={restDuration} onFinish={handleNext} onSkip={handleNext} />}
      </AnimatePresence>
      
      <header className="flex justify-between items-center mb-4">
        <div className="text-sm">
            Exercise <span className="font-bold">{currentExerciseIndex + 1}</span> / {workout.exercises.length}
        </div>
        <button onClick={onExit} className="p-2 rounded-full hover:bg-muted">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="w-full bg-muted rounded-full h-2.5 mb-8">
        <motion.div 
            className="bg-primary h-2.5 rounded-full" 
            initial={{width: 0}}
            animate={{width: `${progress}%`}}
            transition={{duration: 0.5, ease: 'easeOut'}}
        ></motion.div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <motion.div
            key={currentSetInfo.exerciseId}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <p className="text-muted-foreground text-lg">{currentSetInfo.setGroupName} - {currentSetInfo.target}</p>
            <h2 className="text-4xl md:text-5xl font-bold my-2 truncate px-4">{currentSetInfo.exerciseName}</h2>
        </motion.div>

        <div className="my-10 flex items-center justify-around w-full max-w-lg">
            <div className="text-center">
                <label htmlFor="reps-input" className="block text-muted-foreground text-sm mb-1">Reps</label>
                <input 
                  id="reps-input"
                  type="number" 
                  value={currentSetInfo.reps} 
                  onChange={e => handleValueChange('reps', parseInt(e.target.value, 10))} 
                  className="bg-muted/30 rounded-lg px-2 py-1 text-5xl font-bold w-28 text-center outline-none focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div className="text-center">
                <label htmlFor="weight-input" className="block text-muted-foreground text-sm mb-1">Weight (kg)</label>
                <input 
                  id="weight-input"
                  type="number" 
                  step="0.25" 
                  value={currentSetInfo.weight} 
                  onChange={e => handleValueChange('weight', parseFloat(e.target.value))} 
                  className="bg-muted/30 rounded-lg px-2 py-1 text-5xl font-bold w-36 text-center outline-none focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div className="text-center">
                <label htmlFor="rir-input" className="block text-muted-foreground text-sm mb-1">RIR</label>
                <input 
                    id="rir-input"
                    type="number" 
                    step="0.5" 
                    placeholder="-"
                    value={currentSetInfo.rir ?? ''} 
                    onChange={e => {
                        const val = e.target.value;
                        handleValueChange('rir', val === '' ? null : parseFloat(val))
                    }}
                    className="bg-muted/30 rounded-lg px-2 py-1 text-5xl font-bold w-28 text-center outline-none focus:ring-2 focus:ring-primary transition-all placeholder-muted-foreground/50"
                />
            </div>
        </div>
        
        <AnimatePresence mode="wait">
        {currentSetInfo.completed ? (
            <motion.button 
                key="undo"
                onClick={() => handleSetCompletion(false)}
                className="w-48 h-48 rounded-full border-4 border-border flex items-center justify-center text-muted-foreground text-2xl font-bold transition-colors"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
            >
                Undo
            </motion.button>
        ) : (
            <motion.button 
                key="complete"
                onClick={() => handleSetCompletion(true)}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
            >
                <CheckIcon className="h-24 w-24 text-primary-foreground" />
            </motion.button>
        )}
        </AnimatePresence>
      </main>

      <footer className="flex justify-between items-center mt-8">
        <button onClick={handlePrevious} disabled={currentSetIndex === 0} className="p-4 rounded-full bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <div className="text-lg font-mono">
            Set <span className="font-bold">{currentSetIndex + 1}</span> / {allSets.length}
        </div>
        <button onClick={handleNext} disabled={isResting || (currentSetInfo.completed && currentSetIndex >= allSets.length - 1)} className="p-4 rounded-full bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRightIcon className="h-8 w-8" />
        </button>
      </footer>
    </div>
  );
};

export default FocusMode;