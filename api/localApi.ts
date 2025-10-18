import { IWorkoutSession, WorkoutTemplate, PerformedSet } from '../types';
import { INITIAL_SESSIONS, INITIAL_TEMPLATES } from '../constants';

// Funzione helper per simulare un ritardo di rete
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API per i TEMPLATE (WorkoutTemplate) ---

export const fetchTemplates = async (): Promise<WorkoutTemplate[]> => {
    await sleep(500); // Simula latenza
    const templates = localStorage.getItem('templates');
    if (templates) {
        return JSON.parse(templates);
    }
    // Initialize if empty
    localStorage.setItem('templates', JSON.stringify(INITIAL_TEMPLATES));
    return INITIAL_TEMPLATES;
};

export const addTemplateAPI = async (newTemplate: WorkoutTemplate): Promise<WorkoutTemplate> => {
    await sleep(150);
    const templates = await fetchTemplates();
    const newTemplates = [...templates, newTemplate];
    localStorage.setItem('templates', JSON.stringify(newTemplates));
    return newTemplate;
};

export const updateTemplateAPI = async (updatedTemplate: WorkoutTemplate): Promise<WorkoutTemplate> => {
    await sleep(150);
    const templates = await fetchTemplates();
    const newTemplates = templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t);
    localStorage.setItem('templates', JSON.stringify(newTemplates));
    return updatedTemplate;
};

export const deleteTemplateAPI = async (templateId: string): Promise<string> => {
    await sleep(200);
    const templates = await fetchTemplates();
    const newTemplates = templates.filter(t => t.id !== templateId);
    localStorage.setItem('templates', JSON.stringify(newTemplates));
    return templateId;
};

type UpdateTemplateSetPayload = {
  templateId: string;
  exerciseId: string;
  setGroupId: string;
  setId: string;
  updates: Partial<PerformedSet>;
};

export const updateTemplateSetAPI = async (payload: UpdateTemplateSetPayload): Promise<WorkoutTemplate> => {
    await sleep(50); // Fast mutation
    const { templateId, exerciseId, setGroupId, setId, updates } = payload;
    
    // It's faster to read directly than calling fetchTemplates which has a sleep
    const templatesJSON = localStorage.getItem('templates');
    const templates: WorkoutTemplate[] = templatesJSON ? JSON.parse(templatesJSON) : [];

    let updatedTemplate: WorkoutTemplate | undefined;

    const newTemplates = templates.map(template => {
        if (template.id !== templateId) return template;
        
        updatedTemplate = {
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
        };
        return updatedTemplate;
    });

    localStorage.setItem('templates', JSON.stringify(newTemplates));
    if (!updatedTemplate) throw new Error("Template not found for set update");
    return updatedTemplate;
}


// --- API per le SESSIONI (IWorkoutSession) ---

export const fetchSessions = async (): Promise<IWorkoutSession[]> => {
    await sleep(700);
    const sessions = localStorage.getItem('sessions');
    if (sessions) {
        return JSON.parse(sessions);
    }
    localStorage.setItem('sessions', JSON.stringify(INITIAL_SESSIONS));
    return INITIAL_SESSIONS;
};

export const saveSession = async (newSession: IWorkoutSession): Promise<IWorkoutSession> => {
    await sleep(250);
    const sessionsJSON = localStorage.getItem('sessions');
    const sessions: IWorkoutSession[] = sessionsJSON ? JSON.parse(sessionsJSON) : [];
    const newSessions = [newSession, ...sessions];
    localStorage.setItem('sessions', JSON.stringify(newSessions));
    return newSession;
};