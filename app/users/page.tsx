// app/users/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import UsersSidebar from '@/features/users/components/userSidebar';
import UserDetailPanel from '@/features/users/components/userDetailPanel';
import EmptyUserPanel from '@/features/users/components/emptyUserPanel';
import UserFormPanel from '@/features/users/components/userFormPanel';
import { UserType } from '@/features/users/types';
import { usersApi } from '@/services/userApi';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';
import { MessageSquare, Loader2 } from 'lucide-react';

function UsersPageContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');

  const [projectName, setProjectName] = useState('');
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Ambil data user types dari backend (bukan mock lagi)
  useEffect(() => {
    const loadData = async () => {
      if (!projectId) {
        setLoadError('project_id tidak ditemukan di URL.');
        setIsLoading(false);
        return;
      }
      const token = getAuthToken();
      if (!token) {
        setLoadError('Sesi habis, silakan login kembali.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [data, projectData] = await Promise.all([
          usersApi.fetchUserTypes(Number(projectId), token),
          projectApi.getProjectById(Number(projectId), token),
        ]);
        setUserTypes(data);
        setProjectName(projectData.name);
        setSelectedUserType(data[0] || null);
      } catch (err: any) {
        console.error('Gagal memuat user types:', err);
        setLoadError(err.message || 'Gagal memuat data dari server.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId]);

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

  const handleSaveUserType = async (formData: UserType) => {
    if (!projectId) return;
    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    setIsSaving(true);
    try {
      let userTypeId: number;

      if (isCreating) {
        const created = await usersApi.createUserType(
          { name: formData.name, description: formData.description, project_id: Number(projectId) },
          token
        );
        userTypeId = created.id;
      } else {
        const updated = await usersApi.updateUserType(
          Number(selectedUserType?.id),
          { name: formData.name, description: formData.description, project_id: Number(projectId) },
          token
        );
        userTypeId = updated.id;
      }

      for (const persona of formData.personas || []) {
        if (persona.id) {
          await usersApi.updatePersona(persona.id, persona, userTypeId, token);
        } else {
          await usersApi.createPersona(persona, userTypeId, token);
        }
      }

      for (const deletedId of formData.deletedPersonaIds || []) {
        await usersApi.deletePersona(deletedId, token);
      }

      const refreshed = await usersApi.fetchUserTypes(Number(projectId), token);
      setUserTypes(refreshed);
      setSelectedUserType(refreshed.find((u) => u.id === String(userTypeId)) || refreshed[0] || null);
    } catch (err: any) {
      console.error('Gagal menyimpan user type:', err);
      alert(err.message || 'Gagal menyimpan data ke server.');
    } finally {
      setIsSaving(false);
      setIsCreating(false);
      setIsEditing(false);
    }
  };

  const handleDeleteUserType = async (id: string) => {
    const token = getAuthToken();
    if (!token) return;
    if (!confirm('Hapus user type ini beserta seluruh personanya?')) return;

    try {
      await usersApi.deleteUserType(Number(id), token);
      const updatedList = userTypes.filter((item) => item.id !== id);
      setUserTypes(updatedList);
      setSelectedUserType(updatedList[0] || null);
    } catch (err: any) {
      console.error('Gagal menghapus user type:', err);
      alert(err.message || 'Gagal menghapus data di server.');
    } finally {
      setIsCreating(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    if (!selectedUserType && userTypes.length > 0) {
      setSelectedUserType(userTypes[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500">Memuat data user types...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <p className="text-red-600 font-medium mb-2">Gagal memuat data</p>
          <p className="text-sm text-gray-500">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans relative">
      {isSaving && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center text-white font-medium">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Menyimpan ke server...
        </div>
      )}

      {/* 1. Global Navigation Sidebar */}
      <AppSidebar activeMenu="users" projectId={projectId} />

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
          <span className="text-xs font-medium text-gray-500">{projectName || 'Untitled Project'} <span className="text-gray-300">/</span></span>
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

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <UsersPageContent />
    </Suspense>
  );
}