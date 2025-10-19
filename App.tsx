import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkoutList from './components/WorkoutList';
import WorkoutOverview from './components/WorkoutOverview';
import EditWorkout from './components/EditWorkout';
import FocusMode from './components/FocusMode';
import AnalyticsPage from './components/AnalyticsPage';
import Modal from './components/Modal';
import SettingsModal from './components/SettingsModal';
import BottomNav from './components/BottomNav';
import { useWorkoutTemplates } from './contexts/WorkoutContext';

type WorkoutView = 'list' | 'overview' | 'edit' | 'focus';
type Page = 'workouts' | 'analytics';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('workouts');
  const [currentWorkoutView, setCurrentWorkoutView] = useState<WorkoutView>('list');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { templates, addTemplate } = useWorkoutTemplates();

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setCurrentWorkoutView('overview');
  };
  
  const handleEditTemplate = (id: string) => {
      setSelectedTemplateId(id);
      setCurrentWorkoutView('edit');
  };

  const handleStartTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setCurrentWorkoutView('focus');
  };
  
  const handleAddTemplate = async () => {
      const newTemplate = await addTemplate();
      setSelectedTemplateId(newTemplate.id);
      setCurrentWorkoutView('edit'); // Go directly to edit for a new workout
  }

  const handleBackToList = useCallback(() => {
    setSelectedTemplateId(null);
    setCurrentWorkoutView('list');
  }, []);
  
  const handleDoneEditing = useCallback(() => {
    setCurrentWorkoutView('overview');
  }, []);

  const handleWorkoutDeleted = useCallback(() => {
    setSelectedTemplateId(null);
    setCurrentWorkoutView('list');
  }, []);

  const viewVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  const renderWorkoutContent = () => {
    switch (currentWorkoutView) {
      case 'overview':
        if (!selectedTemplateId) return null;
        return (
            <WorkoutOverview
              templateId={selectedTemplateId}
              onStartTemplate={handleStartTemplate}
              onBack={handleBackToList}
              onEdit={handleEditTemplate}
            />
        );
      case 'edit':
        if (!selectedTemplateId) return null;
        return (
            <EditWorkout
              templateId={selectedTemplateId}
              onDone={handleDoneEditing}
              onDeleted={handleWorkoutDeleted}
            />
        );
      case 'focus':
        if (!selectedTemplateId) return null;
        return (
            <FocusMode
              templateId={selectedTemplateId}
              onFinishWorkout={handleBackToList}
              onExit={handleBackToList}
            />
        );
      case 'list':
      default:
        return (
            <WorkoutList
              templates={templates}
              onSelectTemplate={handleSelectTemplate}
              onAddTemplate={handleAddTemplate}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
        );
    }
  };

  const renderPage = () => {
    switch (currentPage) {
        case 'analytics':
            return <AnalyticsPage onOpenSettings={() => setIsSettingsOpen(true)} />;
        case 'workouts':
        default:
            return renderWorkoutContent();
    }
  }

  const showBottomNav = currentPage === 'analytics' || (currentPage === 'workouts' && currentWorkoutView === 'list');

  return (
    <div className="App">
       <AnimatePresence mode="wait">
        <motion.div
          key={currentPage === 'workouts' ? currentWorkoutView : currentPage}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={viewVariants}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
       
       <AnimatePresence>
            {isSettingsOpen && (
                <Modal onClose={() => setIsSettingsOpen(false)}>
                    <SettingsModal />
                </Modal>
            )}
       </AnimatePresence>
       
       {showBottomNav && <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />}

    </div>
  );
};

export default App;
