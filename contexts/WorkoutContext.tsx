import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { INITIAL_TEMPLATES } from '../constants';
import type { WorkoutTemplate, PerformedSet } from '../types';

interface TemplateContextType {
  templates: WorkoutTemplate[];
  getTemplateById: (id: string) => WorkoutTemplate | undefined;
  addTemplate: () => WorkoutTemplate;
  updateTemplate: (updatedTemplate: WorkoutTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  updateTemplateSet: (
    templateId: string, 
    exerciseId: string, 
    setGroupId: string, 
    setId: string, 
    updates: Partial<PerformedSet>
  ) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useLocalStorage<WorkoutTemplate[]>('workout-templates', INITIAL_TEMPLATES);

  const getTemplateById = (id: string) => {
    return templates.find(w => w.id === id);
  };
  
  const addTemplate = (): WorkoutTemplate => {
    const newTemplate: WorkoutTemplate = {
      id: `workout-${Date.now()}`,
      name: 'New Workout',
      exercises: []
    };
    setTemplates([...templates, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = (updatedTemplate: WorkoutTemplate) => {
    setTemplates(templates.map(w => w.id === updatedTemplate.id ? updatedTemplate : w));
  };
  
  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(w => w.id !== templateId));
  }

  const updateTemplateSet = (
    templateId: string, 
    exerciseId: string, 
    setGroupId: string, 
    setId: string, 
    updates: Partial<PerformedSet>
  ) => {
    setTemplates(prevTemplates => 
      prevTemplates.map(template => {
        if (template.id !== templateId) return template;
        
        return {
          ...template,
          exercises: template.exercises.map(exercise => {
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
    templates,
    getTemplateById,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    updateTemplateSet,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplates = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
};