// src/hooks/dataHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../lib/api';
import { IWorkoutTemplate, IWorkoutSession, IWorkoutSet } from '../src/contracts/workout.types';

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
        onSuccess: (updatedTemplate) => {
            // Aggiorna selettivamente la cache per un'esperienza più fluida
            queryClient.setQueryData(['templates'], (oldData: IWorkoutTemplate[] | undefined) =>
                oldData?.map(t => t.id === updatedTemplate.id ? updatedTemplate : t) ?? []
            );
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

// Hook per recuperare la sessione attiva
export function useActiveSession() {
    return useQuery<IWorkoutSession | undefined, Error>({
        queryKey: ['activeSession'],
        queryFn: api.fetchActiveSession,
        staleTime: Infinity, // Una sessione attiva non diventa "stale"
    });
}

// Hook per iniziare una nuova sessione
export function useStartSession(onSuccessCallback: (templateId: string) => void) {
    const queryClient = useQueryClient();
    return useMutation<IWorkoutSession, Error, IWorkoutTemplate>({
        mutationFn: api.startSessionFromTemplate,
        onSuccess: (newSession, template) => {
            queryClient.setQueryData(['activeSession'], newSession);
            onSuccessCallback(template.id);
        },
    });
}

// Hook per aggiungere un set
export function useAddSet() {
    const queryClient = useQueryClient();
    return useMutation<IWorkoutSession, Error, { exerciseId: string; set: IWorkoutSet }>({
        mutationFn: api.addSetToActiveSession,
        onSuccess: (updatedSession) => {
            // Aggiorna la cache con la sessione modificata ricevuta dal server
            queryClient.setQueryData(['activeSession'], updatedSession);
        },
    });
}

// Hook per terminare una sessione
export function useFinishSession(onSuccessCallback: () => void) {
    const queryClient = useQueryClient();
    return useMutation<IWorkoutSession, Error, IWorkoutSession>({
        mutationFn: api.finishSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeSession'] });
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            onSuccessCallback();
        },
    });
}