import React from 'react';
import { motion } from 'framer-motion';
import { useTemplates } from '../contexts/WorkoutContext';
import { ArrowLeftIcon, PencilIcon } from './icons';

interface WorkoutOverviewProps {
  templateId: string;
  onStartTemplate: (id: string) => void;
  onBack: () => void;
  onEdit: (id: string) => void;
}

const WorkoutOverview: React.FC<WorkoutOverviewProps> = ({ templateId, onStartTemplate, onBack, onEdit }) => {
  const { getTemplateById, isLoading } = useTemplates();
  
  if (isLoading) {
    return (
      <div className="p-4 pt-8 text-center min-h-screen flex items-center justify-center">
        <p>Loading workout...</p>
      </div>
    );
  }

  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <div className="p-4 text-center">
        <p>Workout not found.</p>
        <button onClick={onBack} className="mt-4 text-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="p-4 pt-8 text-foreground min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-muted">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-center truncate px-4">{template.name}</h1>
        <button onClick={() => onEdit(template.id)} className="p-2 rounded-full hover:bg-muted">
          <PencilIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="space-y-4 mb-24 pb-4">
        {template.exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            className="bg-card border border-border rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
          >
            <h3 className="font-semibold text-lg">{exercise.name}</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              {exercise.setGroups.map(sg => (
                <li key={sg.id}>{sg.name}: {sg.target}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border">
        <button
          onClick={() => onStartTemplate(template.id)}
          className="w-full py-4 bg-gradient-to-br from-primary to-primary-focus text-primary-foreground font-bold rounded-lg shadow-lg"
        >
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutOverview;