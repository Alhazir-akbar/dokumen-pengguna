// services/projectsApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// TAMBAHAN: FastAPI mengembalikan error validasi (422) sebagai `detail: [{loc, msg, type}, ...]`,
// bukan string. Kalau langsung dilempar ke `new Error(errorData.detail)`, JS mengubah array
// jadi "[object Object],[object Object],..." yang tidak berguna untuk debugging. Helper ini
// mengubahnya jadi pesan yang menyebutkan field mana saja yang bermasalah dan kenapa.
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

<<<<<<< Updated upstream
=======
// TAMBAHAN: dipakai tombol AI Suggest di step UserTypeGoals
export interface SuggestUserGoalsPayload {
  project_name: string;
  user_type_name: string;
  user_type_description?: string;
}

export interface SuggestUserGoalsResponse {
  goals: string;
  frustrations: string;
}

// TAMBAHAN: dipakai tombol AI Suggestion di step UserJourney
export interface SuggestUserJourneyPayload {
  project_name: string;
  project_description?: string;
  user_types?: string[];
}

export interface SuggestUserJourneyStepItem {
  title: string;
  description: string;
}

export interface SuggestUserJourneyResponse {
  journey: string;
  steps: SuggestUserJourneyStepItem[];
}

>>>>>>> Stashed changes
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal membuat proyek'));
    }
    return response.json();
  },

  getProjects: async (workspaceId: number, token: string): Promise<ProjectResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects?workspace_id=${workspaceId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menghapus proyek'));
    }
    return response.json();
  },

<<<<<<< Updated upstream
  // 6. Integrasi AI: saran deskripsi proyek singkat (dipakai di step DescribeProject)
=======
>>>>>>> Stashed changes
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran deskripsi'));
    }
    return response.json();
  },

<<<<<<< Updated upstream
  // 7. Integrasi AI: Generate Requirements (epics, user stories, user types, NFRs)
=======
  // TAMBAHAN: dipanggil tombol AI Suggest (Sparkles) di step UserTypeGoals wizard
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran goals & frustrations'));
    }
    return response.json();
  },

  // TAMBAHAN: dipanggil tombol AI Suggestion di step UserJourney wizard
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran user journey'));
    }
    return response.json();
  },

>>>>>>> Stashed changes
  generateRequirements: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}/generate-requirements`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memproses data'));
    }
    return response.json();
  },

<<<<<<< Updated upstream
  // 8. Integrasi AI: Simpan hasil requirements (yang sudah diedit user) ke DB
=======
>>>>>>> Stashed changes
  saveRequirements: async (id: number, aiRequirementsData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}/save-requirements`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(aiRequirementsData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menyimpan draf kebutuhan'));
    }
    return response.json();
  }
};