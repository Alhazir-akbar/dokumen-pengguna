'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';
import { LogOut, FastForward, Loader2 } from 'lucide-react';

import { projectApi } from '@/services/projectsApi';
import { workspaceApi } from '@/services/workspaceApi';
import { buildApi } from '@/services/buildApi';
import { getAuthToken } from '@/lib/auth';

import TeamName from '@/features/project-setup/components/teamName';
import NameProject from '@/features/project-setup/components/nameProject';
import ProjectType from '@/features/project-setup/components/projectType';
import AiIntro from '@/features/project-setup/components/aiIntro';
import DescribeProject from '@/features/project-setup/components/describeProject';
import UserTypes from '@/features/project-setup/components/userTypes';
import EpicsList from '@/features/project-setup/components/epicList';
import NonFunctionalList from '@/features/project-setup/components/nonFunctionalList';
import UserStoriesList from '@/features/project-setup/components/userStoriesList';
import UserTypeGoals from '@/features/project-setup/components/userTypeGoals';
import UserJourney from '@/features/project-setup/components/userJourney';

import SoftwareIntro from '@/features/project-setup/components/softwareIntro';
import SoftwareName from '@/features/project-setup/components/softwareName';
import SoftwareOverview from '@/features/project-setup/components/softwareOverview';
import SoftwareDetails from '@/features/project-setup/components/softwareDetails';
import SoftwareScale from '@/features/project-setup/components/softwareScale';
import SoftwareTechnologies from '@/features/project-setup/components/softwareTechnologies';

export default function WizardPage() {
  const router = useRouter();

  const {
    step,
    projectType,
    projectId,
    userTypes,
    epics,
    userStories,
    nonFunctionals,
    resetStore,
  } = useWizardStore() as any;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  // 🚪 Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('active_workspace_id');
    localStorage.removeItem('active_project_id');
    localStorage.removeItem('userdoc-wizard-storage');
    resetStore();
    router.push('/login');
  };

    // ⏩ Fungsi Skip Langsung ke Stories Proyek Akun Sendiri
  const handleSkip = async () => {
    setIsSkipping(true);
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // 1. Ambil workspace milik user yang sedang aktif
      const myWorkspaces = await workspaceApi.getMyWorkspaces(token);
      let targetWsId: number;
      
      if (myWorkspaces && myWorkspaces.length > 0) {
        targetWsId = myWorkspaces[0].id;
      } else {
        const newWs = await workspaceApi.createWorkspace({ name: 'Workspace Utama' }, token);
        targetWsId = newWs.id;
      }

      // 2. Ambil proyek milik user di workspace ini
      let targetProjId: number;
      const myProjects = await projectApi.getProjects(targetWsId, token);
      
      if (myProjects && myProjects.length > 0) {
        targetProjId = myProjects[0].id;
      } else {
        const newProj = await projectApi.createProject({
          name: 'Proyek Baru',
          description: 'Spesifikasi proyek baru',
          workspace_id: targetWsId,
          application_type: 'Web Application',
          domain_business: 'General',
          target_users: 'General User',
          business_goals: '',
        }, token);
        targetProjId = newProj.id;
      }

      // 3. Simpan ID yang valid dan arahkan ke Stories
      localStorage.setItem('active_workspace_id', String(targetWsId));
      localStorage.setItem('active_project_id', String(targetProjId));
      resetStore();
      router.push(`/stories?project_id=${targetProjId}`);
    } catch (e) {
      console.error("Gagal skip setup:", e);
      router.push('/login');
    } finally {
      setIsSkipping(false);
    }
  };
  const handleFinishWizard = async () => {
    setIsSubmitting(true);
    const token = getAuthToken();

    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      router.push('/login');
      setIsSubmitting(false);
      return;
    }

    if (!projectId) {
      alert('Project belum berhasil dibuat sebelumnya. Silakan ulangi dari awal wizard.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (projectType === 'generate') {

        const payload = {
          user_types: (userTypes || []).map((ut: any) => ({
            name: ut.name,
            description: ut.description || '',
            personas: (ut.personas || []).map((p: any) => ({
              name: p.name || 'Persona',
              age: p.age || 25,
              location: p.location || '-',
              family_status: p.familyStatus || '-',
              job_title: p.jobTitle || '-',
              about: p.about || '-',
              goals: p.goals || '-',
              frustrations: p.frustrations || '-',
            })),
          })),
          epics: (epics || []).map((e: any) => ({
            name: e.title,
            description: e.description || '',
          })),
          user_stories: (userStories || []).map((s: any) => ({
            epic_name: s.epicTitle,
            story_name: s.storyName,
            user_type: s.userType,
            description: s.description || '',
            acceptance_criteria: s.acceptanceCriteria || [],
            tech_notes: s.techNotes || [],
            test_cases: s.testCases || [],
          })),
          nfrs: (nonFunctionals || []).map((n: any) => ({
            category: n.category,
            description: n.description,
          })),
        };

        await projectApi.saveRequirements(projectId, payload, token);
        
        try {
          await buildApi.generateDefaults(projectId, token);
        } catch (buildErr) {
          console.error('Gagal auto-generate Build defaults (non-fatal):', buildErr);
        }
      }

      resetStore();
      router.push(`/stories?project_id=${projectId}`);

    } catch (error: any) {
      console.error('Gagal menyimpan project setup:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-blue-600 flex items-center justify-center p-6 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center text-white font-medium">
          Menyimpan spesifikasi proyek ke server...
        </div>
      )}

      {/* 🚀 Tombol Skip Setup & Logout di Pojok Kanan Atas */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-40">
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSkipping}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          title="Lewati setup dan langsung ke workspace"
        >
          {isSkipping ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FastForward className="w-3.5 h-3.5" />
          )}
          <span>Skip Setup</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-100 hover:text-white text-xs font-medium backdrop-blur-md border border-red-300/30 transition-all cursor-pointer shadow-sm"
          title="Keluar dari akun"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {step === 1 && <TeamName />}
      {step === 2 && <NameProject />}
      {step === 3 && <ProjectType />}

      {projectType === 'generate' && (
        <>
          {step === 4 && <AiIntro />}
          {step === 5 && <DescribeProject />}
          {/* Step "AiChoice" dihapus — DescribeProject sekarang otomatis men-generate
              rekomendasi AI begitu user klik Next, tanpa perlu pilihan manual/AI lagi. */}
          {step === 6 && <UserTypes />}
          {step === 7 && <EpicsList />}
          {step === 8 && <NonFunctionalList />}
          {step === 9 && <UserStoriesList />}
          {step === 10 && <UserTypeGoals />}
          {step === 11 && <UserJourney onFinishProject={handleFinishWizard} />}
        </>
      )}

      {projectType === 'translate' && (
        <>
          {step === 4 && <SoftwareIntro />}
          {step === 5 && <SoftwareName />}
          {step === 6 && <SoftwareOverview />}
          {step === 7 && <SoftwareScale />}
          {step === 8 && <SoftwareDetails />}
          {step === 9 && <SoftwareTechnologies />}
          {step === 10 && <UserJourney onFinishProject={handleFinishWizard} />}
        </>
      )}

      {projectType === 'example' && (
        <>
          {step === 4 && <UserJourney onFinishProject={handleFinishWizard} />}
        </>
      )}
    </main>
  );
}