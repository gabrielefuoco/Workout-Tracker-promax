import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { IWorkoutTemplate, ITemplateExercise } from '../types';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from './icons';
import { useWorkoutTemplates } from '../contexts/WorkoutContext';
import EditableExerciseCard from './EditableExercise';

interface EditWorkoutProps {
  templateId: string;
  onDone: () => void;
  onDeleted: () => void;
}

const EditWorkout: React.FC<EditWorkoutProps> = ({ templateId, onDone, onDeleted }) => {
  const { getTemplateById, updateTemplate, deleteTemplate } = useWorkoutTemplates();
  const [localTemplate, setLocalTemplate] = useState<IWorkoutTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const deleteTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    const template = getTemplateById(templateId);
    if (template) {
        setLocalTemplate(JSON.parse(JSON.stringify(template)));
    }
  }, [templateId, getTemplateById]);
  
  useEffect(() => {
      return () => {
          if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      }
  }, []);

  if (!localTemplate) {
    return (
      <div className="bg-background text-foreground min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Editor...</h2>
      </div>
    );
  }

  const handleTemplateChange = (field: keyof IWorkoutTemplate, value: any) => {
      setLocalTemplate(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleExerciseUpdate = (index: number, field: keyof ITemplateExercise, value: any) => {
      if (!localTemplate) return;
      const newExercises = [...localTemplate.exercises];
      newExercises[index] = { ...newExercises[index], [field]: value };
      handleTemplateChange('exercises', newExercises);
  };

  const handleAddExercise = () => {
      const newExercise: ITemplateExercise = {
          exerciseId: `new-ex-${Date.now()}`,
          name: 'New Exercise',
          order: localTemplate.exercises.length,
          targetSets: 3,
          targetReps: '8-12',
      };
      handleTemplateChange('exercises', [...localTemplate.exercises, newExercise]);
  };
  
  const handleDeleteExercise = (index: number) => {
      if (!localTemplate) return;
      const newExercises = localTemplate.exercises.filter((_, i) => i !== index);
      handleTemplateChange('exercises', newExercises);
  };
  
  const handleReorderExercises = (reorderedExercises: ITemplateExercise[]) => {
      const newExercises = reorderedExercises.map((ex, index) => ({...ex, order: index}));
      handleTemplateChange('exercises', newExercises);
  };
  
  const handleSave = async () => {
      if (!localTemplate) return;
      setIsSaving(true);
      await updateTemplate(localTemplate);
      setIsSaving(false);
      onDone();
  };

  const handleDelete = async () => {
      if (confirmingDelete) {
        if(deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        await deleteTemplate(templateId);
        onDeleted();
      } else {
        setConfirmingDelete(true);
        deleteTimeoutRef.current = window.setTimeout(() => setConfirmingDelete(false), 3000);
      }
  };


  return (
    <div className="bg-background text-foreground h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 sm:p-6">
        <header className="flex items-center mb-8 gap-2 sm:gap-4 max-w-3xl mx-auto">
            <button onClick={onDone} className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                <ArrowLeftIcon className="h-7 w-7" />
            </button>
            <div className="flex-grow">
                 <input
                    type="text"
                    value={localTemplate.name}
                    onChange={(e) => handleTemplateChange('name', e.target.value)}
                    className="text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-border focus:border-primary outline-none w-full transition-colors"
                    placeholder="Workout Name"
                />
            </div>
        </header>

        <main className="mb-8 max-w-3xl mx-auto">
            <Reorder.Group axis="y" values={localTemplate.exercises} onReorder={handleReorderExercises} className="space-y-4">
                <AnimatePresence>
                    {localTemplate.exercises.map((exercise, index) => (
                        <EditableExerciseCard 
                            key={exercise.exerciseId}
                            exercise={exercise}
                            onUpdate={(field, value) => handleExerciseUpdate(index, field, value)}
                            onDelete={() => handleDeleteExercise(index)}
                        />
                    ))}
                </AnimatePresence>
            </Reorder.Group>
            
            <button 
                onClick={handleAddExercise}
                className="flex items-center justify-center w-full mt-6 py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:bg-card/50 hover:border-primary hover:text-foreground transition-all duration-300"
            >
                <PlusIcon className="h-6 w-6 mr-2" /> Add Exercise
            </button>
        </main>
      </div>

      <div className="flex-shrink-0 p-4 bg-background border-t border-border">
        <div className="flex items-center space-x-4 max-w-3xl mx-auto">
            <button 
                onClick={handleDelete}
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 w-32 text-center ${
                    confirmingDelete
                    ? 'bg-red-700 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-destructive/10 text-destructive-foreground hover:bg-destructive/20'
                }`}
            >
            {confirmingDelete ? 'Confirm?' : 'Delete'}
            </button>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-grow px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {isSaving ? 'Saving...' : 'Done'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkout;