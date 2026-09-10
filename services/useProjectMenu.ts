// features/stories/hooks/useProjectMenu.ts
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

/**
 * Logic bersama untuk dropdown "Project Menu" (Create new Project / Project
 * Settings / Change Project). Dipakai di StoriesSidebar dan EmptyDetailPanel
 * supaya perilakunya identik di kedua tempat tanpa duplikat kode.
 */
export function useProjectMenu(
  workspaceId?: number | null,
  activeProjectId?: string | number | null
) {
  const router = useRouter();
  const resetStore = useWizardStore((s: any) => s.resetStore);
  const setWizardWorkspaceId = useWizardStore((s: any) => s.setWorkspaceId);

  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      // Tunggu sampai workspaceId diketahui -- jangan fetch dengan workspace_id
      // yang salah/kosong (penyebab bug 403 sebelumnya).
      if (!workspaceId) return;
      const token = getAuthToken();
      if (!token) return;
      try {
        const response: any = await projectApi.getProjects(workspaceId, token);
        const list = Array.isArray(response) ? response : response?.data || response?.projects || [];
        setProjects(list);
      } catch (err) {
        console.error('Gagal memuat list project:', err);
      }
    };
    fetchProjects();
  }, [workspaceId, activeProjectId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  const handleCreateNewProject = () => {
    close();
    resetStore();
    // Workspace sudah pasti ada di titik ini -> isi ke wizard store langsung
    // supaya TeamName.tsx auto-skip ke step NameProject.
    if (workspaceId) setWizardWorkspaceId(workspaceId);
    router.push('/project-setup');
  };

  const goToSettings = () => {
    close();
    router.push(`/settings?project_id=${activeProjectId}`);
  };

  const openProject = (projectId: number) => {
    close();
    router.push(`/stories?project_id=${projectId}`);
  };

  const deleteProject = async (e: React.MouseEvent, pId: number, pName: string) => {
    e.stopPropagation();
    if (!confirm(`Hapus project "${pName}"? Seluruh data di dalamnya akan terhapus permanen.`)) return;

    const token = getAuthToken();
    if (!token) return;

    try {
      await projectApi.deleteProject(pId, token);
      const remaining = projects.filter((p) => p.id !== pId);
      setProjects(remaining);

      if (String(pId) === String(activeProjectId)) {
        if (remaining.length > 0) {
          router.push(`/stories?project_id=${remaining[0].id}`);
        } else {
          router.push('/workspace');
        }
      }
    } catch (err: any) {
      console.error('Gagal menghapus project:', err);
      alert(err.message || 'Gagal menghapus project.');
    }
  };

  return {
    isOpen,
    toggle,
    close,
    containerRef,
    projects,
    handleCreateNewProject,
    goToSettings,
    openProject,
    deleteProject,
  };
}