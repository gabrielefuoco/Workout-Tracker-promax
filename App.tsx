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
import { useTemplates, useAddTemplate, useStartSession } from './hooks/dataHooks';
import type { IWorkoutTemplate } from './src/contracts/workout.types';
import { useNavigationStore } from './src/stores/navigationStore';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const App: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { currentPage, currentWorkoutView, selectedTemplateId, navigateTo, selectTemplate, editTemplate, startWorkout, navigateToList } = useNavigationStore();
  const setCurrentPage = navigateTo;
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { data: templates } = useTemplates();
  
  const addTemplateMutation = useAddTemplate((newTemplate) => {
    editTemplate(newTemplate.id);
  });

  const startSessionMutation = useStartSession(startWorkout);

  const handleStartTemplate = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (!template) return;
    startSessionMutation.mutate(template);
  };
  
  const handleAddTemplate = () => {
    addTemplateMutation.mutate();
  }
  
  const handleExitFocusMode = useCallback(() => {
    // TODO: Aggiungere una mutation per scartare la sessione
    navigateToList();
  }, [navigateToList]);

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
              onBack={navigateToList}
              onEdit={editTemplate}
            />
        );
      case 'edit':
        if (!selectedTemplateId) return null;
        return (
            <EditWorkout
              templateId={selectedTemplateId}
              onDone={() => selectedTemplateId && selectTemplate(selectedTemplateId)}
              onDeleted={navigateToList}
            />
        );
      case 'focus':
        if (!selectedTemplateId) return null;
        const template = templates?.find(t => t.id === selectedTemplateId);
        if (!template) {
            return null; 
        }
        return (
            <FocusMode
              template={template}
              onFinishWorkout={navigateToList}
              onExit={handleExitFocusMode}
            />
        );
      case 'list':
      default:
        return (
            <WorkoutList
              onSelectTemplate={selectTemplate}
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
       <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="bg-destructive text-destructive-foreground text-center p-2 text-sm font-semibold"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            Offline: I tuoi progressi sono salvati localmente.
          </motion.div>
        )}
      </AnimatePresence>
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