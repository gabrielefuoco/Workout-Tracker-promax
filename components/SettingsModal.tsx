import React from 'react';
import { useTheme, TimerFeedback, ACCENT_COLORS, Theme } from '../contexts/ThemeContext';

const feedbackOptions: { name: string, value: TimerFeedback }[] = [
    { name: 'Sound', value: 'sound' },
    { name: 'Vibrate', value: 'vibration' },
    { name: 'Both', value: 'both' },
    { name: 'None', value: 'none' },
];

const themeOptions: { name: string, value: Theme }[] = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
];

const SettingsModal: React.FC = () => {
  const { theme, setTheme, accentColor, setAccentColor, timerFeedback, setTimerFeedback } = useTheme();

  return (
    <div className="text-card-foreground">
      <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
      
      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Theme</h3>
            <div className="grid grid-cols-2 gap-3">
                {themeOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`py-2 rounded-md text-sm font-semibold transition-colors ${theme === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        {option.name}
                    </button>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Accent Color</h3>
            <div className="flex flex-wrap gap-4 justify-center">
                {ACCENT_COLORS.map(color => (
                    <button
                        key={color.name}
                        onClick={() => setAccentColor(color)}
                        className={`w-9 h-9 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card ${accentColor.name === color.name ? 'ring-2 ring-foreground' : 'ring-2 ring-transparent'}`}
                        style={{ backgroundColor: `hsl(${color.primary})` }}
                        aria-label={`Set accent color to ${color.name}`}
                    />
                ))}
            </div>
        </div>

        <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Timer Feedback</h3>
            <div className="grid grid-cols-2 gap-3">
                {feedbackOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setTimerFeedback(option.value)}
                        className={`py-2 rounded-md text-sm font-semibold transition-colors ${timerFeedback === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        {option.name}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;