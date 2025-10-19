import { INITIAL_WORKOUT_SESSIONS, INITIAL_WORKOUT_TEMPLATES } from '../constants';
import type { IWorkoutSession, IWorkoutTemplate } from '../src/contracts/workout.types';
import { calculateAggregatedData } from '../utils/sessionUtils';

// Simula la latenza della rete per emulare un ambiente realistico
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Simula un database in-memory utilizzando i dati iniziali
let sessions: IWorkoutSession[] = JSON.parse(JSON.stringify(INITIAL_WORKOUT_SESSIONS));
let templates: IWorkoutTemplate[] = JSON.parse(JSON.stringify(INITIAL_WORKOUT_TEMPLATES));

// --- Operazioni CRUD sui Template ---
export const fetchTemplates = async (): Promise<IWorkoutTemplate[]> => {
  await delay(300);
  return JSON.parse(JSON.stringify(templates));
};

export const addTemplate = async (): Promise<IWorkoutTemplate> => {
  await delay(150);
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
  templates.push(newTemplate);
  return newTemplate;
};

export const updateTemplate = async (updatedTemplate: IWorkoutTemplate): Promise<IWorkoutTemplate> => {
  await delay(150);
  const updated = { ...updatedTemplate, updatedAt: Date.now() };
  templates = templates.map(t => (t.id === updatedTemplate.id ? updated : t));
  return updated;
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
  await delay(250);
  templates = templates.filter(t => t.id !== templateId);
};

// --- Operazioni sulle Sessioni ---
export const fetchSessions = async (): Promise<IWorkoutSession[]> => {
    await delay(400);
    return JSON.parse(JSON.stringify(sessions)).sort((a, b) => b.startTime - a.startTime);
};

export const saveCompletedSession = async (session: IWorkoutSession): Promise<IWorkoutSession> => {
    await delay(600); // Simula il tempo di elaborazione di una Cloud Function

    const performedExercises = session.exercises.filter(ex => ex.sets.length > 0);
    if (performedExercises.length === 0) {
        console.warn("API MOCK: Sessione vuota, salvataggio annullato.");
        return { ...session, status: 'failed', errorMessage: "Cannot save an empty workout." };
    }

    // Simula il calcolo degli aggregati come farebbe il backend
    const aggregatedData = calculateAggregatedData(performedExercises, session.startTime, session.endTime!);

    const finalSession: IWorkoutSession = {
        ...session,
        exercises: performedExercises,
        status: 'completed',
        processedAt: Date.now(),
        aggregatedData,
    };
    sessions = [finalSession, ...sessions.filter(s => s.id !== session.id)];
    return finalSession;
};