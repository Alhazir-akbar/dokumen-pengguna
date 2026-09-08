// app/workspace/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoUserdoc from '@/public/logoUserDoc';
import AccountMenu from '@/features/common/components/accountMenu';
import { workspaceApi, WorkspaceResponse } from '@/services/workspaceApi';
import { projectApi, ProjectResponse } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';
import { setStoredProjectId } from '@/lib/project-context';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';
import { FolderKanban, Plus, Loader2, RefreshCw, Users } from 'lucide-react';

export default function WorkspacePage() {
  const router = useRouter();
  const resetStore = useWizardStore((s: any) => s.resetStore);
  const setWorkspaceId = useWizardStore((s: any) => s.setWorkspaceId);
  const updateTeamName = useWizardStore((s: any) => s.updateTeamName);

  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [hasNoProjects, setHasNoProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      setIsLoading(true);
      setLoadError('');
      try {
        const workspaces = await workspaceApi.getMyWorkspaces(token);
        if (!workspaces || workspaces.length === 0) {
          router.replace('/project-setup');
          return;
        }

        const activeWorkspace = workspaces[0];
        setWorkspace(activeWorkspace);

        // Simpan ke localStorage agar service API lain tidak kehilangan ID workspace
        localStorage.setItem('workspace_id', String(activeWorkspace.id));
        localStorage.setItem('team_id', String(activeWorkspace.id));

        const projectList = await projectApi.getProjects(activeWorkspace.id, token);

        if (projectList && projectList.length > 0) {
          // Auto-buka project yang paling baru dibuat, tanpa menampilkan daftar dulu.
          const latestProject = [...projectList].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
          setStoredProjectId(latestProject.id);
          router.replace(`/stories?project_id=${latestProject.id}`);
          return;
        }

        // Workspace ada, tapi belum punya project sama sekali -> tampilkan
        // layar "buat project pertama" (skip TeamName, karena workspace sudah ada).
        setHasNoProjects(true);
      } catch (err: any) {
        console.error('Gagal memuat data workspace:', err);
        setLoadError(err.message || 'Gagal memuat data workspace.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [reloadToken, router]);

  const handleCreateFirstProject = () => {
    resetStore();
    if (workspace) {
      // Isi workspaceId & teamName di wizard store SEBELUM masuk /project-setup,
      // supaya komponen TeamName mendeteksi workspace sudah ada dan otomatis
      // skip ke step NameProject (tidak perlu isi nama team lagi).
      setWorkspaceId(workspace.id);
      updateTeamName(workspace.name);
    }
    router.push('/project-setup');
  };

  const handleRetry = () => setReloadToken((n) => n + 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-gray-800 font-medium mb-2">Gagal memuat data</p>
          <p className="text-gray-500 text-sm mb-4">{loadError}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba lagi
          </button>
        </div>
      </div>
    );
  }

  // Kalau sampai sini, artinya hasNoProjects true (kasus lain sudah di-redirect
  // duluan di dalam useEffect sebelum render sempat sampai sini).
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <LogoUserdoc />
          <span className="text-sm font-semibold text-gray-800">{workspace?.name || 'Your Team'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/team-settings')}
            className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-gray-500" /> Team Settings
          </button>
          <AccountMenu />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-10">
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center max-w-lg mx-auto mt-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">Belum ada project di team ini</p>
          <p className="text-gray-500 text-sm mb-6">Buat project pertama untuk mulai menyusun requirements.</p>
          <button
            onClick={handleCreateFirstProject}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Your First Project
          </button>
        </div>
      </main>
    </div>
  );
}