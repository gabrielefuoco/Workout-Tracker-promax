import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Workout, Exercise, SetGroup } from '../types';
import { ArrowLeftIcon, PlusIcon, TrashIcon, ChevronDownIcon, PencilIcon, SaveIcon, ChevronRightIcon } from './icons';
import { useWorkouts } from '../contexts/WorkoutContext';

// Hook per tracciare la posizione del mouse all'interno di un elemento
const useMousePosition = (ref: React.RefObject<HTMLElement>) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                setPosition({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                });
            }
        };
        const currentRef = ref.current;
        currentRef?.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            currentRef?.removeEventListener('mousemove', handleMouseMove);
        };
    }, [ref]);

    return position;
};

const ExerciseCard: React.FC<{
    exercise: Exercise;
    workout: Workout;
    isExpanded: boolean;
    isEditingName: boolean;
    editingNameValue: string;
    confirmingDeleteId: string | null;
    onToggleExpand: (ex: Exercise) => void;
    onToggleEditName: (ex: Exercise) => void;
    onEditingNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStartDelete: (id: string) => void;
    onConfirmDelete: (id: string) => void;
    onCancelDelete: () => void;
    onSetGroupChange: (exId: string, sgIndex: number, field: keyof SetGroup, value: any) => void;
    onAddSetGroup: (exId: string) => void;
    onRemoveSetGroup: (exId: string, sgIndex: number) => void;
}> = ({
    exercise, workout, isExpanded, isEditingName, editingNameValue, confirmingDeleteId,
    onToggleExpand, onToggleEditName, onEditingNameChange, onStartDelete, onConfirmDelete, onCancelDelete,
    onSetGroupChange, onAddSetGroup, onRemoveSetGroup
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mousePos = useMousePosition(cardRef);

    return (
        <motion.div
            ref={cardRef}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="bg-card rounded-xl border border-border overflow-hidden relative group"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--color-primary) / 0.1), transparent 40%)`,
                }}
            />
            <div
                className="flex justify-between items-center p-4 cursor-pointer relative z-10"
                onClick={() => !isEditingName && onToggleExpand(exercise)}
            >
                <div className="flex-grow min-w-0 pr-4">
                    <input
                        type="text"
                        readOnly={!isEditingName}
                        value={isEditingName ? editingNameValue : exercise.name}
                        onChange={onEditingNameChange}
                        onKeyDown={(e) => e.key === 'Enter' && onToggleEditName(exercise)}
                        className={`w-full bg-transparent text-lg font-semibold text-foreground border border-transparent rounded-md p-1 -m-1 outline-none transition-all
                            ${isEditingName ? 'border-primary bg-background ring-2 ring-primary/30 cursor-text' : 'cursor-pointer'}`
                        }
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {exercise.setGroups.length > 0 ? exercise.setGroups.map(sg => (
                            <span key={sg.id} className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground whitespace-nowrap">
                                {sg.name}
                            </span>
                        )) : <span className="text-xs text-muted-foreground">No sets configured</span>}
                    </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                    <AnimatePresence mode="wait">
                        {confirmingDeleteId === exercise.id ? (
                        <motion.div 
                            key="confirm"
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                            className="flex items-center space-x-2"
                        >
                            <button onClick={(e) => { e.stopPropagation(); onCancelDelete(); }} className="px-3 py-1.5 rounded-md text-sm font-semibold text-muted-foreground hover:bg-muted">
                            Cancel
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onConfirmDelete(exercise.id); }} className="px-3 py-1.5 rounded-md text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                            </button>
                        </motion.div>
                        ) : (
                        <motion.div 
                            key="actions"
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                            className="flex items-center space-x-1"
                        >
                            <button onClick={(e) => { e.stopPropagation(); onToggleEditName(exercise); }} className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-primary transition-colors">
                            {isEditingName ? <SaveIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onStartDelete(exercise.id); }} className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-destructive transition-colors">
                            <TrashIcon className="h-5 w-5" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onToggleExpand(exercise); }} className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                <ChevronDownIcon className="h-6 w-6" />
                            </motion.div>
                            </button>
                        </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="grid grid-rows-[0fr] data-[expanded=true]:grid-rows-[1fr] transition-[grid-template-rows] ease-in-out duration-300 relative z-10" data-expanded={isExpanded}>
                <div className="overflow-hidden">
                    <div className="p-4 border-t border-border">
                        <div className="space-y-4 max-h-96 overflow-y-auto -mr-2 pr-2">
                            {exercise.setGroups.map((sg, index) => (
                                <div key={sg.id} className="p-4 bg-background/50 rounded-lg border border-border/50 relative">
                                    <div className="flex justify-between items-center mb-4">
                                        <input
                                            type="text"
                                            placeholder="Set Group Name"
                                            value={sg.name}
                                            onChange={(e) => onSetGroupChange(exercise.id, index, 'name', e.target.value)}
                                            className="bg-input rounded-md px-3 py-1 text-card-foreground font-semibold text-base border border-border outline-none focus:ring-1 focus:ring-primary flex-grow"
                                        />
                                        <button onClick={() => onRemoveSetGroup(exercise.id, index)} className="ml-4 p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 absolute top-3 right-3">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-muted-foreground mb-1 block">TARGET</label>
                                            <input type="text" value={sg.target} onChange={(e) => onSetGroupChange(exercise.id, index, 'target', e.target.value)} className="w-full bg-input rounded-md px-3 py-2 text-foreground text-base border border-border outline-none focus:ring-1 focus:ring-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-muted-foreground mb-1 block">REST (SECONDS)</label>
                                            <input type="number" placeholder="90" value={sg.restSeconds ?? ''} onChange={(e) => onSetGroupChange(exercise.id, index, 'restSeconds', e.target.value === '' ? undefined : parseInt(e.target.value, 10))} className="w-full bg-input rounded-md px-3 py-2 text-foreground text-base border border-border outline-none focus:ring-1 focus:ring-primary" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => onAddSetGroup(exercise.id)} className="flex items-center justify-center w-full gap-2 py-2.5 mt-4 font-semibold border-2 border-dashed rounded-lg border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                            <PlusIcon className="h-5 w-5" /> Add Set Group
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

interface WorkoutOverviewProps {
  workoutId: string;
  onStartWorkout: (workoutId: string) => void;
  onBack: () => void;
  onDeleted: () => void;
}

const WorkoutOverview: React.FC<WorkoutOverviewProps> = ({ workoutId, onStartWorkout, onBack, onDeleted }) => {
  const { getWorkoutById, updateWorkout, deleteWorkout } = useWorkouts();
  const workout = getWorkoutById(workoutId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [workoutName, setWorkoutName] = useState(workout?.name || '');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [editingExerciseName, setEditingExerciseName] = useState<{ id: string; name: string } | null>(null);
  const [confirmingDeleteExerciseId, setConfirmingDeleteExerciseId] = useState<string | null>(null);
  const [confirmingDeleteWorkout, setConfirmingDeleteWorkout] = useState(false);

  const deleteExerciseTimeoutRef = useRef<number | null>(null);
  const deleteWorkoutTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setWorkoutName(workout?.name || '');
  }, [workout?.name]);

  useEffect(() => {
    return () => {
      if (deleteExerciseTimeoutRef.current) clearTimeout(deleteExerciseTimeoutRef.current);
      if (deleteWorkoutTimeoutRef.current) clearTimeout(deleteWorkoutTimeoutRef.current);
    };
  }, []);

  if (!workout) {
    return (
      <div className="bg-background text-foreground min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Workout not found.</h2>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-muted rounded-lg">Go Back</button>
      </div>
    );
  }

  const handleWorkoutNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setWorkoutName(e.target.value);
  const handleWorkoutNameBlur = () => {
    setIsEditingName(false);
    if (workoutName.trim() !== '' && workoutName !== workout.name) {
      updateWorkout({ ...workout, name: workoutName });
    } else {
      setWorkoutName(workout.name);
    }
  };
  
  const nameParts = workout.name.split('(');
  const mainName = nameParts[0].trim();
  const subName = nameParts.length > 1 ? `(${nameParts.slice(1).join('(')}` : null;

  const handleToggleExpand = (exercise: Exercise) => {
    if (editingExerciseName) setEditingExerciseName(null);
    setExpandedExerciseId(prevId => prevId === exercise.id ? null : exercise.id);
  };
  
  const handleSetGroupChange = (exerciseId: string, sgIndex: number, field: keyof SetGroup, value: any) => {
    const updatedExercises = workout.exercises.map(ex => {
        if (ex.id === exerciseId) {
            const newSetGroups = [...ex.setGroups];
            const targetSetGroup = { ...newSetGroups[sgIndex] };
            (targetSetGroup as any)[field] = value;
            newSetGroups[sgIndex] = targetSetGroup;
            return { ...ex, setGroups: newSetGroups };
        }
        return ex;
    });
    updateWorkout({ ...workout, exercises: updatedExercises });
  };
  
  const handleAddSetGroup = (exerciseId: string) => {
    const newSetGroup: SetGroup = { id: `new-sg-${Date.now()}`, name: 'New Set Group', target: 'N/A', performedSets: [], restSeconds: 90 };
    const updatedExercises = workout.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, setGroups: [...ex.setGroups, newSetGroup] } : ex
    );
    updateWorkout({ ...workout, exercises: updatedExercises });
  };

  const handleRemoveSetGroup = (exerciseId: string, sgIndex: number) => {
    const updatedExercises = workout.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, setGroups: ex.setGroups.filter((_, i) => i !== sgIndex) } : ex
    );
    updateWorkout({ ...workout, exercises: updatedExercises });
  };

  const handleAddExercise = () => {
    const newExercise: Exercise = { id: `new-ex-${Date.now()}`, name: 'New Exercise', setGroups: [] };
    const exercises = [...workout.exercises, newExercise];
    updateWorkout({ ...workout, exercises });
    setExpandedExerciseId(newExercise.id);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exercises = workout.exercises.filter(ex => ex.id !== exerciseId);
    updateWorkout({ ...workout, exercises });
    if (expandedExerciseId === exerciseId) setExpandedExerciseId(null);
  };

  const startDeleteConfirmation = (exerciseId: string) => {
    setConfirmingDeleteExerciseId(exerciseId);
    if(deleteExerciseTimeoutRef.current) clearTimeout(deleteExerciseTimeoutRef.current);
    deleteExerciseTimeoutRef.current = window.setTimeout(() => setConfirmingDeleteExerciseId(null), 3000);
  };

  const handleCancelDeleteExercise = () => {
    if (deleteExerciseTimeoutRef.current) clearTimeout(deleteExerciseTimeoutRef.current);
    setConfirmingDeleteExerciseId(null);
  };
  
  const handleToggleEditName = (exercise: Exercise) => {
    if (editingExerciseName?.id === exercise.id) {
        if (editingExerciseName.name.trim() !== '') {
            const exercises = workout.exercises.map(ex => 
                ex.id === editingExerciseName.id ? { ...ex, name: editingExerciseName.name } : ex
            );
            updateWorkout({ ...workout, exercises });
        }
        setEditingExerciseName(null);
    } else {
        setExpandedExerciseId(null);
        setEditingExerciseName({ id: exercise.id, name: exercise.name });
    }
  };

  const handleDeleteWorkout = () => {
    if (confirmingDeleteWorkout) {
      if (deleteWorkoutTimeoutRef.current) clearTimeout(deleteWorkoutTimeoutRef.current);
      deleteWorkout(workout.id);
      onDeleted();
    } else {
      setConfirmingDeleteWorkout(true);
      deleteWorkoutTimeoutRef.current = window.setTimeout(() => {
        setConfirmingDeleteWorkout(false);
      }, 3000);
    }
  }

  return (
    <div className="bg-background text-foreground h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 md:p-6">
        <header className="flex items-center mb-10 gap-4 max-w-3xl mx-auto">
            <button onClick={onBack} className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <ArrowLeftIcon className="h-7 w-7" />
            </button>
            <div>
                {isEditingName ? (
                <input
                    type="text"
                    value={workoutName}
                    onChange={handleWorkoutNameChange}
                    onBlur={handleWorkoutNameBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleWorkoutNameBlur()}
                    autoFocus
                    className="text-3xl font-bold bg-transparent border-b-2 border-primary outline-none w-full"
                />
                ) : (
                <div onClick={() => setIsEditingName(true)} className="cursor-pointer">
                    <h1 className="text-3xl font-bold">{mainName}</h1>
                    {subName && <h2 className="text-xl font-semibold text-muted-foreground">{subName}</h2>}
                </div>
                )}
            </div>
        </header>

        <div className="space-y-4 mb-8 max-w-3xl mx-auto">
            <AnimatePresence>
                {workout.exercises.map(exercise => (
                <ExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    workout={workout}
                    isExpanded={expandedExerciseId === exercise.id}
                    isEditingName={editingExerciseName?.id === exercise.id}
                    editingNameValue={editingExerciseName?.name || ''}
                    confirmingDeleteId={confirmingDeleteExerciseId}
                    onToggleExpand={handleToggleExpand}
                    onToggleEditName={handleToggleEditName}
                    onEditingNameChange={(e) => editingExerciseName && setEditingExerciseName({ ...editingExerciseName, name: e.target.value })}
                    onStartDelete={startDeleteConfirmation}
                    onConfirmDelete={handleDeleteExercise}
                    onCancelDelete={handleCancelDeleteExercise}
                    onSetGroupChange={handleSetGroupChange}
                    onAddSetGroup={handleAddSetGroup}
                    onRemoveSetGroup={handleRemoveSetGroup}
                />
                ))}
            </AnimatePresence>

            {workout.exercises.length === 0 && (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-xl bg-card/50">
                    <h3 className="text-2xl font-bold text-foreground">Let's Build Your Workout</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Start by adding your first exercise below.</p>
                </div>
            )}
        </div>
        
        <div className="max-w-3xl mx-auto">
            <button 
                onClick={handleAddExercise}
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:bg-card/50 hover:border-primary hover:text-foreground transition-all duration-300"
            >
                <PlusIcon className="h-6 w-6 mr-2" /> Add Exercise
            </button>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 bg-background border-t border-border">
        <div className="flex items-center space-x-4 max-w-3xl mx-auto">
            <button 
                onClick={handleDeleteWorkout} 
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                    confirmingDeleteWorkout 
                    ? 'bg-red-700 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                }`}
            >
            {confirmingDeleteWorkout ? 'Confirm?' : 'Delete'}
            </button>
            <button 
                onClick={() => onStartWorkout(workout.id)} 
                className="flex-grow px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-lg flex items-center justify-center gap-2"
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
