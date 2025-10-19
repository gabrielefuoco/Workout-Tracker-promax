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
import type { IWorkoutSession, ISessionExercise, IWorkoutTemplate } from './types';

type WorkoutView = 'list' | 'overview' | 'edit' | 'focus';
type Page = 'workouts' | 'analytics';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('workouts');
  const [currentWorkoutView, setCurrentWorkoutView] = useState<WorkoutView>('list');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Stato centralizzato per la sessione di allenamento attiva.
  const [activeSession, setActiveSession] = useState<IWorkoutSession | null>(null);

  const { data: templates } = useTemplates();
  const saveSessionMutation = useSaveSession();

  const handleNavigateToList = useCallback(() => {
    setSelectedTemplateId(null);
    setCurrentWorkoutView('list');
  }, []);
  
  const addTemplateMutation = useAddTemplate((newTemplate) => {
    setSelectedTemplateId(newTemplate.id);
    setCurrentWorkoutView('edit');
  });

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setCurrentWorkoutView('overview');
  };
  
  const handleEditTemplate = (id: string) => {
      setSelectedTemplateId(id);
      setCurrentWorkoutView('edit');
  };

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

    setActiveSession(newSession);
    setSelectedTemplateId(template.id);
    setCurrentWorkoutView('focus');
  };
  
  const handleAddTemplate = () => {
    addTemplateMutation.mutate();
  }
  
  const handleDoneEditing = useCallback(() => {
    setCurrentWorkoutView('overview');
  }, []);

  const handleWorkoutDeleted = useCallback(() => {
    setSelectedTemplateId(null);
    setCurrentWorkoutView('list');
  }, []);
  
  const handleFinishWorkout = useCallback(async (finalSession: IWorkoutSession) => {
      await saveSessionMutation.mutateAsync(finalSession);
      setActiveSession(null);
      handleNavigateToList();
  }, [saveSessionMutation, handleNavigateToList]);

  const handleExitFocusMode = useCallback(() => {
    if (activeSession && activeSession.exercises.some(e => e.sets.length > 0)) {
        if (!window.confirm("Attenzione: i progressi non salvati andranno persi. Uscire comunque?")) {
            return;
        }
    }
    setActiveSession(null);
    handleNavigateToList();
  }, [activeSession, handleNavigateToList]);

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
              onBack={handleNavigateToList}
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
        if (!selectedTemplateId || !activeSession) return null;
        const template = templates?.find(t => t.id === selectedTemplateId);
        if (!template) {
            // Potrebbe accadere se i dati dei template non sono ancora stati caricati.
            // In un'app più complessa, qui si gestirebbe uno stato di caricamento.
            return null; 
        }
        return (
            <FocusMode
              key={activeSession.id}
              template={template}
              activeSession={activeSession}
              onSessionUpdate={setActiveSession}
              onFinishWorkout={handleFinishWorkout}
              onExit={handleExitFocusMode}
            />
        );
      case 'list':
      default:
        return (
            <WorkoutList
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