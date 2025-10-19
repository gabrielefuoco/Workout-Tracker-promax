// src/stores/navigationStore.ts
import { create } from 'zustand';

type Page = 'workouts' | 'analytics';
type WorkoutView = 'list' | 'overview' | 'edit' | 'focus';

interface NavigationState {
  currentPage: Page;
  currentWorkoutView: WorkoutView;
  selectedTemplateId: string | null;
  navigateTo: (page: Page) => void;
  selectTemplate: (id: string) => void;
  editTemplate: (id: string) => void;
  startWorkout: (id: string) => void;
  navigateToList: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'workouts',
  currentWorkoutView: 'list',
  selectedTemplateId: null,
  navigateTo: (page) => set({ currentPage: page, currentWorkoutView: 'list', selectedTemplateId: null }),
  selectTemplate: (id) => set({ currentWorkoutView: 'overview', selectedTemplateId: id }),
  editTemplate: (id) => set({ currentWorkoutView: 'edit', selectedTemplateId: id }),
  startWorkout: (id) => set({ currentWorkoutView: 'focus', selectedTemplateId: id }),
  navigateToList: () => set({ currentWorkoutView: 'list', selectedTemplateId: null }),
}));
