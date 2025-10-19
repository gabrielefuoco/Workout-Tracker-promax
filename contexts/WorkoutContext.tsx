import React, { createContext, useContext, ReactNode, useState } from 'react';
import type { IWorkoutTemplate } from '../types';
import { INITIAL_WORKOUT_TEMPLATES } from '../constants';

interface WorkoutTemplateContextType {
  templates: IWorkoutTemplate[];
  getTemplateById: (id: string) => IWorkoutTemplate | undefined;
  addTemplate: () => Promise<IWorkoutTemplate>;
  updateTemplate: (updatedTemplate: IWorkoutTemplate) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
}

const WorkoutTemplateContext = createContext<WorkoutTemplateContextType | undefined>(undefined);

export const WorkoutTemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<IWorkoutTemplate[]>(INITIAL_WORKOUT_TEMPLATES);

  const getTemplateById = (id: string) => {
    return templates.find(w => w.id === id);
  };
  
  const addTemplate = async (): Promise<IWorkoutTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const now = Date.now();
    const newTemplate: IWorkoutTemplate = {
      id: `template-${now}`,
      name: 'New Workout Plan',
      description: 'A fresh start!',
      exercises: [],
      createdAt: now,
      updatedAt: now,
      lastUsedAt: null,
      useCount: 0,
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = async (updatedTemplate: IWorkoutTemplate) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const now = Date.now();
    setTemplates(prevTemplates => 
      prevTemplates.map(w => 
        w.id === updatedTemplate.id 
          ? { ...updatedTemplate, updatedAt: now } 
          : w
      )
    );
  };
  
  const deleteTemplate = async (templateId: string) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    setTemplates(prevTemplates => prevTemplates.filter(w => w.id !== templateId));
  };

  const value = {
    templates,
    getTemplateById,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  };

  return (
    <WorkoutTemplateContext.Provider value={value}>
      {children}
    </WorkoutTemplateContext.Provider>
  );
};

export const useWorkoutTemplates = (): WorkoutTemplateContextType => {
  const context = useContext(WorkoutTemplateContext);
  if (context === undefined) {
    throw new Error('useWorkoutTemplates must be used within a WorkoutTemplateProvider');
  }
  return context;
};
