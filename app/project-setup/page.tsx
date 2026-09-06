'use client';

import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

// Import komponen umum (Generate / Base)
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

// Import komponen khusus untuk alur Translate (Software Analysis)
import SoftwareIntro from '@/features/project-setup/components/softwareIntro';
import SoftwareName from '@/features/project-setup/components/softwareName';
import SoftwareOverview from '@/features/project-setup/components/softwareOverview';
import SoftwareDetails from '@/features/project-setup/components/softwareDetails';
import SoftwareScale from '@/features/project-setup/components/softwareScale';
import SoftwareTechnologies from '@/features/project-setup/components/softwareTechnologies';

export default function WizardPage() {
  const router = useRouter();
  const { step, projectType } = useWizardStore();

  return (
    <main className="min-h-screen bg-blue-600 flex items-center justify-center p-6">
      {/* Langkah Umum (Step 1 & 2) */}
      {step === 1 && <TeamName />}
      {step === 2 && <NameProject />}
      
      {/* Step 3: Pilihan Tipe Project (Generate / Translate / Example) */}
      {step === 3 && <ProjectType />}

      {/* --- JALUR 1: GENERATE NEW SOFTWARE --- */}
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
          {step === 12 && (
            <UserJourney 
              onFinishProject={() => {
                router.push('/stories');
              }} 
            />
          )}
        </>
      )}

      {/* --- JALUR 2: TRANSLATE SOURCE CODE --- */}
      {projectType === 'translate' && (
        <>
          {step === 4 && <SoftwareIntro />}
          {step === 5 && <SoftwareName />}
          {step === 6 && <SoftwareOverview />}
          {step === 7 && <SoftwareScale />}
          {step === 8 && <SoftwareDetails />}
          {step === 9 && <SoftwareTechnologies />}
          {step === 10 && (
            <UserJourney 
              onFinishProject={() => {
                router.push('/stories');
              }} 
            />
          )}
        </>
      )}

      {/* --- JALUR 3: EXPLORE EXAMPLE PROJECT --- */}
      {projectType === 'example' && (
        <>
          {step === 4 && (
            <UserJourney 
              onFinishProject={() => {
                router.push('/stories');
              }} 
            />
          )}
        </>
      )}
    </main>
  );
}