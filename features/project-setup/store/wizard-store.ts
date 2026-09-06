// features/project-setup/store/wizard-store.ts
import { create } from 'zustand';
<<<<<<< HEAD
import { persist, createJSONStorage } from 'zustand/middleware';
import { projectApi } from '@/services/projectsApi';
import { workspaceApi } from '@/services/workspaceApi';
=======
import { projectApi } from '@/services/projectsApi';
import { workspaceApi } from '@/services/workspaceApi';

export interface PersonaDraft {
  name: string;
  age?: number;
  location?: string;
  familyStatus?: string;
  jobTitle?: string;
  about?: string;
  goals?: string;
  frustrations?: string;
}
>>>>>>> 23ab38d (add file)

export interface UserTypeItem {
  id: string;
  name: string;
  description: string;
  personas?: PersonaDraft[];
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
  acceptanceCriteria?: string[];
  techNotes?: string[];
  testCases?: string[];
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
// Perbarui tipe projectType agar mendukung 'generate', 'translate', dan 'example'
>>>>>>> origin/dev
=======
>>>>>>> 23ab38d (add file)
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
<<<<<<< HEAD
=======

  addNonFunctional: (item: NonFunctionalItem) => void;
  removeNonFunctional: (id: string) => void;
  updateNonFunctional: (id: string, updatedData: Partial<NonFunctionalItem>) => void;

  addUserStory: (item: UserStoryItem) => void;
  removeUserStory: (id: string) => void;
  updateStory: (id: string, updatedData: Partial<UserStoryItem>) => void;

  setProjectId: (id: number) => void;
  setWorkspaceId: (id: number) => void;
>>>>>>> 23ab38d (add file)

  createWorkspaceIfNeeded: (token: string) => Promise<number | null>;
  createProjectIfNeeded: (token: string) => Promise<number | null>;
  generateAIRequirements: (projectId: number, token: string) => Promise<boolean>;
<<<<<<< HEAD
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
=======
>>>>>>> 23ab38d (add file)
  resetStore: () => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
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

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  updateTeamName: (name) => set({ teamName: name }),
  updateProjectName: (name) => set({ projectName: name }),
  setUseAi: (choice: boolean) => set({ useAi: choice }),
  setProjectType: (type: ProjectTypeEnum) => set({ projectType: type }),
  setProjectDescription: (desc: string) => set({ projectDescription: desc }),
  setPlatformType: (platform: string) => set({ platformType: platform }),
  
