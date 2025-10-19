import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TemplateProvider } from './contexts/WorkoutContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SessionProvider } from './contexts/SessionContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <TemplateProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </TemplateProvider>
    </ThemeProvider>
  </React.StrictMode>
);