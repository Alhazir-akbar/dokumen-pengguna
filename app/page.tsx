// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectApi } from '@/services/projectsApi';
import { workspaceApi } from '@/services/workspaceApi';
import { getAuthToken } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleEntrypoint = async () => {
      const token = getAuthToken() || localStorage.getItem('token');
      
      if (!token) {
        console.log('Entrypoint: Token tidak ditemukan, lempar ke login.');
        router.push('/login');
        return;
      }

      try {
        const workspaces = await workspaceApi.getMyWorkspaces(token);
        console.log('Entrypoint Workspaces:', workspaces);
        
        const hasWorkspace = Array.isArray(workspaces) && workspaces.length > 0;

        if (!hasWorkspace) {
          console.log('Entrypoint: Belum punya workspace, ke /workspace');
          router.push('/workspace');
          return;
        }

        const activeWorkspace = workspaces[0];
        localStorage.setItem('workspace_id', String(activeWorkspace.id));
        localStorage.setItem('team_id', String(activeWorkspace.id));

        const projectsResponse: any = await projectApi.getProjects(activeWorkspace.id, token);
        console.log('Entrypoint Projects Response:', projectsResponse);

        const projectsList = Array.isArray(projectsResponse) 
          ? projectsResponse 
          : projectsResponse?.data || projectsResponse?.projects || [];

        console.log('Entrypoint Projects List Parsed:', projectsList);

        if (projectsList.length > 0) {
          const activeProjectId = projectsList[0].id;
          console.log(`Entrypoint: Project ditemukan! Meluncur ke /stories?project_id=${activeProjectId}`);
          router.push(`/stories?project_id=${activeProjectId}`);
          return;
        }

        console.log('Entrypoint: Workspace ada tapi project kosong, ke /workspace');
        router.push('/workspace');

      } catch (err) {
        console.error('Gagal memuat entrypoint:', err);
        router.push('/login');
      }
    };

    handleEntrypoint();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-500 font-medium animate-pulse">
          Menyiapkan workspace Anda...
        </p>
      </div>
    </div>
  );
}