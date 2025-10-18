import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import type { Workout, Exercise, SetGroup } from '../types';
import { ArrowLeftIcon, PlusIcon, TrashIcon, ChevronDownIcon, PencilIcon, SaveIcon, ChevronUpIcon } from './icons';
import { useWorkouts } from '../contexts/WorkoutContext';

interface ExerciseCardProps {
    exercise: Exercise;
    isExpanded: boolean;
    isEditingName: boolean;
    editingNameValue: string;
    confirmingDeleteId: string | null;
    isUltraCompact: boolean;
    onToggleExpand: (exerciseId: string) => void;
    onToggleEditName: (ex: Exercise) => void;
    onEditingNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStartDelete: (id: string) => void;
    onConfirmDelete: (id: string) => void;
    onCancelDelete: () => void;
    onSetGroupChange: (exId: string, sgIndex: number, field: keyof SetGroup, value: any) => void;
    onAddSetGroup: (exId: string) => void;
    onRemoveSetGroup: (exId: string, sgIndex: number) => void;
    onMove: (direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
    exercise, isExpanded, isEditingName, editingNameValue, confirmingDeleteId, isUltraCompact,
    onToggleExpand, onToggleEditName, onEditingNameChange, onStartDelete, onConfirmDelete, onCancelDelete,
    onSetGroupChange, onAddSetGroup, onRemoveSetGroup, onMove, isFirst, isLast,
}) => {
    const dragControls = useDragControls();
    const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === 'touch') {
            pressTimer.current = setTimeout(() => {
                dragControls.start(e);
            }, 500);
        } else {
            dragControls.start(e);
        }
    };

    const handlePointerUp = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }
    };

    return (
        <Reorder.Item
            value={exercise}
            dragListener={false}
            dragControls={dragControls}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="bg-card rounded-xl border border-border overflow-hidden relative"
            style={{ zIndex: isExpanded || isUltraCompact ? 10 : 1 }}
        >
            <div className={`flex items-center ${isUltraCompact ? 'py-2 px-3' : 'py-4 px-3 sm:p-4'}`}>
                <div className="flex items-center gap-1 text-muted-foreground self-start pt-1">
                     <div
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        className="cursor-grab touch-none p-2 -ml-2"
                    >
                         <i className="ph ph-list-dashes text-2xl text-muted-foreground/40 transition-colors duration-200 hover:text-muted-foreground"></i>
                    </div>
                </div>

                <div className="flex-grow min-w-0 mx-2" onClick={() => !isEditingName && !isUltraCompact && onToggleExpand(exercise.id)}>
                    <input
                        type="text"
                        readOnly={!isEditingName}
                        value={isEditingName ? editingNameValue : exercise.name}
                        onChange={onEditingNameChange}
                        onKeyDown={(e) => e.key === 'Enter' && onToggleEditName(exercise)}
                        className={`w-full bg-transparent text-lg font-semibold text-foreground border border-transparent rounded-md p-1 -m-1 outline-none transition-all ${isEditingName ? 'border-primary bg-background ring-2 ring-primary/30 cursor-text' : 'cursor-pointer'}`}
                    />
                    {!isUltraCompact && (
                        <div className="mt-2 flex flex-wrap gap-2 cursor-pointer">
                            {exercise.setGroups.length > 0 ? exercise.setGroups.map(sg => (
                                <span key={sg.id} className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground whitespace-nowrap">
                                    {sg.name}
                                </span>
                            )) : <span className="text-xs text-muted-foreground">No sets configured</span>}
                        </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-1 flex-shrink-0 self-start">
                    <AnimatePresence mode="wait">
                        {confirmingDeleteId === exercise.id ? (
                            <motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center space-x-2">
                                <button onClick={(e) => { e.stopPropagation(); onCancelDelete(); }} className="px-3 py-1.5 rounded-md text-sm font-semibold text-muted-foreground hover:bg-muted">Cancel</button>
                                <button onClick={(e) => { e.stopPropagation(); onConfirmDelete(exercise.id); }} className="px-3 py-1.5 rounded-md text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</button>
                            </motion.div>
                        ) : (
                            <motion.div key="actions" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center space-x-1">
                                <button onClick={(e) => { e.stopPropagation(); onToggleEditName(exercise); }} className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-primary transition-colors">
                                    {isEditingName ? <SaveIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onStartDelete(exercise.id); }} className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-destructive transition-colors">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                                {!isUltraCompact && (
                                    <button onClick={(e) => { e.stopPropagation(); onToggleExpand(exercise.id); }} className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                            <ChevronDownIcon className="h-6 w-6" />
                                        </motion.div>
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="grid grid-rows-[0fr] data-[expanded=true]:grid-rows-[1fr] transition-[grid-template-rows] ease-in-out duration-300" data-expanded={isExpanded || isUltraCompact}>
                <div className="overflow-hidden">
                    {isUltraCompact ? (
                        <div className="border-t border-border px-4 sm:pl-14 pt-3 pb-3">
                            <ul className="space-y-1 max-h-48 overflow-y-auto pr-2 -mr-2 text-sm">
                                {exercise.setGroups.map(sg => (
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
                                ))}
                                {exercise.setGroups.length === 0 && (
                                    <li className="text-xs text-muted-foreground italic">Nessun set.</li>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <div className="pt-0 border-t border-border px-4 sm:px-6 pb-4 sm:pl-14">
                            <div className="space-y-3 max-h-96 overflow-y-auto -mr-2 pr-2 pt-4">
                                {exercise.setGroups.map((sg, index) => (
                                    <div key={sg.id} className="p-3 bg-background/50 rounded-lg border border-border/50 relative">
                                        <div className="flex justify-between items-center mb-3">
                                            <input
                                                type="text"
                                                placeholder="Set Group Name"
                                                value={sg.name}
                                                onChange={(e) => onSetGroupChange(exercise.id, index, 'name', e.target.value)}
                                                className="bg-input rounded-md px-3 py-1 text-card-foreground font-semibold text-base border border-border outline-none focus:ring-1 focus:ring-primary flex-grow"
                                            />
                                            <button onClick={() => onRemoveSetGroup(exercise.id, index)} className="ml-4 p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 absolute top-2 right-2">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground mb-1 block">TARGET</label>
                                                <input type="text" value={sg.target} onChange={(e) => onSetGroupChange(exercise.id, index, 'target', e.target.value)} className="w-full bg-input rounded-md px-3 py-2 text-foreground text-base border border-border outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                            <div>
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
                    )}
                </div>
            </div>
        </Reorder.Item>
    );
};

interface EditWorkoutProps {
  workoutId: string;
  onDone: () => void;
  onDeleted: () => void;
}

const EditWorkout: React.FC<EditWorkoutProps> = ({ workoutId, onDone, onDeleted }) => {
  const { getWorkoutById, updateWorkout, deleteWorkout } = useWorkouts();
  const workout = getWorkoutById(workoutId);

  const [isEditingName, setIsEditingName] = useState(false);
  const nameEditContainerRef = useRef<HTMLDivElement>(null);

  const parseWorkoutName = (name: string) => {
    const match = name.match(/^(.*?)\s*\((.*?)\)\s*$/);
    if (match) {
        return { mainName: match[1].trim(), subName: match[2].trim() };
    }
    return { mainName: name.trim(), subName: '' };
  };
  
  const { mainName, subName } = parseWorkoutName(workout?.name || '');
  
  const [titleInput, setTitleInput] = useState(mainName);
  const [subtitleInput, setSubtitleInput] = useState(subName);

  const [expandedExerciseIds, setExpandedExerciseIds] = useState<string[]>([]);
  const [editingExerciseName, setEditingExerciseName] = useState<{ id: string; name: string } | null>(null);
  const [confirmingDeleteExerciseId, setConfirmingDeleteExerciseId] = useState<string | null>(null);
  const [confirmingDeleteWorkout, setConfirmingDeleteWorkout] = useState(false);
  const [isUltraCompactMode, setIsUltraCompactMode] = useState(false);

  const deleteExerciseTimeoutRef = useRef<number | null>(null);
  const deleteWorkoutTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (workout) {
      const { mainName, subName } = parseWorkoutName(workout.name);
      setTitleInput(mainName);
      setSubtitleInput(subName);
    }
  }, [workout?.name]);

  useEffect(() => {
    return () => {
      if (deleteExerciseTimeoutRef.current) clearTimeout(deleteExerciseTimeoutRef.current);
      if (deleteWorkoutTimeoutRef.current) clearTimeout(deleteWorkoutTimeoutRef.current);
    };
  }, []);

  const useLongPress = (callback: () => void, ms = 500) => {
    const timeout = useRef<ReturnType<typeof setTimeout>>();
    const start = (e: React.MouseEvent | React.TouchEvent) => {
        // e.preventDefault(); // This can prevent click events, be careful
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

  const nameEditLongPress = useLongPress(() => {
    setIsEditingName(true);
  });

  const handleSaveName = () => {
    setIsEditingName(false);
    if (!workout) return;

    if (titleInput.trim() === '') {
        const { mainName, subName } = parseWorkoutName(workout.name);
        setTitleInput(mainName);
        setSubtitleInput(subName);
        return;
    }

    const newName = subtitleInput.trim()
      ? `${titleInput.trim()} (${subtitleInput.trim()})`
      : titleInput.trim();

    if (newName !== workout.name) {
      updateWorkout({ ...workout, name: newName });
    }
  };
  
  const handleNameEditBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!nameEditContainerRef.current?.contains(e.relatedTarget as Node)) {
        handleSaveName();
    }
  };

  if (!workout) {
    return (
      <div className="bg-background text-foreground min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Workout not found.</h2>
        <button onClick={onDone} className="mt-4 px-6 py-2 bg-muted rounded-lg">Go Back</button>
      </div>
    );
  }

  const handleToggleExpand = (exerciseId: string) => {
    if (editingExerciseName) setEditingExerciseName(null);
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

  const toggleAllLongPress = useLongPress(handleToggleUltraCompact, 400);

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
    setExpandedExerciseIds(prevIds => [...prevIds, newExercise.id]);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exercises = workout.exercises.filter(ex => ex.id !== exerciseId);
    updateWorkout({ ...workout, exercises });
    setExpandedExerciseIds(prevIds => prevIds.filter(id => id !== exerciseId));
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
        if(editingExerciseName) { // Save previous one if switching
            const prevExercise = workout.exercises.find(ex => ex.id === editingExerciseName.id);
            if(prevExercise && editingExerciseName.name.trim() !== '' && editingExerciseName.name !== prevExercise.name) {
                 const exercises = workout.exercises.map(ex => 
                    ex.id === editingExerciseName.id ? { ...ex, name: editingExerciseName.name } : ex
                );
                updateWorkout({ ...workout, exercises });
            }
        }
        setExpandedExerciseIds(prevIds => prevIds.filter(id => id !== exercise.id));
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

  const handleReorder = (newOrder: Exercise[]) => {
      updateWorkout({ ...workout, exercises: newOrder });
  };

  const handleMoveExercise = (indexToMove: number, direction: 'up' | 'down') => {
      if ((direction === 'up' && indexToMove === 0) || (direction === 'down' && indexToMove === workout.exercises.length - 1)) {
          return;
      }
      const newExercises = [...workout.exercises];
      const targetIndex = direction === 'up' ? indexToMove - 1 : indexToMove + 1;
      [newExercises[indexToMove], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[indexToMove]];
      updateWorkout({ ...workout, exercises: newExercises });
  };

  return (
    <div className="bg-background text-foreground h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 sm:p-6">
        <header className="flex items-center mb-8 gap-2 sm:gap-4 max-w-6xl mx-auto">
            <button onClick={onDone} className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <ArrowLeftIcon className="h-7 w-7" />
            </button>
            <div className="flex-grow">
                {isEditingName ? (
                    <div ref={nameEditContainerRef} onBlur={handleNameEditBlur}>
                        <input
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            autoFocus
                            className="text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-primary outline-none w-full"
                            placeholder="Titolo Allenamento"
                        />
                        <input
                            type="text"
                            value={subtitleInput}
                            onChange={(e) => setSubtitleInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            className="text-lg sm:text-xl font-semibold text-muted-foreground bg-transparent border-b-2 border-border outline-none w-full mt-1 focus:border-primary/70"
                            placeholder="Sottotitolo (opzionale)"
                        />
                    </div>
                ) : (
                <div {...nameEditLongPress} className="cursor-pointer py-1">
                    <h1 className="text-2xl sm:text-3xl font-bold">{mainName}</h1>
                    {subName && <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground">{subName}</h2>}
                </div>
                )}
            </div>
            <button
                {...toggleAllLongPress}
                onClick={handleToggleAll}
                className={`text-2xl p-2 rounded-full transition-all duration-300 flex-shrink-0 ${isUltraCompactMode ? 'text-primary bg-primary/10 rotate-90' : 'text-muted-foreground hover:text-primary hover:bg-card'}`}
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
        </header>

        <div className="mb-8 max-w-6xl mx-auto">
            <Reorder.Group axis="y" values={workout.exercises} onReorder={handleReorder} className="space-y-4">
                <AnimatePresence>
                    {workout.exercises.map((exercise, index) => (
                    <ExerciseCard 
                        key={exercise.id}
                        exercise={exercise}
                        isExpanded={expandedExerciseIds.includes(exercise.id)}
                        isEditingName={editingExerciseName?.id === exercise.id}
                        editingNameValue={editingExerciseName?.name || ''}
                        confirmingDeleteId={confirmingDeleteExerciseId}
                        isUltraCompact={isUltraCompactMode}
                        onToggleExpand={handleToggleExpand}
                        onToggleEditName={handleToggleEditName}
                        onEditingNameChange={(e) => editingExerciseName && setEditingExerciseName({ ...editingExerciseName, name: e.target.value })}
                        onStartDelete={startDeleteConfirmation}
                        onConfirmDelete={handleDeleteExercise}
                        onCancelDelete={handleCancelDeleteExercise}
                        onSetGroupChange={handleSetGroupChange}
                        onAddSetGroup={handleAddSetGroup}
                        onRemoveSetGroup={handleRemoveSetGroup}
                        onMove={(dir) => handleMoveExercise(index, dir)}
                        isFirst={index === 0}
                        isLast={index === workout.exercises.length - 1}
                    />
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {workout.exercises.length === 0 && (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-xl bg-card/50">
                    <h3 className="text-2xl font-bold text-foreground">Let's Build Your Workout</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Start by adding your first exercise below.</p>
                </div>
            )}
        </div>
        
        <div className="max-w-6xl mx-auto">
            <button 
                onClick={handleAddExercise}
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:bg-card/50 hover:border-primary hover:text-foreground transition-all duration-300"
            >
                <PlusIcon className="h-6 w-6 mr-2" /> Add Exercise
            </button>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 bg-background border-t border-border">
        <div className="flex items-center space-x-4 max-w-6xl mx-auto">
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
                onClick={onDone} 
                className="flex-grow px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-lg flex items-center justify-center gap-2"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkout;