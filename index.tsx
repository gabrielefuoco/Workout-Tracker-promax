import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TemplateProvider } from './contexts/WorkoutContext';
import { SessionProvider } from './contexts/SessionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crea un'istanza del client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* Wrappa tutto con il QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TemplateProvider>
          <SessionProvider>
            <App />
          </SessionProvider>
        </TemplateProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);