  addUserType: (item) => set((state) => ({ userTypes: [...state.userTypes, item] })),
  removeUserType: (id) => set((state) => ({ userTypes: state.userTypes.filter((u) => u.id !== id) })),
  updateUserTypeDescription: (id, description) => set((state) => ({
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

<<<<<<< HEAD
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
=======
  addEpic: (item) => set((state) => ({ epics: [...state.epics, item] })),
  removeEpic: (id) => set((state) => ({ epics: state.epics.filter((e) => e.id !== id) })),
  updateEpic: (id, updatedData) => set((state) => ({
    epics: state.epics.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
  })),

  addNonFunctional: (item) => set((state) => ({ nonFunctionals: [...state.nonFunctionals, item] })),
  removeNonFunctional: (id) => set((state) => ({ nonFunctionals: state.nonFunctionals.filter((n) => n.id !== id) })),
  updateNonFunctional: (id, updatedData) => set((state) => ({
    nonFunctionals: state.nonFunctionals.map((n) => (n.id === id ? { ...n, ...updatedData } : n))
  })),

  addUserStory: (item) => set((state) => ({ userStories: [...state.userStories, item] })),
  removeUserStory: (id) => set((state) => ({ userStories: state.userStories.filter((s) => s.id !== id) })),
  updateStory: (id, updatedData) => set((state) => ({
    userStories: state.userStories.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
  })),

  setProjectId: (id) => set({ projectId: id }),
  setWorkspaceId: (id) => set({ workspaceId: id }),

  createWorkspaceIfNeeded: async (token: string) => {
    const existingId = get().workspaceId;
    if (existingId) return existingId;

    const name = get().teamName?.trim();
    if (!name) {
      console.error('Nama tim kosong, tidak bisa membuat workspace.');
      return null;
    }

    set({ isCreatingWorkspace: true });
    try {
      const newWorkspace = await workspaceApi.createWorkspace({ name }, token);
      set({ workspaceId: newWorkspace.id, isCreatingWorkspace: false });
      return newWorkspace.id;
    } catch (error) {
      console.error('Gagal membuat workspace:', error);
      set({ isCreatingWorkspace: false });
      return null;
    }
  },

  createProjectIfNeeded: async (token: string) => {
    const existingId = get().projectId;
    if (existingId) return existingId;

    set({ isCreatingProject: true });
    try {
      let activeWorkspaceId = get().workspaceId;

      if (!activeWorkspaceId) {
        const myWorkspaces = await workspaceApi.getMyWorkspaces(token);
        if (!myWorkspaces || myWorkspaces.length === 0) {
          throw new Error('Anda belum tergabung di ruang kerja manapun.');
        }
        activeWorkspaceId = myWorkspaces[0].id;
        set({ workspaceId: activeWorkspaceId });
      }

      const newProject = await projectApi.createProject({
        name: get().projectName || 'Proyek Baru',
        description: get().projectDescription || '',
        workspace_id: activeWorkspaceId,
        application_type: get().platformType || 'Web App',
        domain_business: 'General',
        target_users: 'General User',
        business_goals: '',
      }, token);

      set({ projectId: newProject.id, isCreatingProject: false });
      return newProject.id;
    } catch (error) {
      console.error('Gagal membuat proyek:', error);
      set({ isCreatingProject: false });
      return null;
    }
  },

  generateAIRequirements: async (projectId: number, token: string) => {
    try {
      const response = await projectApi.generateRequirements(projectId, token);

      const mappedUserTypes: UserTypeItem[] = (response.user_types || []).map(
        (ut: any, index: number) => ({
          id: ut.name || `ut-${Date.now()}-${index}`,
          name: ut.name,
          description: ut.description,
          personas: (ut.personas || []).map((p: any) => ({
            name: p.name,
            age: p.age,
            location: p.location,
            familyStatus: p.family_status,
            jobTitle: p.job_title,
            about: p.about,
            goals: p.goals,
            frustrations: p.frustrations,
          })),
        })
      );

      const mappedEpics: EpicItem[] = (response.epics || []).map((epic: any, index: number) => ({
        id: `epic-${Date.now()}-${index}`,
        title: epic.name,
        description: epic.description,
      }));

      const mappedUserStories: UserStoryItem[] = (response.user_stories || []).map(
        (s: any, index: number) => {
          const relatedEpic = mappedEpics.find((e) => e.title === s.epic_name);
          return {
            id: `story-${Date.now()}-${index}`,
            epicId: relatedEpic?.id || '',
>>>>>>> 23ab38d (add file)
            epicTitle: s.epic_name,
            storyName: s.story_name,
            userType: s.user_type,
            description: s.description,
<<<<<<< HEAD
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
=======
            acceptanceCriteria: s.acceptance_criteria || [],
            techNotes: s.tech_notes || [],
            testCases: s.test_cases || [],
          };
        }
      );

      const mappedNonFunctionals: NonFunctionalItem[] = (response.nfrs || []).map(
        (n: any) => ({
          id: n.category,
          category: n.category,
          description: n.description,
        })
      );

      set({
        epics: mappedEpics,
        userStories: mappedUserStories,
        userTypes: mappedUserTypes,
        nonFunctionals: mappedNonFunctionals,
      });

      return true;
    } catch (error) {
      console.error('Gagal memproses AI Requirements:', error);
      return false;
    }
  },

>>>>>>> 23ab38d (add file)
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
    projectId: null,
    workspaceId: null,
  }),
}));
>>>>>>> origin/dev
