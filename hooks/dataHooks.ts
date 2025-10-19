// src/hooks/dataHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../lib/api';
import { IWorkoutTemplate, IWorkoutSession } from '../types';

// --- Hooks per i Template ---
export const useTemplates = () => {
  return useQuery<IWorkoutTemplate[], Error>({
    queryKey: ['templates'],
    queryFn: api.fetchTemplates,
  });
};

export const useAddTemplate = (onSuccessCallback: (newTemplate: IWorkoutTemplate) => void) => {
    const queryClient = useQueryClient();
    return useMutation<IWorkoutTemplate, Error, void>({
        mutationFn: api.addTemplate,
        onSuccess: (newTemplate) => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            onSuccessCallback(newTemplate);
        },
    });
};

export const useUpdateTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation<IWorkoutTemplate, Error, IWorkoutTemplate>({
        mutationFn: api.updateTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        },
    });
};

export const useDeleteTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: api.deleteTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        },
    });
};


// --- Hooks per le Sessioni ---
export const useSessions = () => {
    return useQuery<IWorkoutSession[], Error>({
        queryKey: ['sessions'],
        queryFn: api.fetchSessions,
    });
};

export const useSaveSession = () => {
    const queryClient = useQueryClient();
    return useMutation<IWorkoutSession, Error, IWorkoutSession>({
        mutationFn: api.saveCompletedSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
};
