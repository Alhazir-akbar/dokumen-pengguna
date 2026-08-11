'use client';

import { useState } from 'react';
import AppSidebar from '@/features/common/components/AppSidebar';
import UsersSidebar from '@/features/users/components/userSidebar';
import UserDetailPanel from '@/features/users/components/userDetailPanel';
import EmptyUserPanel from '@/features/users/components/emptyUserPanel';
import { UserType } from '@/features/users/types';
import { MessageSquare } from 'lucide-react';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

export default function UsersPage() {
  const { userTypes, projectName } = useWizardStore();
  
  const formattedUserTypes: UserType[] = userTypes.map((u) => ({
    id: u.id,
    name: u.name,
    description: u.description,
    storiesCount: 0,
    personasCount: 0,
    personas: [],
  }));

  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(formattedUserTypes[0] || null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      <AppSidebar activeMenu="users" />

      <UsersSidebar 
        userTypes={formattedUserTypes} 
        selectedId={selectedUserType?.id} 
        onSelectUser={(user: UserType) => setSelectedUserType(user)} 
      />

      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <span className="text-xs font-medium text-gray-500">
            {projectName ? projectName : 'alalal'} -
          </span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              UD
            </div>
          </div>
        </div>

        {selectedUserType ? (
          <UserDetailPanel userType={selectedUserType} />
        ) : (
          <EmptyUserPanel />
        )}
      </main>
    </div>
  );
}