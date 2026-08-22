'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

import { projectApi } from '@/services/projectsApi';
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
      // Hanya kirim requirements kalau alur "generate dengan AI" yang dipakai.
      // Alur "translate" / "example" belum punya data epics/userTypes/NFR dari wizard ini,
      // jadi kita skip supaya tidak mengirim payload kosong yang salah bentuk.
      if (projectType === 'generate') {
        // Payload ini HARUS cocok persis dengan skema ProjectRequirementsOutput
        // di backend (services/ai.py), karena divalidasi oleh Pydantic.
        const payload = {
          user_types: (userTypes || []).map((ut: any) => ({
            name: ut.name,
            description: ut.description || '',
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
            // Wizard saat ini belum punya UI untuk acceptance criteria manual,
            // jadi dikirim kosong. Kalau nanti field ini ditambahkan di
            // userStoriesList.tsx, tinggal map ke sini.
            acceptance_criteria: s.acceptanceCriteria || [],
          })),
          nfrs: (nonFunctionals || []).map((n: any) => ({
            category: n.category,
            description: n.description,
          })),
        };

        await projectApi.saveRequirements(projectId, payload, token);
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