// app/workspace/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogoUserdoc from '@/public/logoUserDoc';
import AccountMenu from '@/features/common/components/accountMenu';
import { workspaceApi, WorkspaceResponse } from '@/services/workspaceApi';
import { projectApi, ProjectResponse } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';
import { setStoredProjectId, clearStoredProjectId, getStoredProjectId } from '@/lib/project-context';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';
import { FolderKanban, Plus, Trash2, Loader2, RefreshCw, Users, Pencil, Check, X } from 'lucide-react';

const CARD_ACCENTS = [
  'bg-blue-500/20 text-blue-300 border-blue-400/30',
  'bg-purple-500/20 text-purple-300 border-purple-400/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  'bg-amber-500/20 text-amber-300 border-amber-400/30',
  'bg-rose-500/20 text-rose-300 border-rose-400/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
];

export default function WorkspacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlWorkspaceId = searchParams.get('workspace_id');

  const resetStore = useWizardStore((s: any) => s.resetStore);

  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [isUpdatingTeam, setIsUpdatingTeam] = useState(false);

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
        const workspaceList = await workspaceApi.getMyWorkspaces(token);
        if (!workspaceList || workspaceList.length === 0) {
          router.replace('/project-setup');
          return;
        }

        // Tentukan workspace aktif berdasarkan query param dari AccountMenu
        let activeWs = workspaceList[0];
        if (urlWorkspaceId) {
          const found = workspaceList.find((w: any) => String(w.id) === String(urlWorkspaceId));
          if (found) activeWs = found;
        }

        setWorkspace(activeWs);
        setTeamNameInput(activeWs.name);

        // Ambil data proyek terbaru dari backend berdasarkan ID workspace yang aktif
        const projectList = await projectApi.getProjects(activeWs.id, token);
        setProjects(projectList);
      } catch (err: any) {
        console.error('Gagal memuat data workspace:', err);
        setLoadError(err.message || 'Gagal memuat data workspace.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [urlWorkspaceId, reloadToken, router]);

  const handleOpenProject = (id: number) => {
    setStoredProjectId(id);
    router.push(`/stories?project_id=${id}`);
  };

  const handleCreateNew = () => {
    resetStore();
    router.push('/project-setup');
  };

  const handleUpdateWorkspaceName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !teamNameInput.trim()) return;

    const token = getAuthToken();
    if (!token) return;

    setIsUpdatingTeam(true);
    try {
      const updated = await workspaceApi.updateWorkspace(workspace.id, { name: teamNameInput.trim() }, token);
      setWorkspace(updated);
      setIsEditingTeam(false);
    } catch (err: any) {
      console.error('Gagal memperbarui nama workspace:', err);
      alert(err.message || 'Gagal memperbarui nama tim.');
    } finally {
      setIsUpdatingTeam(false);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, project: ProjectResponse) => {
    e.stopPropagation();
    if (!confirm(`Hapus project "${project.name}"? Seluruh data requirements akan terhapus permanen.`)) return;

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="text-center max-w-md bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md">
          <p className="font-medium mb-2 text-red-300">Gagal memuat data</p>
          <p className="text-blue-200 text-sm mb-4">{loadError}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer hover:bg-blue-50"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }
      `}</style>

      {/* Header Navigasi */}
      <header className="h-16 border-b border-white/10 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sm:px-10 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <LogoUserdoc />
          {isEditingTeam ? (
            <form onSubmit={handleUpdateWorkspaceName} className="flex items-center gap-2">
              <input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                className="bg-white/10 border border-blue-300/40 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:outline-none"
                autoFocus
              />
              <button type="submit" disabled={isUpdatingTeam} className="text-green-300 hover:text-white p-1 cursor-pointer">
                {isUpdatingTeam ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => setIsEditingTeam(false)} className="text-red-300 hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">{workspace?.name || 'Your Team'}</span>
              <button
                onClick={() => {
                  setTeamNameInput(workspace?.name || '');
                  setIsEditingTeam(true);
                }}
                className="text-blue-300/60 hover:text-white p-1 transition-colors cursor-pointer"
                title="Edit Team Name"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/team-settings')}
            className="text-xs text-blue-200 bg-white/5 hover:bg-white/10 border border-white/15 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm font-medium cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-blue-300" /> Team Settings
          </button>
          <AccountMenu />
        </div>
      </header>

      {/* Konten Utama Workspace */}
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Projects Dashboard</h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1">
              {projects.length} active project{projects.length !== 1 ? 's' : ''} in workspace <span className="text-white font-semibold">{workspace?.name}</span>
            </p>
          </div>

          {projects.length > 0 && (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-semibold shadow-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="bg-white/10 border-2 border-dashed border-blue-400/30 rounded-3xl p-14 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FolderKanban className="w-7 h-7 text-blue-300" />
            </div>
            <h3 className="text-white font-bold text-base mb-1">Belum ada project di tim {workspace?.name}</h3>
            <p className="text-blue-200/80 text-xs sm:text-sm mb-6 max-w-md mx-auto">
              Workspace ini bersih dari proyek. Buat project baru untuk mulai menyusun spesifikasi dan AI requirements.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-semibold shadow-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, index) => {
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              return (
                <div
                  key={project.id}
                  onClick={() => handleOpenProject(project.id)}
                  className="group relative bg-white/10 hover:bg-white/15 border border-blue-300/30 hover:border-blue-300/60 rounded-2xl p-5 backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${accent}`}>
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <button
                        onClick={(e) => handleDeleteProject(e, project)}
                        disabled={deletingId === project.id}
                        title="Delete project"
                        className="p-2 text-blue-200/70 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-50 border border-transparent hover:border-red-500/30"
                      >
                        {deletingId === project.id ? <Loader2 className="w-4 h-4 animate-spin text-red-300" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                    <h3 className="text-white font-bold text-base mb-1.5 truncate">{project.name}</h3>
                    <p className="text-blue-200/80 text-xs line-clamp-3 leading-relaxed mb-4">
                      {project.description || 'No description provided for this project.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-300 font-medium">
                    <span>Buka Workspace</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}