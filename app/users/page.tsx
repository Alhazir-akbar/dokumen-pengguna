// app/users/page.tsx
'use client';

import { useState } from 'react';
import AppSidebar from '@/features/common/components/AppSidebar';
import UsersSidebar from '@/features/users/components/userSidebar';
import UserDetailPanel from '@/features/users/components/userDetailPanel';
import EmptyUserPanel from '@/features/users/components/emptyUserPanel';
import UserFormPanel from '@/features/users/components/userFormPanel';
import { mockUserTypes } from '@/features/users/data/mock-users';
import { UserType } from '@/features/users/types';
import { MessageSquare } from 'lucide-react';

export default function UsersPage() {
  const [userTypes, setUserTypes] = useState<UserType[]>(mockUserTypes);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(mockUserTypes[0] || null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectUser = (user: UserType) => {
    setSelectedUserType(user);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleOpenAddModal = () => {
    setSelectedUserType(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleOpenEditModal = () => {
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleSaveUserType = (savedData: UserType) => {
    if (isCreating) {
      setUserTypes([...userTypes, savedData]);
    } else {
      setUserTypes(userTypes.map((item) => (item.id === savedData.id ? savedData : item)));
    }
    setSelectedUserType(savedData);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleDeleteUserType = (id: string) => {
    const updatedList = userTypes.filter((item) => item.id !== id);
    setUserTypes(updatedList);
    setSelectedUserType(updatedList[0] || null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    if (!selectedUserType && userTypes.length > 0) {
      setSelectedUserType(userTypes[0]);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      {/* 1. Global Navigation Sidebar */}
      <AppSidebar activeMenu="users" />

      {/* 2. Sub-Sidebar Daftar User Types */}
      <UsersSidebar 
        userTypes={userTypes} 
        selectedId={selectedUserType?.id} 
        onSelectUser={handleSelectUser} 
        onAddNew={handleOpenAddModal}
      />

      {/* 3. Main Content Panel */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Top Navbar */}
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-medium text-gray-500">alalal <span className="text-gray-300">/</span></span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              UD
            </div>
          </div>
        </div>

        {/* Dynamic Panel: Form Create/Edit, Detail, atau Empty State */}
        <div className="flex-1 flex overflow-hidden">
          {isCreating ? (
            <UserFormPanel
              initialData={null}
              onSubmit={handleSaveUserType}
              onCancel={handleCancel}
            />
          ) : isEditing && selectedUserType ? (
            <UserFormPanel
              initialData={selectedUserType}
              onSubmit={handleSaveUserType}
              onCancel={handleCancel}
            />
          ) : selectedUserType ? (
            <UserDetailPanel 
              userType={selectedUserType} 
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteUserType}
            />
          ) : (
            <EmptyUserPanel onOpenAddModal={handleOpenAddModal} />
          )}
        </div>
      </main>
    </div>
  );
}