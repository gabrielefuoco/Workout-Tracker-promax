import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ITemplateExercise } from '../types';
import { useTemplates } from '../hooks/dataHooks';
import { ArrowLeftIcon, PencilIcon, ChevronRightIcon } from './icons';

// A simple, read-only exercise card for the view-only page
const ViewOnlyExerciseCard: React.FC<{
    exercise: ITemplateExercise;
}> = ({ exercise }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-card rounded-xl border border-border p-4"
    >
        <h3 className="text-lg font-semibold text-foreground">{exercise.name}</h3>
        <div className="mt-3 flex items-center justify-around divide-x divide-border rounded-lg bg-card/50 p-2">
            <div className="text-center flex-1 px-2">
                <div className="text-xs text-muted-foreground">SETS</div>
                <div className="text-2xl font-bold text-foreground">{exercise.targetSets}</div>
            </div>
             <div className="text-center flex-1 px-2">
                <div className="text-xs text-muted-foreground">REPS</div>
                <div className="text-2xl font-bold text-foreground">{exercise.targetReps}</div>
            </div>
            {exercise.targetWeight != null && (
                 <div className="text-center flex-1 px-2">
                    <div className="text-xs text-muted-foreground">WEIGHT</div>
                    <div className="text-2xl font-bold text-foreground">{exercise.targetWeight}<span className="text-base font-normal text-muted-foreground">kg</span></div>
                </div>
            )}
             {exercise.restSeconds != null && (
                 <div className="text-center flex-1 px-2">
                    <div className="text-xs text-muted-foreground">REST</div>
                    <div className="text-2xl font-bold text-foreground">{exercise.restSeconds}<span className="text-base font-normal text-muted-foreground">s</span></div>
                </div>
            )}
        </div>
        {exercise.notes && (
            <div className="mt-3 pt-3 border-t border-border">
                 <p className="text-sm text-muted-foreground italic">{exercise.notes}</p>
            </div>
        )}
    </motion.div>
);

interface WorkoutOverviewProps {
  templateId: string;
  onStartTemplate: (templateId: string) => void;
  onBack: () => void;
  onEdit: (templateId: string) => void;
}

const WorkoutOverview: React.FC<WorkoutOverviewProps> = ({ templateId, onStartTemplate, onBack, onEdit }) => {
    const { data: templates = [], isLoading } = useTemplates();
    const template = templates.find(t => t.id === templateId);

    const renderLoading = () => (
      <div className="bg-background text-foreground min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
        <i className="ph ph-spinner animate-spin text-4xl text-primary"></i>
        <h2 className="text-2xl font-bold mt-4">Caricamento...</h2>
      </div>
    );
    
    if (isLoading) return renderLoading();

    if (!template) {
        return (
          <div className="bg-background text-foreground min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">Workout non trovato.</h2>
            <button onClick={onBack} className="mt-4 px-6 py-2 bg-muted rounded-lg">Go Back</button>
          </div>
        );
    }

    const parseWorkoutName = (name: string) => {
      const match = name.match(/^(.*?)\s*\((.*?)\)\s*$/);
      if (match) {
          return { mainName: match[1].trim(), subName: match[2].trim() };
      }
      return { mainName: name.trim(), subName: '' };
    };

    const { mainName, subName } = parseWorkoutName(template.name);

    return (
        <div className="bg-background text-foreground h-screen flex flex-col">
            <div className="flex-grow overflow-y-auto p-4 md:p-6">
                <header className="flex items-center mb-10 gap-4 max-w-3xl mx-auto">
                    <button onClick={onBack} className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                        <ArrowLeftIcon className="h-7 w-7" />
                    </button>
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold">{mainName}</h1>
                        {subName && <h2 className="text-xl font-semibold text-muted-foreground">{subName}</h2>}
                    </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(template.id)} className="p-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                            <PencilIcon className="h-6 w-6" />
                        </button>
                    </div>
                </header>

                <div className="space-y-4 mb-8 max-w-3xl mx-auto">
                    <AnimatePresence>
                        {template.exercises.map(exercise => (
                            <ViewOnlyExerciseCard
                                key={exercise.exerciseId}
                                exercise={exercise}
                            />
                        ))}
                    </AnimatePresence>
                    {template.exercises.length === 0 && (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-xl bg-card/50">
                            <h3 className="text-lg font-semibold text-foreground">This workout is empty.</h3>
                            <p className="text-muted-foreground mt-2 mb-6">Click the edit button to add exercises.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 p-4 bg-background border-t border-border">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => onStartTemplate(template.id)}
                        className="w-full px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={template.exercises.length === 0}
                    >
                        Start Workout
                        <ChevronRightIcon className="h-6 w-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutOverview;