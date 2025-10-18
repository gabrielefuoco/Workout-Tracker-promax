import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTemplates } from '../contexts/WorkoutContext';
import type { WorkoutTemplate, Exercise } from '../types';
import { ArrowLeftIcon, SaveIcon, TrashIcon, PlusIcon } from './icons';
import EditableExercise from './EditableExercise.tsx';
import Modal from './Modal.tsx';

interface EditWorkoutProps {
  templateId: string;
  onDone: () => void;
  onDeleted: () => void;
}

const EditWorkout: React.FC<EditWorkoutProps> = ({ templateId, onDone, onDeleted }) => {
  const { getTemplateById, updateTemplate, deleteTemplate, isLoading } = useTemplates();
  
  const [editedTemplate, setEditedTemplate] = useState<WorkoutTemplate | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const template = getTemplateById(templateId);
      setEditedTemplate(template ? { ...template } : null);
    }
  }, [templateId, isLoading, getTemplateById]);

  if (isLoading) {
     return <div className="p-4 pt-8 text-center min-h-screen flex items-center justify-center">Loading editor...</div>;
  }
  
  if (!editedTemplate) {
    return <div className="p-4 pt-8 text-center min-h-screen flex items-center justify-center">Workout not found</div>;
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedTemplate) {
      setEditedTemplate({ ...editedTemplate, name: e.target.value });
    }
  };
  
  const handleSave = () => {
    if (editedTemplate) {
        updateTemplate(editedTemplate);
    }
    onDone();
  };
  
  const handleDelete = () => {
      deleteTemplate(templateId);
      onDeleted();
  }

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: 'New Exercise',
      setGroups: []
    };
    setEditedTemplate(current => current ? { ...current, exercises: [...current.exercises, newExercise] } : null);
    setEditingExercise(newExercise);
  };
  
  const handleSaveExercise = (updatedExercise: Exercise) => {
    setEditedTemplate(current => current ? {
      ...current,
      exercises: current.exercises.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
    } : null);
    setEditingExercise(null);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setEditedTemplate(current => current ? {
      ...current,
      exercises: current.exercises.filter(ex => ex.id !== exerciseId)
    } : null);
  };

  return (
    <div className="p-4 pt-8 text-foreground min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <button onClick={onDone} className="p-2 rounded-full hover:bg-muted">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Edit Workout</h1>
        <button onClick={handleSave} className="p-2 rounded-full hover:bg-muted text-primary">
          <SaveIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="mb-6">
        <label htmlFor="workout-name" className="block text-sm font-medium text-muted-foreground mb-1">Workout Name</label>
        <input
          id="workout-name"
          type="text"
          value={editedTemplate.name}
          onChange={handleNameChange}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      <h2 className="text-xl font-semibold mb-3">Exercises</h2>
      <div className="space-y-3 mb-24 pb-4">
        {editedTemplate.exercises.map(exercise => (
          <motion.div 
            key={exercise.id} 
            layout
            className="bg-card border border-border rounded-lg p-3 flex justify-between items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-medium truncate pr-2">{exercise.name}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setEditingExercise(exercise)} className="text-muted-foreground hover:text-primary p-1">Edit</button>
              <button onClick={() => handleRemoveExercise(exercise.id)} className="text-destructive p-1">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
         <button onClick={handleAddExercise} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:bg-muted hover:border-primary transition-colors">
            <PlusIcon className="h-5 w-5" />
            Add Exercise
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border">
          <button onClick={() => setIsDeleteModalOpen(true)} className="w-full py-3 bg-destructive/10 text-destructive font-bold rounded-lg hover:bg-destructive/20 transition-colors">
              Delete Workout
          </button>
      </div>

      {editingExercise && (
        <Modal onClose={() => setEditingExercise(null)}>
          <EditableExercise 
            exercise={editingExercise}
            onSave={handleSaveExercise}
            onCancel={() => setEditingExercise(null)}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
          <Modal onClose={() => setIsDeleteModalOpen(false)}>
              <div className="text-center p-4">
                  <h2 className="text-xl font-bold mb-4">Delete Workout?</h2>
                  <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
                  <div className="flex justify-center gap-4">
                      <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 bg-muted rounded-lg">Cancel</button>
                      <button onClick={handleDelete} className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg">Delete</button>
                  </div>
              </div>
          </Modal>
      )}
    </div>
  );
};

export default EditWorkout;