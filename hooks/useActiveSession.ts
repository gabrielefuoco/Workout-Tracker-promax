// hooks/useActiveSession.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../lib/api'; // La tua API finta
import { IWorkoutSession, IWorkoutSet } from '../src/contracts/workout.types';

// Nel mondo reale, questa funzione interrogherebbe Firestore per la sessione con endTime === null
async function fetchActiveSession(): Promise<IWorkoutSession | undefined> {
    const sessions = await api.fetchSessions();
    return sessions.find(s => s.status === 'active');
}

export function useActiveSession() {
    const queryClient = useQueryClient();

    const { data: session, isLoading, isError } = useQuery<IWorkoutSession | undefined, Error>({
        queryKey: ['activeSession'],
        queryFn: fetchActiveSession,
        staleTime: Infinity, // Una sessione attiva non diventa "stale"
    });

    const updateSessionMutation = useMutation<IWorkoutSession, Error, IWorkoutSession>({
        mutationFn: async (updatedSession) => {
            // Questa è una simulazione. In un'app reale, faresti l'update su Firestore.
            // Per ora, aggiorniamo la cache di TanStack Query direttamente.
            return updatedSession;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['activeSession'], data);
        },
    });

    const addSetMutation = useMutation<void, Error, { exerciseId: string; set: IWorkoutSet }>({
        mutationFn: async ({ exerciseId, set }) => {
            if (!session) throw new Error("No active session to add a set to.");

            const updatedExercises = session.exercises.map(ex => {
                if (ex.id === exerciseId) {
                    return { ...ex, sets: [...ex.sets, set] };
                }
                return ex;
            });
            
            const updatedSession = { ...session, exercises: updatedExercises };
            updateSessionMutation.mutate(updatedSession);
        },
    });

    return {
        session,
        isLoading,
        isError,
        addSet: addSetMutation.mutate,
        updateSession: updateSessionMutation.mutate,
    };
}
