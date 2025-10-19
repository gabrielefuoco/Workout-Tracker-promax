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
import { useTemplates, useAddTemplate, useSaveSession } from './hooks/dataHooks';
import type { IWorkoutSession, ISessionExercise, IWorkoutTemplate } from './src/contracts/workout.types';
import { useNavigationStore } from './src/stores/navigationStore';
import { useQueryClient } from '@tanstack/react-query';

const App: React.FC = () => {
  const { currentPage, currentWorkoutView, selectedTemplateId, navigateTo, selectTemplate, editTemplate, startWorkout, navigateToList } = useNavigationStore();
  const setCurrentPage = navigateTo;
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { data: templates } = useTemplates();
  const saveSessionMutation = useSaveSession();
  
  const addTemplateMutation = useAddTemplate((newTemplate) => {
    editTemplate(newTemplate.id);
  });

  const handleStartTemplate = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (!template) return;

    const startTime = Date.now();
    const sessionExercises: ISessionExercise[] = template.exercises.map((ex) => ({
      id: `sess-ex-${ex.exerciseId}-${startTime}`,
      exerciseId: ex.exerciseId,
      name: ex.name,
      order: ex.order,
      notes: ex.notes,
      sets: [],
    }));

    const newSession: IWorkoutSession = {
      id: `session-${startTime}`,
      name: template.name,
      startTime: startTime,
      endTime: null,
      status: 'active',
      exercises: sessionExercises,
      aggregatedData: null,
    };

    // Imposta la nuova sessione direttamente nella cache di TanStack Query
    queryClient.setQueryData(['activeSession'], newSession);
    startWorkout(template.id);
  };
  
  const handleAddTemplate = () => {
    addTemplateMutation.mutate();
  }
  
  const handleFinishWorkout = useCallback(async (finalSession: IWorkoutSession) => {
      await saveSessionMutation.mutateAsync(finalSession);
      // Invalida la query per pulire la sessione attiva dalla cache
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
      navigateToList();
  }, [saveSessionMutation, navigateToList, queryClient]);

  const handleExitFocusMode = useCallback(() => {
    // Pulisce la sessione attiva dalla cache (equivale a scartarla)
    queryClient.setQueryData(['activeSession'], undefined);
    navigateToList();
  }, [queryClient, navigateToList]);

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
              onFinishWorkout={handleFinishWorkout}
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