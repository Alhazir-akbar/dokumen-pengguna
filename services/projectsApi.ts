// services/projectsApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function formatApiError(errorData: any, fallback: string): string {
  const detail = errorData?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: any) => {
        const field = Array.isArray(d.loc) ? d.loc.join('.') : 'field';
        return `${field}: ${d.msg}`;
      })
      .join(' | ');
  }
  return fallback;
}

// 401 = token invalid/expired -> memang sesi habis, paksa logout.
// 403 = user login VALID tapi gak punya akses ke resource spesifik ini
// (misal: bukan anggota workspace tsb) -> BUKAN soal token, jangan logout
// paksa. Biarkan errornya dilempar biasa supaya UI bisa nampilin pesan
// yang sesuai ("Anda tidak memiliki akses...") tanpa nendang user ke /login.
function handleUnauthorized(status: number): boolean {
  if (status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return true;
  }
  return false;
}

// ============ Interfaces ============

export interface ProjectCreate {
  name: string;
  description?: string;
  workspace_id: number;
  application_type?: string;
  domain_business?: string;
  target_users?: string;
  business_goals?: string;
  repo_url?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  application_type?: string;
  domain_business?: string;
  target_users?: string;
  business_goals?: string;
  repo_url?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description?: string | null;
  application_type?: string | null;
  domain_business?: string | null;
  target_users?: string | null;
  business_goals?: string | null;
  repo_url?: string | null;
  created_at: string;
  workspace_id: number;
  creator_id: number;
}

export interface SuggestDescriptionPayload {
  project_name: string;
  platform_type: string;
}

export interface SuggestDescriptionResponse {
  description: string;
}

export interface SuggestUserGoalsPayload {
  project_name: string;
  user_type_name: string;
  user_type_description?: string;
}

export interface SuggestUserGoalsResponse {
  goals: string;
  frustrations: string;
}

export interface SuggestUserJourneyPersonaItem {
  name: string;
  user_type?: string;
  about?: string;
}

export interface SuggestUserJourneyPayload {
  project_name: string;
  project_description?: string;
  personas?: SuggestUserJourneyPersonaItem[];  
}

export interface SuggestUserJourneyStepItem {
  title: string;
  description: string;
  persona_name?: string | null; 
}

export interface SuggestUserJourneyResponse {
  journey: string;
  steps: SuggestUserJourneyStepItem[];
}

export interface SuggestUserTypeDescriptionPayload {
  project_name: string;
  user_type_name: string;
  project_description?: string;
}

export interface SuggestUserTypeDescriptionResponse {
  description: string;
}

// ============ Helper ============

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// ============ API ============

export const projectApi = {
  createProject: async (data: ProjectCreate, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal membuat proyek'));
    }
    return response.json();
  },

  /**
   * PENTING: selalu kirim workspaceId secara eksplisit kalau kamu tahu nilainya
   * (jangan andalkan fallback localStorage di bawah -- itu cuma jaring pengaman
   * untuk pemanggilan lama, tapi rawan salah/kosong kalau localStorage belum
   * sempat keisi di alur tertentu, misal baru selesai wizard).
   */
  getProjects: async (workspaceIdOrToken?: any, tokenArg?: string): Promise<ProjectResponse[]> => {
    let url = `${API_BASE_URL}/api/projects`;
    let token = '';
    let workspaceId: any = null;

    if (typeof workspaceIdOrToken === 'number') {
      workspaceId = workspaceIdOrToken;
      token = tokenArg || '';
    } else if (typeof workspaceIdOrToken === 'string') {
      token = workspaceIdOrToken;
    }

    if (!workspaceId) {
      workspaceId = localStorage.getItem('workspace_id') || localStorage.getItem('team_id');
    }

    if (workspaceId) {
      url += `?workspace_id=${workspaceId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      if (handleUnauthorized(response.status)) return [];
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal mengambil daftar proyek'));
    }
    return response.json();
  },

  getProjectById: async (id: number, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Proyek tidak ditemukan'));
    }
    return response.json();
  },

  updateProject: async (id: number, data: ProjectUpdate, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal memperbarui proyek'));
    }
    return response.json();
  },

  deleteProject: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menghapus proyek'));
    }
    return response.json();
  },

  suggestDescription: async (
    data: SuggestDescriptionPayload,
    token: string
  ): Promise<SuggestDescriptionResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/suggest-description`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran deskripsi'));
    }
    return response.json();
  },

  suggestUserGoals: async (
    data: SuggestUserGoalsPayload,
    token: string
  ): Promise<SuggestUserGoalsResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/suggest-user-goals`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran goals & frustrations'));
    }
    return response.json();
  },

  // BARU: generate deskripsi untuk SATU user type (tombol Sparkles di step
  // UserTypes wizard). Lihat SuggestUserTypeDescriptionPayload di atas.
  suggestUserTypeDescription: async (
    data: SuggestUserTypeDescriptionPayload,
    token: string
  ): Promise<SuggestUserTypeDescriptionResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/suggest-user-type-description`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran deskripsi tipe pengguna'));
    }
    return response.json();
  },

  suggestUserJourney: async (
    data: SuggestUserJourneyPayload,
    token: string
  ): Promise<SuggestUserJourneyResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/suggest-user-journey`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran user journey'));
    }
    return response.json();
  },

  generateRequirements: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}/generate-requirements`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memproses data'));
    }
    return response.json();
  },

  saveRequirements: async (id: number, aiRequirementsData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}/save-requirements`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(aiRequirementsData),
    });
    if (!response.ok) {
      handleUnauthorized(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menyimpan draf kebutuhan'));
    }
    return response.json();
  }
};