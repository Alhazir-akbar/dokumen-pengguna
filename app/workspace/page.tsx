// app/workspace/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoUserdoc from '@/public/logoUserDoc';
import AccountMenu from '@/features/common/components/accountMenu';
import { workspaceApi, WorkspaceResponse } from '@/services/workspaceApi';
import { projectApi, ProjectResponse } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';
import { setStoredProjectId, clearStoredProjectId, getStoredProjectId } from '@/lib/project-context';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';
import { FolderKanban, Plus, Trash2, Loader2, RefreshCw, Users, Settings } from 'lucide-react';

const CARD_ACCENTS = [
  'bg-blue-50 text-blue-600',
  'bg-purple-50 text-purple-600',
  'bg-emerald-50 text-emerald-600',
  'bg-amber-50 text-amber-600',
  'bg-rose-50 text-rose-600',
  'bg-cyan-50 text-cyan-600',
];

export default function WorkspacePage() {
  const router = useRouter();
  const resetStore = useWizardStore((s: any) => s.resetStore);

  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Di dalam app/workspace/page.tsx (pada blok useEffect untuk load data)
  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoadError('Sesi habis, silakan login kembali.');
        setIsLoading(false);
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

        // PENTING: Simpan ke localStorage agar service API proyek lain tidak kehilangan ID workspace
        localStorage.setItem('workspace_id', String(activeWorkspace.id));
        localStorage.setItem('team_id', String(activeWorkspace.id));

        const projectList = await projectApi.getProjects(activeWorkspace.id, token);
        setProjects(projectList);
      } catch (err: any) {
        console.error('Gagal memuat data workspace:', err);
        setLoadError(err.message || 'Gagal memuat data workspace.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [reloadToken, router]);
  const handleOpenProject = (id: number) => {
    setStoredProjectId(id);
    router.push(`/stories?project_id=${id}`);
  };

  const handleCreateNew = () => {
    resetStore();
    router.push('/project-setup');
  };

  const handleDelete = async (e: React.MouseEvent, project: ProjectResponse) => {
    e.stopPropagation();
    if (!confirm(`Hapus project "${project.name}"? Seluruh data akan terhapus permanen.`)) return;

    const token = getAuthToken();
    if (!token) return;

    setDeletingId(project.id);
    try {
      await projectApi.deleteProject(project.id, token);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));

      if (getStoredProjectId() === String(project.id)) {
        clearStoredProjectId();
      }
    } catch (err: any) {
      console.error('Gagal menghapus project:', err);
      alert(err.message || 'Gagal menghapus project.');
    } finally {
      setDeletingId(null);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar -- konsisten dengan header di halaman lain (Stories/Users/dst), bukan
          latar biru penuh seperti sebelumnya, supaya tidak terasa "halaman terpisah". */}
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {projects.length} project{projects.length !== 1 ? 's' : ''} in this team
            </p>
          </div>
          {/* PERBAIKAN: tombol "New Project" sekarang cuma muncul SEKALI di sini kalau
              daftar project tidak kosong -- sebelumnya ada 2 tombol serupa (di header
              dan di empty state) yang tampil bersamaan, terasa duplikat. */}
          {projects.length > 0 && (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-900 font-semibold mb-1">Belum ada project di team ini</p>
            <p className="text-gray-500 text-sm mb-6">Buat project pertama untuk mulai menyusun requirements.</p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => {
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              return (
                <div
                  key={project.id}
                  onClick={() => handleOpenProject(project.id)}
                  className="bg-white hover:shadow-md border border-gray-200 hover:border-gray-300 rounded-2xl p-5 transition-all cursor-pointer group relative"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, project)}
                      disabled={deletingId === project.id}
                      title="Delete project"
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      {deletingId === project.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="text-gray-900 font-semibold text-sm mb-1 truncate">{project.name}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                    {project.description || 'No description yet.'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}