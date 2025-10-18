import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSessions, saveSession } from '../api/localApi';
import type { IWorkoutSession } from '../types';

interface SessionContextType {
  sessions: IWorkoutSession[];
  isLoading: boolean;
  addSession: (session: IWorkoutSession) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery<IWorkoutSession[]>({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  });

  const addMutation = useMutation({
    mutationFn: saveSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const value = {
    sessions,
    isLoading,
    addSession: addMutation.mutate,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
};