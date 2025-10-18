import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { INITIAL_SESSIONS } from '../constants';
import type { IWorkoutSession } from '../types';

interface SessionContextType {
  sessions: IWorkoutSession[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions] = useLocalStorage<IWorkoutSession[]>('sessions', INITIAL_SESSIONS);

  const value = {
    sessions,
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