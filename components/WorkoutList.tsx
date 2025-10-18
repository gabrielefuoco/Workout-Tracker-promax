import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkoutTemplate } from '../types';
import { PlusIcon, Cog6ToothIcon } from './icons';

interface WorkoutListProps {
  templates: WorkoutTemplate[];
  isLoading: boolean;
  onSelectTemplate: (id: string) => void;
  onAddTemplate: () => void;
  onOpenSettings: () => void;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-muted rounded w-1/2"></div>
  </div>
);

const WorkoutList: React.FC<WorkoutListProps> = ({ templates, isLoading, onSelectTemplate, onAddTemplate, onOpenSettings }) => {
  return (
    <div className="p-4 pt-8 text-foreground min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Workouts</h1>
        <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-muted">
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="space-y-4 pb-24">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <AnimatePresence>
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onSelectTemplate(template.id)}
                className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
              >
                <h2 className="font-bold text-lg">{template.name}</h2>
                <p className="text-sm text-muted-foreground">{template.exercises.length} exercises</p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <motion.button
        onClick={onAddTemplate}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-primary to-primary-focus rounded-full flex justify-center items-center text-primary-foreground shadow-lg"
        aria-label="Add new workout"
        variants={{
          hidden: { scale: 0, y: 50 },
          visible: { scale: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <PlusIcon className="h-8 w-8" />
      </motion.button>
    </div>
  );
};

export default WorkoutList;