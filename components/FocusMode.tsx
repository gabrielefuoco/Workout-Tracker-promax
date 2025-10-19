import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IWorkoutTemplate, IWorkoutSession, ISessionExercise, IWorkoutSet, Timestamp } from '../types';
import Timer from './Timer';
import { CheckIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './icons';
import { useWorkoutTemplates } from '../contexts/WorkoutContext';
import { useSessions } from '../contexts/SessionContext';
import { calculateAggregatedData } from '../utils/sessionUtils';

interface FocusModeProps {
  templateId: string;
  onFinishWorkout: () => void;
  onExit: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ templateId, onFinishWorkout, onExit }) => {
  const { getTemplateById } = useWorkoutTemplates();
  const { addSession } = useSessions();
  
  const [template, setTemplate] = useState<IWorkoutTemplate | null>(null);
  const [activeSession, setActiveSession] = useState<IWorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetInput, setCurrentSetInput] = useState({ reps: '', weight: '', rpe: '' });
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [isSummaryScreen, setIsSummaryScreen] = useState(false);

  useEffect(() => {
    const foundTemplate = getTemplateById(templateId);
    if (foundTemplate) {
        setTemplate(foundTemplate);
    }
  }, [templateId, getTemplateById]);

  useEffect(() => {
    if (template) {
      const startTime = Date.now();
      const sessionExercises: ISessionExercise[] = template.exercises.map((ex, index) => ({
        id: `sess-ex-${ex.id}-${startTime}`,
        exerciseId: ex.id,
        name: ex.name,
        order: index,
        notes: ex.notes,
        sets: [], // Start with no sets completed
      }));

      const newSession: IWorkoutSession = {
        id: `session-${startTime}`,
        name: template.name,
        startTime: startTime as Timestamp,
        endTime: null,
        status: 'active',
        exercises: sessionExercises,
        aggregatedData: null,
      };
      
      setActiveSession(newSession);
      setCurrentExerciseIndex(0);
    }
  }, [template]);

  const handleAddSet = () => {
    const reps = parseInt(currentSetInput.reps, 10);
    const weight = parseFloat(currentSetInput.weight);
    
    if (!activeSession || isNaN(reps) || isNaN(weight)) return;

    const newSet: IWorkoutSet = {
      reps,
      weight,
      rpe: currentSetInput.rpe ? parseFloat(currentSetInput.rpe) : undefined,
      timestamp: Date.now() as Timestamp,
      isWarmup: false,
    };
    
    setActiveSession(prevSession => {
        if (!prevSession) return null;
        const newExercises = [...prevSession.exercises];
        const updatedExercise = { ...newExercises[currentExerciseIndex] };
        updatedExercise.sets = [...updatedExercise.sets, newSet];
        newExercises[currentExerciseIndex] = updatedExercise;
        return { ...prevSession, exercises: newExercises };
    });

    // Reset input and start rest timer
    setCurrentSetInput({ reps: '', weight: '', rpe: '' });
    
    const currentTemplateExercise = template?.exercises[currentExerciseIndex];
    const defaultRest = currentTemplateExercise?.setGroups?.[0]?.restSeconds ?? 90;
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
  
  const handleFinish = async () => {
    if (!activeSession) return;
    
    const endTime = Date.now();

    // Filter out exercises where no sets were performed
    const performedExercises = activeSession.exercises.filter(ex => ex.sets.length > 0);

    if (performedExercises.length > 0) {
        const aggregatedData = calculateAggregatedData(performedExercises, activeSession.startTime, endTime);
        
        const completedSession: IWorkoutSession = {
            ...activeSession,
            endTime: endTime as Timestamp,
            status: 'completed',
            exercises: performedExercises,
            aggregatedData,
            processedAt: endTime as Timestamp,
        };
        await addSession(completedSession);
    }
    
    onFinishWorkout();
  };
  
  const handleInputValueChange = (field: 'reps' | 'weight' | 'rpe', value: string) => {
    setCurrentSetInput(prev => ({ ...prev, [field]: value }));
  };

  if (!activeSession || !template) {
    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-foreground p-4">
            <h2 className="text-2xl font-bold">Loading Workout...</h2>
        </div>
    );
  }

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
          <button onClick={handleFinish} className="px-8 py-4 bg-gradient-to-br from-primary to-primary-focus text-primary-foreground font-bold rounded-xl shadow-lg hover:brightness-110 transition-transform transform hover:scale-105">
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
  const progress = ((currentExerciseIndex + 1) / activeSession.exercises.length) * 100;

  return (
    <div className="fixed inset-0 bg-background flex flex-col text-foreground p-4 overflow-y-auto">
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
        </motion.div>
        
        {/* Completed sets list */}
        <div className="w-full max-w-md my-4 h-24 overflow-y-auto">
            {currentExercise.sets.map((set, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center text-left p-2 bg-card rounded-md mb-2"
                >
                    <div className="font-bold text-primary w-8">{index + 1}</div>
                    <div className="flex-grow"><span className="font-semibold">{set.weight}</span> kg</div>
                    <div className="flex-grow">x <span className="font-semibold">{set.reps}</span> reps</div>
                    {set.rpe !== undefined && <div className="text-sm text-muted-foreground">@ RPE {set.rpe}</div>}
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
        <button onClick={() => setIsSummaryScreen(true)} className="px-6 py-3 font-bold text-lg bg-card rounded-lg border border-border hover:border-primary transition-colors">
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