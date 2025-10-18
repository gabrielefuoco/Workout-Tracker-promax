import React, { useEffect, useState } from 'react';
// FIX: Import Variants type from framer-motion to explicitly type variant objects.
import { motion, Variants } from 'framer-motion';
import type { Workout } from '../types';

interface WorkoutListProps {
    workouts: Workout[];
    onSelectWorkout: (id: string) => void;
    onAddWorkout: () => void;
    onOpenSettings: () => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onSelectWorkout, onAddWorkout, onOpenSettings }) => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
        setCurrentDate(`Oggi è il ${today.toLocaleDateString('it-IT', options)}`);
    }, []);

    const parseWorkoutName = (name: string, exercisesCount: number) => {
        const match = name.match(/^(.*?)\s*\((.*?)\)\s*$/);
        if (match) {
            return { mainName: match[1].trim(), subName: match[2].trim() };
        }
        return { mainName: name, subName: `${exercisesCount} exercises` };
    };

    const getLastTrainedInfo = (workoutId: string): { text: string; visible: boolean } => {
        if (workoutId === 'workout-1') return { text: '2 giorni fa', visible: true };
        if (workoutId === 'workout-2') return { text: '4 giorni fa', visible: true };
        return { text: '', visible: false };
    };

    const gridVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };

    // FIX: Explicitly type cardVariants with Variants to fix type inference issues.
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
    };

    // FIX: Explicitly type headerVariants with Variants to fix type inference issues.
    const headerVariants: Variants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    }
    
    // FIX: Explicitly type fabVariants with Variants to fix type inference issues.
    const fabVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25, delay: 0.3 } },
    };

    return (
        <div className="w-full max-w-[600px] mx-auto p-8 sm:p-6 min-h-screen">
            <motion.header 
              className="flex justify-between items-center mb-10"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
            >
                <div className="flex items-center gap-4">
                    <div className="text-5xl text-primary leading-none">
                        <i className="ph-fill ph-user-circle"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">Ciao!</h1>
                        <p className="text-sm text-muted-foreground font-medium">{currentDate}</p>
                    </div>
                </div>
                <button onClick={onOpenSettings} className="text-2xl text-muted-foreground p-2 rounded-full transition-colors duration-300 hover:text-foreground hover:bg-card hover:rotate-45">
                    <i className="ph ph-gear-six"></i>
                </button>
            </motion.header>

            <motion.main 
              className="grid grid-cols-1 gap-5"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
                {workouts.map((workout) => {
                    const { mainName, subName } = parseWorkoutName(workout.name, workout.exercises.length);
                    const lastTrained = getLastTrainedInfo(workout.id);
                    return (
                        <motion.div key={workout.id} variants={cardVariants}>
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); onSelectWorkout(workout.id); }}
                              className="workout-card-link"
                            >
                                <div className="workout-card bg-card border border-border rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold mb-1">{mainName}</h2>
                                            <p className="text-sm font-medium text-muted-foreground">{subName}</p>
                                        </div>
                                        {lastTrained.visible && (
                                            <div className="text-xs font-semibold text-accent-gold flex items-center gap-1.5 flex-shrink-0 bg-accent-gold/10 px-2 py-1 rounded-md">
                                                <i className="ph-fill ph-clock"></i>
                                                <span>{lastTrained.text}</span>
                                            </div>
                                        )}
                                    </div>
                                    {workout.exercises.length > 0 && (
                                      <div className="border-t border-border pt-4 mt-4">
                                          <ul className="flex flex-col gap-2">
                                              {workout.exercises.slice(0, 2).map(ex => (
                                                  <li key={ex.id} className="text-sm text-muted-foreground flex items-center gap-2">
                                                      <i className="ph-bold ph-dot text-xs"></i><span>{ex.name}</span>
                                                  </li>
                                              ))}
                                              {workout.exercises.length > 2 && (
                                                  <li className="text-sm text-muted-foreground flex items-center gap-2">
                                                      <i className="ph-bold ph-dot text-xs"></i><span>...e altri {workout.exercises.length - 2}</span>
                                                  </li>
                                              )}
                                          </ul>
                                      </div>
                                    )}
                                </div>
                            </a>
                        </motion.div>
                    );
                })}
            </motion.main>

            <motion.button
                onClick={onAddWorkout}
                className="fixed bottom-6 right-6 w-[60px] h-[60px] bg-gradient-to-br from-primary to-primary-focus rounded-full flex justify-center items-center text-primary-foreground text-3xl shadow-lg"
                style={{ boxShadow: '0 8px 25px -8px hsl(var(--color-primary))' }}
                variants={fabVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
            >
                <i className="ph ph-plus"></i>
            </motion.button>
        </div>
    );
};

export default WorkoutList;