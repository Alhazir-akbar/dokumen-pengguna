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

// Perbarui tipe projectType agar mendukung 'generate', 'translate', dan 'example'
export type ProjectTypeEnum = 'generate' | 'translate' | 'example' | null;

interface WizardState {
  step: number;
  teamName: string;
  projectName: string;
  useAi: boolean | null;
  projectType: ProjectTypeEnum;
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
  setProjectType: (type: ProjectTypeEnum) => void;
  setProjectDescription: (desc: string) => void;
  setPlatformType: (platform: string) => void;
  
  addUserType: (item: UserTypeItem) => void;
  removeUserType: (id: string) => void;
  updateUserTypeDescription: (id: string, description: string) => void;
  
  updateUserGoal: (userTypeName: string, goals: string, frustrations: string) => void;

  addEpic: (item: EpicItem) => void;
  removeEpic: (id: string) => void;
  
  addNonFunctional: (item: NonFunctionalItem) => void;
  removeNonFunctional: (id: string) => void;
  
  addUserStory: (item: UserStoryItem) => void;
  removeUserStory: (id: string) => void;

  updateEpic: (id: string, updatedData: Partial<EpicItem>) => void;
  resetStore: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 1,
  teamName: '',
  projectName: '',
  useAi: null,
  projectType: null,
  projectDescription: '',
  platformType: 'Web Application',
  
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
  setProjectType: (type: ProjectTypeEnum) => set({ projectType: type }),
  setProjectDescription: (desc: string) => set({ projectDescription: desc }),
  setPlatformType: (platform: string) => set({ platformType: platform }),
  
  addUserType: (item: UserTypeItem) => set((state) => ({ userTypes: [...state.userTypes, item] })),
  removeUserType: (id: string) => set((state) => ({ userTypes: state.userTypes.filter((u) => u.id !== id) })),
  updateUserTypeDescription: (id: string, description: string) => set((state) => ({
    userTypes: state.userTypes.map((ut) =>
      ut.id === id ? { ...ut, description } : ut
    ),
  })),
  
  updateUserGoal: (userTypeName, goals, frustrations) => set((state) => {
    const existingGoalIndex = state.userGoals.findIndex((g) => g.userTypeName === userTypeName);
    
    if (existingGoalIndex !== -1) {
      const updatedGoals = [...state.userGoals];
      updatedGoals[existingGoalIndex] = { ...updatedGoals[existingGoalIndex], goals, frustrations };
      return { userGoals: updatedGoals };
    } else {
      return { 
        userGoals: [
          ...state.userGoals, 
          { id: Date.now().toString(), userTypeName, goals, frustrations }
        ] 
      };
    }
  }),

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
    step: 1,
    teamName: '',
    projectName: '',
    useAi: null,
    projectType: null,
    projectDescription: '',
    platformType: 'Web Application',
    userTypes: [],
    userGoals: [],
    epics: [],
    nonFunctionals: [],
    userStories: [],
  }),
}));