import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTemplates, updateTemplateAPI, addTemplateAPI, deleteTemplateAPI, updateTemplateSetAPI } from '../api/localApi';
import type { WorkoutTemplate, PerformedSet } from '../types';

type UpdateTemplateSetPayload = {
    templateId: string;
    exerciseId: string;
    setGroupId: string;
    setId: string;
    updates: Partial<PerformedSet>;
};

interface TemplateContextType {
  templates: WorkoutTemplate[];
  isLoading: boolean;
  getTemplateById: (id: string) => WorkoutTemplate | undefined;
  addTemplate: (templateData: Omit<WorkoutTemplate, 'id'>) => Promise<WorkoutTemplate>;
  updateTemplate: (updatedTemplate: WorkoutTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  updateTemplateSet: (payload: UpdateTemplateSetPayload) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery<WorkoutTemplate[]>({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });

  const addMutation = useMutation({
    mutationFn: addTemplateAPI,
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTemplateAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemplateAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
  
  const updateSetMutation = useMutation({
    mutationFn: updateTemplateSetAPI,
     onSuccess: (updatedTemplate) => {
      // Optimistically update the query data to avoid a full refetch
      queryClient.setQueryData(['templates'], (oldData: WorkoutTemplate[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(t => t.id === updatedTemplate.id ? updatedTemplate : t);
      });
    },
  })

  const getTemplateById = useCallback((id: string) => {
    return templates.find(w => w.id === id);
  }, [templates]);
  
  const addTemplate = useCallback(async (templateData: Omit<WorkoutTemplate, 'id'>): Promise<WorkoutTemplate> => {
    const newTemplate: WorkoutTemplate = {
      id: `workout-${Date.now()}`,
      ...templateData,
    };
    return await addMutation.mutateAsync(newTemplate);
  }, [addMutation]);

  const value = {
    templates,
    isLoading,
    getTemplateById,
    addTemplate,
    updateTemplate: updateMutation.mutate,
    deleteTemplate: deleteMutation.mutate,
    updateTemplateSet: updateSetMutation.mutate,
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