// services/workspacesApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface WorkspaceCreate {
  name: string;
}

export interface WorkspaceResponse {
  id: number;
  name: string;
  created_at: string;
  owner_id: number;
}

export interface WorkspaceMemberResponse {
  user_id: number;
  username: string;
  email: string;
  role: string;
  joined_at: string;
}

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const workspaceApi = {
  // Membuat workspace baru (user pembuat otomatis jadi owner-nya di backend)
  createWorkspace: async (data: WorkspaceCreate, token: string): Promise<WorkspaceResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal membuat ruang kerja');
    }
    return response.json();
  },

  // Mendapatkan seluruh workspace yang diikuti user yang sedang login
  getMyWorkspaces: async (token: string): Promise<WorkspaceResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal mengambil daftar ruang kerja');
    }
    return response.json();
  },

  getWorkspaceMembers: async (id: number, token: string): Promise<WorkspaceMemberResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces/${id}/members`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal mengambil daftar anggota ruang kerja');
    }
    return response.json();
  },
};