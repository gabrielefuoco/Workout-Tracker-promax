// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dati considerati "fresh" per 5 minuti
      refetchOnWindowFocus: false, // Disabilitato per un'esperienza più stabile
      retry: 2, // 2 tentativi in caso di fallimento
    },
  },
});
