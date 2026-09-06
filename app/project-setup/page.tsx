'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

<<<<<<< Updated upstream
import { submitWizardBatch } from '@/services/storiesApi';
=======
import { projectApi } from '@/services/projectsApi';
import { buildApi } from '@/services/buildApi';
>>>>>>> Stashed changes
import { getAuthToken } from '@/lib/auth';

import TeamName from '@/features/project-setup/components/teamName';
import NameProject from '@/features/project-setup/components/nameProject';
import ProjectType from '@/features/project-setup/components/projectType';
import AiIntro from '@/features/project-setup/components/aiIntro';
import DescribeProject from '@/features/project-setup/components/describeProject';
import AiChoice from '@/features/project-setup/components/aiChoice';
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

  const { step, projectType, projectId, epics, userStories, resetStore } = useWizardStore() as any;

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
      if (projectType === 'generate') {
<<<<<<< Updated upstream
        // Transform data store -> bentuk yang backend (WizardBatchCreateSchema) minta.
        // Store pakai "title" untuk epic; backend minta "name". Stories perlu di-nest per epic.
        const payloadEpics = (epics || []).map((epic: any) => ({
          name: epic.title,
          description: epic.description || '',
          stories: (userStories || [])
            .filter((s: any) => s.epicId === epic.id || s.epicTitle === epic.title)
            .map((s: any) => ({
              storyName: s.storyName,
              userType: s.userType,
              description: s.description || '',
            })),
        }));

        const payloadUserStories = (userStories || []).map((s: any) => ({
          storyName: s.storyName,
          userType: s.userType,
          description: s.description || '',
        }));

        console.log('Payload dikirim ke /stories/batch:', {
          epics: payloadEpics,
          userStories: payloadUserStories,
        });

        await submitWizardBatch(projectId, {
          epics: payloadEpics,
          userStories: payloadUserStories,
        }, token);
=======
        // Payload ini HARUS cocok persis dengan skema ProjectRequirementsOutput
        // di backend (services/ai.py), karena divalidasi oleh Pydantic.
        const payload = {
          user_types: (userTypes || []).map((ut: any) => ({
            name: ut.name,
            description: ut.description || '',
            // PERBAIKAN: sebelumnya "personas" tidak dikirim sama sekali, padahal backend
            // mewajibkan field ini (List[PersonaSuggestion], tanpa default) di schema
            // UserTypeSuggestion -> request ditolak dengan 422 Unprocessable Entity.
            // Kalau user type ini tidak punya persona (misal ditambahkan manual, bukan
            // dari AI generate), kirim array kosong supaya validasi tetap lolos.
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

        // TAMBAHAN: begitu requirements tersimpan, langsung generate draf Build
        // (Tech Stack, Coding Guidelines, Dev Plan) via AI supaya halaman Build tidak
        // kosong. Best-effort -- kalau ini gagal, tetap lanjutkan ke halaman Stories,
        // jangan sampai user terjebak gara-gara langkah tambahan ini.
        try {
          await buildApi.generateDefaults(projectId, token);
        } catch (buildErr) {
          console.error('Gagal auto-generate Build defaults (non-fatal):', buildErr);
        }
>>>>>>> Stashed changes
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
      {step === 2 && <ProjectType />}
      {step === 3 && <NameProject />}

      {projectType === 'generate' && (
        <>
          {step === 4 && <AiIntro />}
          {step === 5 && <DescribeProject />}
          {step === 6 && <AiChoice />}
          {step === 7 && <UserTypes />}
          {step === 8 && <EpicsList />}
          {step === 9 && <NonFunctionalList />}
          {step === 10 && <UserStoriesList />}
          {step === 11 && <UserTypeGoals />}
          {step === 12 && <UserJourney onFinishProject={handleFinishWizard} />}
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