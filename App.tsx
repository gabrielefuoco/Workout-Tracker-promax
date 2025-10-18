import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkouts } from './contexts/WorkoutContext';
import WorkoutOverview from './components/WorkoutOverview';
import FocusMode from './components/FocusMode';
import Modal from './components/Modal';
import SettingsModal from './components/SettingsModal';
import WorkoutList from './components/WorkoutList';

type View = 'list' | 'overview' | 'focus';

const App: React.FC = () => {
  const { workouts, addWorkout } = useWorkouts();
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setCurrentView('overview');
  };
  
  const handleStartWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setCurrentView('focus');
  };

  const handleAddWorkout = () => {
    const newWorkout = addWorkout();
    setSelectedWorkoutId(newWorkout.id);
    setCurrentView('overview');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedWorkoutId(null);
  };
  
  const handleBackToOverview = () => {
    setCurrentView('overview');
  };

  const viewVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const renderContent = () => {
    switch(currentView) {
      case 'focus':
        return selectedWorkoutId ? <FocusMode workoutId={selectedWorkoutId} onFinishWorkout={handleBackToOverview} onExit={handleBackToOverview}/> : null;
      case 'overview':
        return selectedWorkoutId ? <WorkoutOverview workoutId={selectedWorkoutId} onStartWorkout={handleStartWorkout} onBack={handleBackToList} onDeleted={() => handleBackToList()} /> : null;
      case 'list':
      default:
        return (
          <>
            <WorkoutList
              workouts={workouts}
              onSelectWorkout={handleSelectWorkout}
              onAddWorkout={handleAddWorkout}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <AnimatePresence>
                {isSettingsOpen && (
                    <Modal onClose={() => setIsSettingsOpen(false)}>
                        <SettingsModal />
                    </Modal>
                )}
            </AnimatePresence>
          </>
        );
    }
  };

  return (
    <div className="App">
       <AnimatePresence mode="wait">
        <motion.div
          key={currentView + (selectedWorkoutId || '')}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={viewVariants}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;