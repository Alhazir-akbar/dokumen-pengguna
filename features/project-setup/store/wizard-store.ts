import { create } from 'zustand';

export interface UserTypeItem {
  id: string;
  name: string;
  description: string;
}

export interface UserGoalItem {
  id: string;
  userTypeName: string;
  goals: string;
  frustrations: string;
}

export interface EpicItem {
  id: string;
  title: string;
  description: string;
}

export interface NonFunctionalItem {
  id: string;
  category: string;
  description: string;
}

export interface UserStoryItem {
  id: string;
  epicId: string;
  epicTitle: string;
  storyName: string;
  userType: string;
  description: string;
}

interface WizardState {
  step: number;
  teamName: string;
  projectName: string;
  useAi: boolean | null;
  projectType: string | null;
  projectDescription: string;
  platformType: string;
  userTypes: UserTypeItem[];
  userGoals: UserGoalItem[];
  epics: EpicItem[];
  nonFunctionals: NonFunctionalItem[];
  userStories: UserStoryItem[];

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateTeamName: (name: string) => void;
  updateProjectName: (name: string) => void;
  setUseAi: (choice: boolean) => void;
  setProjectType: (type: string) => void;
  setProjectDescription: (desc: string) => void;
  setPlatformType: (platform: string) => void;
  
  addUserType: (item: UserTypeItem) => void;
  removeUserType: (id: string) => void;
  
  updateUserGoal: (userTypeName: string, goals: string, frustrations: string) => void;

  addEpic: (item: EpicItem) => void;
  removeEpic: (id: string) => void;
  
  addNonFunctional: (item: NonFunctionalItem) => void;
  removeNonFunctional: (id: string) => void;
  
  addUserStory: (item: UserStoryItem) => void;
  removeUserStory: (id: string) => void;

  updateEpic: (id: string, updatedData: Partial<EpicItem>) => void;
  resetStore: () => void; // Fungsi untuk mengosongkan data saat mode manual
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 1,
  teamName: '',
  projectName: '',
  useAi: null,
  projectType: null,
  projectDescription: '',
  platformType: 'Web Application',
  
  // Dikosongkan agar mode manual bersih dari awal
  userTypes: [],
  userGoals: [],
  epics: [],
  nonFunctionals: [],
  userStories: [],

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  updateTeamName: (name) => set({ teamName: name }),
  updateProjectName: (name) => set({ projectName: name }),
  setUseAi: (choice: boolean) => set({ useAi: choice }),
  setProjectType: (type: string) => set({ projectType: type }),
  setProjectDescription: (desc: string) => set({ projectDescription: desc }),
  setPlatformType: (platform: string) => set({ platformType: platform }),
  
  addUserType: (item: UserTypeItem) => set((state) => ({ userTypes: [...state.userTypes, item] })),
  removeUserType: (id: string) => set((state) => ({ userTypes: state.userTypes.filter((u) => u.id !== id) })),
  
  updateUserGoal: (userTypeName, goals, frustrations) => set((state) => ({
    userGoals: state.userGoals.map((g) => 
      g.userTypeName === userTypeName ? { ...g, goals, frustrations } : g
    )
  })),

  addEpic: (item: EpicItem) => set((state) => ({ epics: [...state.epics, item] })),
  removeEpic: (id: string) => set((state) => ({ epics: state.epics.filter((e) => e.id !== id) })),
  
  addNonFunctional: (item: NonFunctionalItem) => set((state) => ({ nonFunctionals: [...state.nonFunctionals, item] })),
  removeNonFunctional: (id: string) => set((state) => ({ nonFunctionals: state.nonFunctionals.filter((n) => n.id !== id) })),
  
  addUserStory: (item: UserStoryItem) => set((state) => ({ userStories: [...state.userStories, item] })),
  removeUserStory: (id: string) => set((state) => ({ userStories: state.userStories.filter((s) => s.id !== id) })),

  updateEpic: (id: string, updatedData: Partial<EpicItem>) => set((state) => ({
    epics: state.epics.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
  })),

  resetStore: () => set({
    userTypes: [],
    userGoals: [],
    epics: [],
    nonFunctionals: [],
    userStories: [],
  }),
}));