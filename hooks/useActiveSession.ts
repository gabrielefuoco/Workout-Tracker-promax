import useLocalStorage from './useLocalStorage';
import type { IWorkoutSession } from '../types';

/**
 * Hook per gestire la sessione di allenamento attiva, persistendola su localStorage.
 * Questo assicura che il progresso dell'allenamento non vada perso in caso di ricaricamento della pagina.
 */
export function useActiveSession() {
  const [activeSession, setActiveSession] = useLocalStorage<IWorkoutSession | null>('activeWorkoutSession', null);

  // L'hook restituisce lo stato della sessione e la sua funzione di aggiornamento.
  // Questo permette al componente che lo utilizza (FocusMode) di gestire la sua
  // logica di stato direttamente, rendendo l'integrazione più semplice e
  // sostituendo `useState` senza dover refattorizzare tutta la logica di aggiornamento.

  return { activeSession, setActiveSession };
}
