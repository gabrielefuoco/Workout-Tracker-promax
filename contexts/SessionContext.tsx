import React, { createContext, useContext, ReactNode, useState } from 'react';
import type { IWorkoutSession } from '../types';
import { INITIAL_WORKOUT_SESSIONS } from '../constants';

interface SessionContextType {
  sessions: IWorkoutSession[];
  addSession: (session: IWorkoutSession) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<IWorkoutSession[]>(INITIAL_WORKOUT_SESSIONS);

  const addSession = async (session: IWorkoutSession) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    setSessions(prevSessions => [session, ...prevSessions]);
  };

  const value = {
    sessions,
    addSession,
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
