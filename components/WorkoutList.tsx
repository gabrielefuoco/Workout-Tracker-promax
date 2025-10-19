import React, { useEffect, useState, useRef } from 'react';
// FIX: Import Variants type from framer-motion to explicitly type variant objects.
import { motion, Variants, AnimatePresence } from 'framer-motion';
// FIX: Changed WorkoutTemplate to IWorkoutTemplate to match the exported type.
import type { IWorkoutTemplate } from '../types';

interface WorkoutListProps {
    templates: IWorkoutTemplate[];
    onSelectTemplate: (id: string) => void;
    onAddTemplate: () => void;
    onOpenSettings: () => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ templates, onSelectTemplate, onAddTemplate, onOpenSettings }) => {
    const [currentDate, setCurrentDate] = useState('');
    const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<string[]>([]);
    const pressTimer = useRef<ReturnType<typeof setTimeout>>();
    const isLongPress = useRef(false);

    useEffect(() => {
        const today = new Date();
        // FIX: Replaced `toLocaleDateString` with a more reliable `Intl.DateTimeFormat` to avoid potential environment-specific issues and ensure consistent formatting.
        setCurrentDate(`Oggi è il ${new Intl.DateTimeFormat('it-IT', { year: 'numeric', month: 'long', day: 'numeric' }).format(today)}`);
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
            onSelectTemplate(workoutId);
        }
    };

    const parseWorkoutName = (name: string, exercisesCount: number) => {
        const match = name.match(/^(.*?)\s*\((.*?)\)\s*$/);
        if (match) {
            return { mainName: match[1].trim(), subName: match[2].trim() };
        }
        return { mainName: name, subName: `${exercisesCount} exercises` };
    };

    const getLastTrainedInfo = (workout: IWorkoutTemplate): { text: string; visible: boolean } => {
        if (!workout.lastUsedAt) return { text: '', visible: false };
        const daysAgo = Math.round((Date.now() - workout.lastUsedAt) / (1000 * 60 * 60 * 24));
        if (daysAgo === 0) return { text: 'Today', visible: true };
        if (daysAgo === 1) return { text: 'Yesterday', visible: true };
        return { text: `${daysAgo} days ago`, visible: true };
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
    
    const allExpanded = templates.length > 0 && expandedWorkoutIds.length === templates.length;

    const handleToggleAll = () => {
        if (allExpanded) {
            setExpandedWorkoutIds([]); // Collapse all
        } else {
            setExpandedWorkoutIds(templates.map(w => w.id)); // Expand all
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
                {templates.map((template) => {
                    const { mainName, subName } = parseWorkoutName(template.name, template.exercises.length);
                    const lastTrained = getLastTrainedInfo(template);
                    const totalSets = template.exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
                    const exercisesToShow = 3;
                    const isExpanded = expandedWorkoutIds.includes(template.id);

                    return (
                        <motion.div key={template.id} variants={cardVariants} className="flex">
                            <a
                              href="#"
                              onMouseDown={() => handlePressStart(template.id)}
                              // FIX: Wrapped event handlers in arrow functions to prevent passing event objects to a function that doesn't expect them.
                              onMouseUp={() => handlePressEnd()}
                              onMouseLeave={() => handlePressEnd()}
                              onTouchStart={() => handlePressStart(template.id)}
                              onTouchEnd={() => handlePressEnd()}
                              onClick={(e) => handleClick(e, template.id)}
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
                                        {template.exercises.length > 0 ? (
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
                                                        {template.exercises.map(ex => (
                                                            <li key={ex.exerciseId} className="text-sm text-foreground flex items-center gap-2">
                                                            <i className="ph-bold ph-dot text-primary text-xs"></i><span className="truncate">{ex.name}</span>
                                                            </li>
                                                        ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Esercizi Principali</p>
                                                        <ul className="flex flex-col gap-2.5">
                                                            {template.exercises.slice(0, exercisesToShow).map(ex => (
                                                                <li key={ex.exerciseId} className="text-sm text-foreground flex items-center gap-2">
                                                                    <i className="ph-bold ph-dot text-primary text-xs"></i><span className="truncate">{ex.name}</span>
                                                                </li>
                                                            ))}
                                                            {template.exercises.length > exercisesToShow && (
                                                                <li className="text-sm text-muted-foreground flex items-center gap-2">
                                                                    <i className="ph-bold ph-dot text-xs"></i><span>...e altri {template.exercises.length - exercisesToShow}</span>
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
                                            <span className="font-medium">{template.exercises.length} Esercizi</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <i className="ph ph-stack"></i>
                                            <span className="font-medium">{totalSets} Serie</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    );
                })}
            </motion.main>

            <motion.button
                onClick={onAddTemplate}
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
