// lib/post-login-redirect.ts
import { workspaceApi } from '@/services/workspaceApi';
import { projectApi } from '@/services/projectsApi';

export async function resolvePostLoginRoute(token: string): Promise<string> {
  try {
    const workspaces = await workspaceApi.getMyWorkspaces(token);
    
    // KONDISI 1: Belum punya team sama sekali -> Masuk ke wizard /project-setup
    if (!workspaces || workspaces.length === 0) {
      return '/project-setup';
    }

    const activeWorkspace = workspaces[0];
    
    // Simpan data workspace ke localStorage agar siap dipakai komponen lain
    if (typeof window !== 'undefined') {
      localStorage.setItem('workspace_id', String(activeWorkspace.id));
      localStorage.setItem('team_id', String(activeWorkspace.id));
    }

    // Cek daftar project di team/workspace tersebut
    const projects = await projectApi.getProjects(activeWorkspace.id, token);
    const projectsList = Array.isArray(projects) ? projects : [];

    // KONDISI 3: Sudah punya project -> Langsung buka project pertama
    if (projectsList.length > 0) {
      const activeProjectId = projectsList[0].id;
      return `/stories?project_id=${activeProjectId}`;
    }

    // KONDISI 2: Sudah punya team, TAPI belum ada project -> Masuk ke /workspace
    return '/workspace';

  } catch (err) {
    console.error('Gagal menentukan halaman tujuan setelah login:', err);
    return '/workspace';
  }
}