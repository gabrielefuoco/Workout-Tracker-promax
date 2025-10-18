import React, { useEffect, useState, useRef } from 'react';
// FIX: Import Variants type from framer-motion to explicitly type variant objects.
import { motion, Variants, AnimatePresence } from 'framer-motion';
import type { Workout } from '../types';

interface WorkoutListProps {
    workouts: Workout[];
    onSelectWorkout: (id: string) => void;
    onAddWorkout: () => void;
    onOpenSettings: () => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onSelectWorkout, onAddWorkout, onOpenSettings }) => {
    const [currentDate, setCurrentDate] = useState('');
    const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<string[]>([]);
    const pressTimer = useRef<ReturnType<typeof setTimeout>>();
    const isLongPress = useRef(false);

    useEffect(() => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
        setCurrentDate(`Oggi è il ${today.toLocaleDateString('it-IT', options)}`);
    }, []);

    const handlePressStart = (workoutId: string) => {
        isLongPress.current = false;
        pressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            setExpandedWorkoutIds(prevIds => 
                prevIds.includes(workoutId) 
                ? prevIds.filter(id => id !== workoutId) 
                : [...prevIds, workoutId]
            );
        }, 400);
    };

    const handlePressEnd = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }
    };

    const handleClick = (e: React.MouseEvent, workoutId: string) => {
        e.preventDefault();
        if (isLongPress.current) {
            return;
        }

        if (expandedWorkoutIds.includes(workoutId)) {
            setExpandedWorkoutIds(ids => ids.filter(id => id !== workoutId));
        } else {
            onSelectWorkout(workoutId);
        }
    };

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

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
    };

    const headerVariants: Variants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    }
    
    const fabVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25, delay: 0.3 } },
    };
    
    const allExpanded = workouts.length > 0 && expandedWorkoutIds.length === workouts.length;

    const handleToggleAll = () => {
        if (allExpanded) {
            setExpandedWorkoutIds([]); // Collapse all
        } else {
            setExpandedWorkoutIds(workouts.map(w => w.id)); // Expand all
        }
    };

    return (
        <div className="w-full max-w-xl md:max-w-5xl lg:max-w-6xl mx-auto p-8 sm:p-6 min-h-screen pb-24">
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleToggleAll}
                        className="text-2xl text-muted-foreground p-2 rounded-full transition-colors duration-300 hover:text-primary hover:bg-card"
                        title={allExpanded ? 'Comprimi tutto' : 'Espandi tutto'}
                        aria-label={allExpanded ? 'Comprimi tutto' : 'Espandi tutto'}
                    >
                        <AnimatePresence mode="wait">
                            <motion.i
                                key={allExpanded ? 'compress' : 'expand'}
                                className={allExpanded ? "ph ph-arrows-in-simple" : "ph ph-arrows-out-simple"}
                                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            />
                        </AnimatePresence>
                    </button>
                    <button onClick={onOpenSettings} className="text-2xl text-muted-foreground p-2 rounded-full transition-colors duration-300 hover:text-foreground hover:bg-card hover:rotate-45">
                        <i className="ph ph-gear-six"></i>
                    </button>
                </div>
            </motion.header>

            <motion.main 
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
                {workouts.map((workout) => {
                    const { mainName, subName } = parseWorkoutName(workout.name, workout.exercises.length);
                    const lastTrained = getLastTrainedInfo(workout.id);
                    const totalSetGroups = workout.exercises.reduce((sum, ex) => sum + ex.setGroups.length, 0);
                    const exercisesToShow = 3;
                    const isExpanded = expandedWorkoutIds.includes(workout.id);

                    return (
                        <motion.div key={workout.id} variants={cardVariants} className="flex">
                            <a
                              href="#"
                              onMouseDown={() => handlePressStart(workout.id)}
                              onMouseUp={handlePressEnd}
                              onMouseLeave={handlePressEnd}
                              onTouchStart={() => handlePressStart(workout.id)}
                              onTouchEnd={handlePressEnd}
                              onClick={(e) => handleClick(e, workout.id)}
                              onContextMenu={(e) => e.preventDefault()}
                              className="workout-card-link w-full"
                              aria-expanded={isExpanded}
                            >
                                <div className={`workout-card bg-card border border-border rounded-lg p-6 flex flex-col h-full transition-all duration-300 ${isExpanded ? 'scale-[1.02] shadow-2xl shadow-primary/10 border-primary/20' : ''}`}>
                                    {/* Header */}
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

                                    {/* Main Content */}
                                    <div className="flex-grow">
                                        {workout.exercises.length > 0 ? (
                                        <div className="border-t border-border pt-4 mt-4">
                                            <AnimatePresence initial={false}>
                                                <motion.div
                                                    key={isExpanded ? 'expanded' : 'collapsed'}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                {isExpanded ? (
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tutti gli Esercizi</p>
                                                        <ul className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-2">
                                                        {workout.exercises.map(ex => (
                                                            <li key={ex.id} className="text-sm text-foreground flex items-center gap-2">
                                                            <i className="ph-bold ph-dot text-primary text-xs"></i><span className="truncate">{ex.name}</span>
                                                            </li>
                                                        ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Esercizi Principali</p>
                                                        <ul className="flex flex-col gap-2.5">
                                                            {workout.exercises.slice(0, exercisesToShow).map(ex => (
                                                                <li key={ex.id} className="text-sm text-foreground flex items-center gap-2">
                                                                    <i className="ph-bold ph-dot text-primary text-xs"></i><span className="truncate">{ex.name}</span>
                                                                </li>
                                                            ))}
                                                            {workout.exercises.length > exercisesToShow && (
                                                                <li className="text-sm text-muted-foreground flex items-center gap-2">
                                                                    <i className="ph-bold ph-dot text-xs"></i><span>...e altri {workout.exercises.length - exercisesToShow}</span>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                        ) : (
                                            <div className="flex-grow flex items-center justify-center text-center text-muted-foreground min-h-[100px]">
                                                <div className="p-4">
                                                    <i className="ph ph-plus-circle text-4xl mb-2"></i>
                                                    <p>Nessun esercizio.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Stats */}
                                    <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <i className="ph ph-list-bullets"></i>
                                            <span className="font-medium">{workout.exercises.length} Esercizi</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <i className="ph ph-stack"></i>
                                            <span className="font-medium">{totalSetGroups} Serie</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    );
                })}
            </motion.main>

            <motion.button
                onClick={onAddWorkout}
                className="fixed bottom-24 right-6 z-30 w-[60px] h-[60px] bg-gradient-to-br from-primary to-primary-focus rounded-full flex justify-center items-center text-primary-foreground text-3xl shadow-lg"
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