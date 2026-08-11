'use client';

import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';
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

export default function WizardPage() {
  const router = useRouter(); // <-- Pastikan baris ini ada
  const { step } = useWizardStore();

  return (
    <main className="min-h-screen bg-blue-600 flex items-center justify-center p-6">
      {step === 1 && <TeamName />}
      {step === 2 && <NameProject />}
      {step === 3 && <ProjectType />}
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
    </main>
  );
}