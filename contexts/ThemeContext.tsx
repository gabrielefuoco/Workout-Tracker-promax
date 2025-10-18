import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export type Theme = 'light' | 'dark';
export type TimerFeedback = 'sound' | 'vibration' | 'both' | 'none';

export interface AccentColor {
    name: string;
    primary: string; // HSL string "H S% L%"
    primaryFocus: string;
    accentGlowEnd: string;
}

export const ACCENT_COLORS: AccentColor[] = [
    { name: 'Sky', primary: '199 92% 60%', primaryFocus: '204 84% 47%', accentGlowEnd: '263 91% 63%' },
    { name: 'Rose', primary: '347 90% 61%', primaryFocus: '347 81% 54%', accentGlowEnd: '26 95% 56%' },
    { name: 'Green', primary: '142 71% 45%', primaryFocus: '142 66% 38%', accentGlowEnd: '160 84% 39%' },
    { name: 'Violet', primary: '263 91% 63%', primaryFocus: '263 80% 55%', accentGlowEnd: '310 90% 60%' },
    { name: 'Gold', primary: '45 96% 52%', primaryFocus: '45 90% 45%', accentGlowEnd: '35 95% 55%' },
];


interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  timerFeedback: TimerFeedback;
  setTimerFeedback: (feedback: TimerFeedback) => void;
}
 
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [accentColor, setAccentColor] = useLocalStorage<AccentColor>('accent-color', ACCENT_COLORS[0]);
  const [timerFeedback, setTimerFeedback] = useLocalStorage<TimerFeedback>('timer-feedback', 'sound');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    root.style.setProperty('--color-primary', accentColor.primary);
    root.style.setProperty('--color-primary-focus', accentColor.primaryFocus);
    root.style.setProperty('--color-accent-glow-end', accentColor.accentGlowEnd);
  }, [theme, accentColor]);

  const value = { theme, setTheme, accentColor, setAccentColor, timerFeedback, setTimerFeedback };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};