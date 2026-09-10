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
import { fetchStories } from '@/services/storiesApi';
import { getAuthToken } from '@/lib/auth';
import { MessageSquare, Upload, Download, Loader2 } from 'lucide-react';
import AccountMenu from '@/features/common/components/accountMenu';

function UsersPageContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');

  const [projectName, setProjectName] = useState('');
  const [projectWorkspaceId, setProjectWorkspaceId] = useState<number | null>(null);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const attachStoriesCount = (types: UserType[], rawStories: any[]): UserType[] => {
    const countMap = new Map<string, number>();
    for (const story of rawStories) {
      const userTypeId = story.user_type_id != null ? String(story.user_type_id) : null;
      if (!userTypeId) continue;
      countMap.set(userTypeId, (countMap.get(userTypeId) || 0) + 1);
    }
    return types.map((ut) => ({
      ...ut,
      storiesCount: countMap.get(ut.id) || 0,
    }));
  };

  const loadData = async (currentSelectedId?: string) => {
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
      const [userTypesData, storiesData, projectData] = await Promise.all([
        usersApi.fetchUserTypes(Number(projectId), token),
        fetchStories(Number(projectId), token),
        projectApi.getProjectById(Number(projectId), token),
      ]);

      const merged = attachStoriesCount(userTypesData, storiesData);
      setUserTypes(merged);
      setProjectName(projectData.name);
      setProjectWorkspaceId(projectData.workspace_id);

      if (currentSelectedId) {
        setSelectedUserType(merged.find((u) => u.id === currentSelectedId) || merged[0] || null);
      } else {
        setSelectedUserType(merged[0] || null);
      }
    } catch (err: any) {
      console.error('Gagal memuat user types:', err);
      setLoadError(err.message || 'Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      await loadData(String(userTypeId));
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

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        alert(`File "${file.name}" berhasil di-upload!`);
      }
    };
    input.click();
  };

  const handleDownload = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userTypes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${projectName || 'project'}-user-types.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
          <span className="text-xs font-medium text-gray-500">
            {projectName || 'Untitled Project'} <span className="text-gray-300">/</span>
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-500">
              <button
                onClick={handleUpload}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer"
                title="Upload Document"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer"
                title="Download / Export JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <AccountMenu currentWorkspaceId={projectWorkspaceId} />
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