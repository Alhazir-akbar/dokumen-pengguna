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

  updateUserGoal: (userTypeName: string, goals: string, frustrations: string) => void;

  addEpic: (item: EpicItem) => void;
  removeEpic: (id: string) => void;
  updateEpic: (id: string, updatedData: Partial<EpicItem>) => void;

  addNonFunctional: (item: NonFunctionalItem) => void;
  removeNonFunctional: (id: string) => void;

  addUserStory: (item: UserStoryItem) => void;
  removeUserStory: (id: string) => void;

  setProjectId: (id: number) => void;
  setWorkspaceId: (id: number) => void;

  createWorkspaceIfNeeded: (token: string) => Promise<number | null>;
  createProjectIfNeeded: (token: string) => Promise<number | null>;

  generateAIRequirements: (projectId: number, token: string) => Promise<boolean>;
  resetStore: () => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
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
      updateEpic: (id: string, updatedData: Partial<EpicItem>) => set((state) => ({
        epics: state.epics.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
      })),

      addNonFunctional: (item: NonFunctionalItem) => set((state) => ({ nonFunctionals: [...state.nonFunctionals, item] })),
      removeNonFunctional: (id: string) => set((state) => ({ nonFunctionals: state.nonFunctionals.filter((n) => n.id !== id) })),

      addUserStory: (item: UserStoryItem) => set((state) => ({ userStories: [...state.userStories, item] })),
      removeUserStory: (id: string) => set((state) => ({ userStories: state.userStories.filter((s) => s.id !== id) })),

      setProjectId: (id: number) => set({ projectId: id }),
      setWorkspaceId: (id: number) => set({ workspaceId: id }),

      createWorkspaceIfNeeded: async (token: string) => {
        const existingId = get().workspaceId;
        if (existingId) {
          return existingId;
        }

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
        if (existingId) {
          return existingId;
        }

        set({ isCreatingProject: true });

        try {
          let activeWorkspaceId = get().workspaceId;

          if (!activeWorkspaceId) {
            const myWorkspaces = await workspaceApi.getMyWorkspaces(token);

            if (!myWorkspaces || myWorkspaces.length === 0) {
              throw new Error('Anda belum tergabung di ruang kerja manapun. Silakan ulangi dari langkah "Setup your team".');
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
              id: `ut-${Date.now()}-${index}`,
              name: ut.name,
              description: ut.description,
            })
          );

          const mappedEpics: EpicItem[] = (response.epics || []).map((epic: any, index: number) => ({
            id: `epic-${Date.now()}-${index}`,
            title: epic.name,
            description: epic.description,
          }));

          const mappedUserStories: UserStoryItem[] = (response.user_stories || []).map(
            (story: any, index: number) => {
              const relatedEpic = mappedEpics.find((e) => e.title === story.epic_name);
              return {
                id: `story-${Date.now()}-${index}`,
                epicId: relatedEpic?.id || '',
                epicTitle: story.epic_name,
                storyName: story.story_name,
                userType: story.user_type,
                description: story.description,
              };
            }
          );

          const mappedNonFunctionals: NonFunctionalItem[] = (response.nfrs || []).map(
            (nfr: any, index: number) => ({
              id: `nfr-${Date.now()}-${index}`,
              category: nfr.category,
              description: nfr.description,
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
        isCreatingProject: false,
        workspaceId: null,
        isCreatingWorkspace: false,
      }),
    }),
    {
      name: 'userdoc-wizard-storage', // key di localStorage
      storage: createJSONStorage(() => localStorage),
      // isCreatingProject & isCreatingWorkspace sengaja TIDAK di-persist,
      // supaya kalau reload di tengah proses create, tombol nggak nyangkut "loading" terus.
      partialize: (state) => ({
        step: state.step,
        teamName: state.teamName,
        projectName: state.projectName,
        useAi: state.useAi,
        projectType: state.projectType,
        projectDescription: state.projectDescription,
        platformType: state.platformType,
        userTypes: state.userTypes,
        userGoals: state.userGoals,
        epics: state.epics,
        nonFunctionals: state.nonFunctionals,
        userStories: state.userStories,
        projectId: state.projectId,
        workspaceId: state.workspaceId,
      }),
    }
  )
);