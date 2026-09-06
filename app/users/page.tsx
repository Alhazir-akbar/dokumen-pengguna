// app/users/page.tsx
'use client';

<<<<<<< Updated upstream
import { useState } from 'react';
=======
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
>>>>>>> Stashed changes
import AppSidebar from '@/features/common/components/AppSidebar';
import UsersSidebar from '@/features/users/components/userSidebar';
import UserDetailPanel from '@/features/users/components/userDetailPanel';
import EmptyUserPanel from '@/features/users/components/emptyUserPanel';
import { mockUserTypes } from '@/features/users/data/mock-users';
import { UserType } from '@/features/users/types';
<<<<<<< Updated upstream
import { MessageSquare } from 'lucide-react';

export default function UsersPage() {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(mockUserTypes[0] || null);
=======
import { usersApi } from '@/services/userApi';
import { projectApi } from '@/services/projectsApi';
import { fetchStories } from '@/services/storiesApi';
import { getAuthToken } from '@/lib/auth';
import { getStoredProjectId, setStoredProjectId } from '@/lib/project-context';
import { MessageSquare, Loader2, RefreshCw } from 'lucide-react';

function UsersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('project_id');

  const [projectName, setProjectName] = useState('');
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  // Ambil data user types dari backend (bukan mock lagi)
  useEffect(() => {
    // Fallback: kalau URL kehilangan project_id, coba pulihkan dari localStorage
    // dulu sebelum langsung menampilkan error (misal saat browser back navigation).
    if (!projectId) {
      const stored = getStoredProjectId();
      if (stored) {
        router.replace(`/users?project_id=${stored}`);
        return;
      }
    }

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
      setLoadError('');
      try {
        const [data, projectData, storiesData] = await Promise.all([
          usersApi.fetchUserTypes(Number(projectId), token),
          projectApi.getProjectById(Number(projectId), token),
          fetchStories(Number(projectId), token),
        ]);

        // PERBAIKAN: usersApi selalu mengembalikan storiesCount = 0 (belum pernah
        // dihitung beneran). Sekarang dihitung di sini dengan mencocokkan
        // story.user_type_id terhadap id tiap user type.
        const dataWithCounts = data.map((ut) => ({
          ...ut,
          storiesCount: storiesData.filter((s: any) => String(s.user_type_id) === String(ut.id)).length,
        }));

        setUserTypes(dataWithCounts);
        setProjectName(projectData.name);
        setSelectedUserType(dataWithCounts[0] || null);
        setStoredProjectId(projectId);
      } catch (err: any) {
        console.error('Gagal memuat user types:', err);
        setLoadError(err.message || 'Gagal memuat data dari server.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId, reloadToken, router]);

  const handleRetry = useCallback(() => setReloadToken((n) => n + 1), []);

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

  // Menyimpan UserType + Personas ke backend beneran.
  // Alurnya:
  // 1. Create/update UserType dulu -> dapat id-nya
  // 2. Loop personas: yang punya id -> update, yang tidak punya id -> create
  // 3. Hapus persona yang ditandai deletedPersonaIds oleh UserFormPanel
  // 4. Reload seluruh daftar dari backend supaya data & id selalu sinkron
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

      // Simpan personas (create baru / update yang sudah ada)
      for (const persona of formData.personas || []) {
        if (persona.id) {
          await usersApi.updatePersona(persona.id, persona, userTypeId, token);
        } else {
          await usersApi.createPersona(persona, userTypeId, token);
        }
      }

      // Hapus personas yang sengaja dihapus user saat edit
      for (const deletedId of formData.deletedPersonaIds || []) {
        await usersApi.deletePersona(deletedId, token);
      }

      // Refresh dari backend supaya id, personasCount, dll selalu akurat
      const refreshed = await usersApi.fetchUserTypes(Number(projectId), token);
      const storiesData = await fetchStories(Number(projectId), token);
      const refreshedWithCounts = refreshed.map((ut) => ({
        ...ut,
        storiesCount: storiesData.filter((s: any) => String(s.user_type_id) === String(ut.id)).length,
      }));
      setUserTypes(refreshedWithCounts);
      setSelectedUserType(refreshedWithCounts.find((u) => u.id === String(userTypeId)) || refreshedWithCounts[0] || null);
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
          <p className="text-sm text-gray-500 mb-4">{loadError}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba lagi
          </button>
        </div>
      </div>
    );
  }
>>>>>>> Stashed changes

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      {/* 1. Main Navigation Toolbar (Global Sidebar dengan menu aktif 'users') */}
      <AppSidebar activeMenu="users" />

      {/* 2. Sub-Sidebar (Daftar User Types khusus halaman ini) */}
      <UsersSidebar 
        userTypes={mockUserTypes} 
        selectedId={selectedUserType?.id} 
        onSelectUser={(user: UserType) => setSelectedUserType(user)} 
      />

      {/* 3. Main Content / Detail Panel (Sisi Kanan) */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Top Navbar Kecil */}
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <span className="text-xs font-medium text-gray-500">alalal -</span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              UD
            </div>
          </div>
        </div>

        {/* Dynamic Detail Panel */}
        {selectedUserType ? (
          <UserDetailPanel userType={selectedUserType} />
        ) : (
          <EmptyUserPanel />
        )}
      </main>
    </div>
  );
}