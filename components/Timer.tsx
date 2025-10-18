import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, TimerFeedback } from '../contexts/ThemeContext';
import { playStartSound, playFinishSound, triggerVibration } from '../utils/feedback';

interface TimerProps {
  initialSeconds: number;
  onFinish?: () => void;
  onSkip?: () => void;
}

const triggerFeedback = (type: TimerFeedback, event: 'start' | 'finish') => {
    const isStart = event === 'start';
    
    if (type === 'sound' || type === 'both') {
        isStart ? playStartSound() : playFinishSound();
    }
    if ((type === 'vibration' || type === 'both') && !isStart) {
        triggerVibration();
    }
};

const Timer: React.FC<TimerProps> = ({ initialSeconds, onFinish, onSkip }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const { timerFeedback } = useTheme();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    triggerFeedback(timerFeedback, 'start');
    
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          triggerFeedback(timerFeedback, 'finish');
          onFinish?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onFinish, timerFeedback, initialSeconds]);
  
  const addTime = (additionalSeconds: number) => {
    setSeconds(prev => prev + additionalSeconds);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / initialSeconds);
  const circumference = 2 * Math.PI * 140; // 140 is the radius

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-background/80 backdrop-blur-lg flex flex-col items-center justify-center z-50 text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.h2 
          className="text-4xl font-bold mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        >
          REST
        </motion.h2>

        <div className="relative w-80 h-80 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 300 300">
                <circle cx="150" cy="150" r="140" className="stroke-muted" strokeWidth="15" fill="transparent" />
                <motion.circle
                    cx="150"
                    cy="150"
                    r="140"
                    className="stroke-primary"
                    strokeWidth="15"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference * (1 - progress) }}
                    animate={{ strokeDashoffset: circumference * (1 - progress) }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </svg>
            <motion.div 
              className="text-7xl font-mono"
              key={seconds}
              initial={{ scale: 1.1, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTime(seconds)}
            </motion.div>
        </div>

        <motion.div 
          className="flex flex-col items-center mt-12 space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        >
          <div className="flex space-x-4">
              <button onClick={() => addTime(15)} className="px-4 py-2 text-lg bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">+15s</button>
              <button onClick={() => addTime(30)} className="px-4 py-2 text-lg bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">+30s</button>
          </div>
          <button onClick={onSkip} className="px-8 py-3 bg-primary/90 text-primary-foreground font-semibold rounded-lg hover:bg-primary/100 transition-colors text-xl">
              Skip Rest
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Timer;