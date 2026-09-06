// features/project-setup/store/wizard-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { projectApi } from '@/services/projectsApi';
import { workspaceApi } from '@/services/workspaceApi';

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

<<<<<<< HEAD
=======
// Perbarui tipe projectType agar mendukung 'generate', 'translate', dan 'example'
>>>>>>> origin/dev
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
  projectId: number | null;
  isCreatingProject: boolean;
  workspaceId: number | null;
  isCreatingWorkspace: boolean;

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
<<<<<<< HEAD
=======
  
>>>>>>> origin/dev
  updateUserGoal: (userTypeName: string, goals: string, frustrations: string) => void;

  addEpic: (item: EpicItem) => void;
  removeEpic: (id: string) => void;
  updateEpic: (id: string, updatedData: Partial<EpicItem>) => void;
<<<<<<< HEAD

  createWorkspaceIfNeeded: (token: string) => Promise<number | null>;
  createProjectIfNeeded: (token: string) => Promise<number | null>;
  generateAIRequirements: (projectId: number, token: string) => Promise<boolean>;
  resetStore: () => void;
}

const getValidToken = (token?: string): string => {
  return token || localStorage.getItem('token') || localStorage.getItem('access_token') || '';
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get: any) => ({
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
      projectId: null,
      isCreatingProject: false,
      workspaceId: null,
      isCreatingWorkspace: false,
=======
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
>>>>>>> origin/dev

      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

      updateTeamName: (name) => set({ teamName: name }),
      updateProjectName: (name) => set({ projectName: name }),
      setUseAi: (choice) => set({ useAi: choice }),
      setProjectType: (type) => set({ projectType: type }),
      setProjectDescription: (desc) => set({ projectDescription: desc }),
      setPlatformType: (platform) => set({ platformType: platform }),

<<<<<<< HEAD
      addUserType: (item) => set((state) => ({ userTypes: [...state.userTypes, item] })),
      removeUserType: (id) => set((state) => ({ userTypes: state.userTypes.filter((u) => u.id !== id) })),
      updateUserTypeDescription: (id, description) => set((state) => ({
        userTypes: state.userTypes.map((ut) => ut.id === id ? { ...ut, description } : ut)
      })),

      updateUserGoal: (userTypeName, goals, frustrations) => set((state) => {
        const existingIndex = state.userGoals.findIndex((g: any) => g.userTypeName === userTypeName);
        if (existingIndex !== -1) {
          const updated = [...state.userGoals];
          updated[existingIndex] = { ...updated[existingIndex], goals, frustrations };
          return { userGoals: updated };
        } else {
          return {
            userGoals: [...state.userGoals, { id: Date.now().toString(), userTypeName, goals, frustrations }]
          };
        }
      }),

      addEpic: (item) => set((state) => ({ epics: [...state.epics, item] })),
      removeEpic: (id) => set((state) => ({ epics: state.epics.filter((e) => e.id !== id) })),
      updateEpic: (id, updatedData) => set((state) => ({
        epics: state.epics.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
      })),

      createWorkspaceIfNeeded: async (token: string) => {
        const activeToken = getValidToken(token);
        if (!activeToken) throw new Error('Token tidak ditemukan.');

        const existingId = get().workspaceId;
        if (existingId) return existingId;

        const teamName = get().teamName?.trim() || 'Workspace Utama';
        set({ isCreatingWorkspace: true });

        try {
          const newWs = await workspaceApi.createWorkspace({ name: teamName }, activeToken);
          set({ workspaceId: newWs.id, isCreatingWorkspace: false });
          return newWs.id;
        } catch (error) {
          console.error('Gagal membuat workspace:', error);
          set({ isCreatingWorkspace: false });
          return null;
        }
      },

      createProjectIfNeeded: async (token: string) => {
        const activeToken = getValidToken(token);
        if (!activeToken) throw new Error('Token tidak ditemukan.');
        if (get().projectId) return get().projectId;

        set({ isCreatingProject: true });
        try {
          let activeWorkspaceId = get().workspaceId;
          if (!activeWorkspaceId) {
            const myWorkspaces = await workspaceApi.getMyWorkspaces(activeToken);
            if (!myWorkspaces || myWorkspaces.length === 0) {
              const newWs = await workspaceApi.createWorkspace({ name: get().teamName || 'Workspace Utama' }, activeToken);
              activeWorkspaceId = newWs.id;
            } else {
              activeWorkspaceId = myWorkspaces[0].id;
            }
            set({ workspaceId: activeWorkspaceId });
          }

          const newProject = await projectApi.createProject({
            name: get().projectName || 'Proyek Baru',
            description: get().projectDescription || '',
            workspace_id: activeWorkspaceId!,
            application_type: get().platformType || 'Web Application',
            domain_business: 'General',
            target_users: 'General User',
            business_goals: '',
          }, activeToken);

          set({ projectId: newProject.id, isCreatingProject: false });
          return newProject.id;
        } catch (error) {
          console.error('Gagal membuat proyek:', error);
          set({ isCreatingProject: false });
          return null;
        }
      },

      generateAIRequirements: async (projectId: number, token: string) => {
        const activeToken = getValidToken(token);
        try {
          const response = await projectApi.generateRequirements(projectId, activeToken);
          const mappedEpics: EpicItem[] = (response.epics || []).map((e: any, i: number) => ({
            id: `e-${i}`,
            title: e.name,
            description: e.description,
          }));

          const mappedStories: UserStoryItem[] = (response.user_stories || []).map((s: any, i: number) => ({
            id: `s-${i}`,
            epicId: mappedEpics.find(e => e.title === s.epic_name)?.id || '',
            epicTitle: s.epic_name,
            storyName: s.story_name,
            userType: s.user_type,
            description: s.description,
          }));

          set({ 
            epics: mappedEpics, 
            userStories: mappedStories,
            userTypes: (response.user_types || []).map((ut: any) => ({ id: ut.name, name: ut.name, description: ut.description })),
            nonFunctionals: (response.nfrs || []).map((n: any) => ({ id: n.category, category: n.category, description: n.description }))
          });
          return true;
        } catch (error) {
          console.error('AI Gen Error:', error);
          return false;
        }
      },

      resetStore: () => set({
        step: 1, teamName: '', projectName: '', projectDescription: '', userTypes: [], userGoals: [], epics: [], userStories: [], projectId: null, workspaceId: null
      }),
    }),
    {
      name: 'userdoc-wizard-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
=======
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
>>>>>>> origin/dev
