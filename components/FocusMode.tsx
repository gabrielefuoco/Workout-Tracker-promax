import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useSwipeable } from 'react-swipeable';
import type { IWorkoutTemplate, IWorkoutSession, IWorkoutSet } from '../types';
import Timer from './Timer';
import { CheckIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface FocusModeProps {
  template: IWorkoutTemplate;
  activeSession: IWorkoutSession;
  onSessionUpdate: (session: IWorkoutSession) => void;
  onFinishWorkout: (session: IWorkoutSession) => void;
  onExit: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ template, activeSession, onSessionUpdate, onFinishWorkout, onExit }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetInput, setCurrentSetInput] = useState({ reps: '', weight: '', rpe: '' });
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [isSummaryScreen, setIsSummaryScreen] = useState(false);

  const handleAddSet = () => {
    const reps = parseInt(currentSetInput.reps, 10);
    const weight = parseFloat(currentSetInput.weight);
    
    if (isNaN(reps) || isNaN(weight)) return;

    const newSet: IWorkoutSet = {
      reps,
      weight,
      rpe: currentSetInput.rpe ? parseFloat(currentSetInput.rpe) : undefined,
      timestamp: Date.now(),
      isWarmup: false,
    };
    
    const updatedExercises = [...activeSession.exercises];
    const targetExercise = { ...updatedExercises[currentExerciseIndex] };
    targetExercise.sets = [...targetExercise.sets, newSet];
    updatedExercises[currentExerciseIndex] = targetExercise;

    // Notifica al componente padre (`App.tsx`) che lo stato della sessione è cambiato
    onSessionUpdate({ ...activeSession, exercises: updatedExercises });

    // Resetta l'input e avvia il timer di riposo
    setCurrentSetInput({ reps: '', weight: '', rpe: '' });
    
    const currentTemplateExercise = template.exercises[currentExerciseIndex];
    const defaultRest = currentTemplateExercise?.restSeconds ?? 90;
    setRestDuration(defaultRest);
    setIsResting(true);
  };
  
  const handleNextExercise = () => {
    if (activeSession && currentExerciseIndex < activeSession.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };
  
  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };
  
  const handleFinish = () => {
    const finalSession: IWorkoutSession = {
        ...activeSession,
        endTime: Date.now(),
    };
    setIsSummaryScreen(true);
  };
  
  const handleConfirmFinish = () => {
      const finalSession: IWorkoutSession = {
        ...activeSession,
        endTime: Date.now(),
    };
    onFinishWorkout(finalSession);
  }
  
  const handleInputValueChange = (field: 'reps' | 'weight' | 'rpe', value: string) => {
    setCurrentSetInput(prev => ({ ...prev, [field]: value }));
  };
  
  // const handlers = useSwipeable({
  //   onSwipedLeft: () => handleNextExercise(),
  //   onSwipedRight: () => handlePreviousExercise(),
  //   trackMouse: true
  // });


  if (isSummaryScreen) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-foreground p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold mb-4">Workout Complete!</h2>
          <p className="text-xl text-muted-foreground mb-8">Great job!</p>
          <button 
            onClick={handleConfirmFinish} 
            className="px-8 py-4 bg-gradient-to-br from-primary to-primary-focus text-primary-foreground font-bold rounded-xl shadow-lg hover:brightness-110 transition-transform transform hover:scale-105 disabled:opacity-70 disabled:scale-100"
          >
            Finish & View Summary
          </button>
        </motion.div>
      </div>
    );
  }
  
  if (activeSession.exercises.length === 0) {
      return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-foreground p-4">
            <h2 className="text-3xl font-bold">This workout has no exercises.</h2>
            <button onClick={onExit} className="mt-4 px-6 py-2 bg-muted rounded-lg">Go Back</button>
        </div>
      );
  }

  const currentExercise = activeSession.exercises[currentExerciseIndex];
  const currentTemplateExercise = template.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / activeSession.exercises.length) * 100;

  return (
    <div /* {...handlers} */ className="fixed inset-0 bg-background flex flex-col text-foreground p-4 overflow-y-auto">
      <AnimatePresence>
        {isResting && <Timer initialSeconds={restDuration} onFinish={() => setIsResting(false)} onSkip={() => setIsResting(false)} />}
      </AnimatePresence>
      
      <header className="flex justify-between items-center mb-4">
        <div className="text-sm">
            Exercise <span className="font-bold">{currentExerciseIndex + 1}</span> / {activeSession.exercises.length}
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
        />
      </div>

      <main className="flex-grow flex flex-col items-center text-center">
        <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <h2 className="text-4xl md:text-5xl font-bold my-2 truncate px-4">{currentExercise.name}</h2>
            <p className="text-muted-foreground">
                Target: {currentTemplateExercise.targetSets} x {currentTemplateExercise.targetReps}
            </p>
        </motion.div>
        
        {/* Completed sets list */}
        <div className="w-full max-w-md my-4 space-y-2 h-36 overflow-y-auto pr-2">
            {currentExercise.sets.map((set, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center text-left p-3 bg-card rounded-lg"
                >
                    <div className="font-bold text-primary w-8">{index + 1}</div>
                    <div className="flex-grow text-lg">
                        <span className="font-semibold text-foreground">{set.weight}</span>
                        <span className="text-sm text-muted-foreground"> kg</span>
                    </div>
                    <div className="text-muted-foreground">×</div>
                    <div className="flex-grow text-lg text-center">
                        <span className="font-semibold text-foreground">{set.reps}</span>
                        <span className="text-sm text-muted-foreground"> reps</span>
                    </div>
                    {set.rpe !== undefined && (
                        <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            RPE {set.rpe}
                        </div>
                    )}
                </motion.div>
            ))}
            {currentExercise.sets.length === 0 && (
                <div className="text-muted-foreground text-sm italic pt-8">No sets logged for this exercise yet.</div>
            )}
        </div>

        {/* Input Form */}
        <div className="my-6 flex items-center justify-around w-full max-w-lg">
            <div className="text-center">
                <label htmlFor="reps-input" className="block text-muted-foreground text-sm mb-1">Reps</label>
                <input 
                  id="reps-input" type="number"
                  value={currentSetInput.reps} 
                  onChange={e => handleInputValueChange('reps', e.target.value)} 
                  className="bg-muted/30 rounded-lg px-2 py-1 text-5xl font-bold w-28 text-center outline-none focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div className="text-center">
                <label htmlFor="weight-input" className="block text-muted-foreground text-sm mb-1">Weight (kg)</label>
                <input 
                  id="weight-input" type="number" step="0.25"
                  value={currentSetInput.weight} 
                  onChange={e => handleInputValueChange('weight', e.target.value)} 
                  className="bg-muted/30 rounded-lg px-2 py-1 text-5xl font-bold w-36 text-center outline-none focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div className="text-center">
                <label htmlFor="rpe-input" className="block text-muted-foreground text-sm mb-1">RPE</label>
                <input 
                    id="rpe-input" type="number" step="0.5" placeholder="-"
                    value={currentSetInput.rpe} 
                    onChange={e => handleInputValueChange('rpe', e.target.value)}
                    className="bg-muted/30 rounded-lg px-2 py-1 text-5xl font-bold w-28 text-center outline-none focus:ring-2 focus:ring-primary transition-all placeholder-muted-foreground/50"
                />
            </div>
        </div>
        
        <motion.button 
            onClick={handleAddSet}
            disabled={!currentSetInput.reps || !currentSetInput.weight}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-muted"
            whileTap={{ scale: 0.95 }}
        >
            <CheckIcon className="h-24 w-24 text-primary-foreground" />
        </motion.button>
      </main>

      <footer className="flex justify-between items-center mt-8">
        <button onClick={handlePreviousExercise} disabled={currentExerciseIndex === 0} className="p-4 rounded-full bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <button onClick={handleFinish} className="px-6 py-3 font-bold text-lg bg-card rounded-lg border border-border hover:border-primary transition-colors">
          Finish Workout
        </button>
        <button onClick={handleNextExercise} disabled={currentExerciseIndex >= activeSession.exercises.length - 1} className="p-4 rounded-full bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRightIcon className="h-8 w-8" />
        </button>
      </footer>
    </div>
  );
};

export default FocusMode;