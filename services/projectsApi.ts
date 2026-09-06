// services/projectsApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

<<<<<<< HEAD
=======
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

>>>>>>> 23ab38d (add file)
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

<<<<<<< HEAD
export interface SuggestJourneyPayload {
  project_name: string;
  journey_context: string;
}

export interface SuggestJourneyResponse {
  journey: string;
}

export interface RequirementsPayload {
  user_types: Array<{ name: string; description: string }>;
  epics: Array<{ name: string; description: string }>;
  user_stories: Array<{
    epic_name: string;
    story_name: string;
    user_type: string;
    description: string;
    acceptance_criteria: string[];
    tech_notes: string[];
    test_cases: string[];
  }>;
  nfrs: Array<{ category: string; description: string }>;
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
>>>>>>> 23ab38d (add file)
}

// ============ Helper ============

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// ============ API ============

export const projectApi = {
<<<<<<< HEAD
  // 1. Membuat proyek baru
=======
>>>>>>> 23ab38d (add file)
  createProject: async (data: ProjectCreate, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'Gagal membuat proyek');
=======
      throw new Error(formatApiError(errorData, 'Gagal membuat proyek'));
>>>>>>> 23ab38d (add file)
    }
    return response.json();
  },

<<<<<<< HEAD
  // 2. Mengambil semua proyek di workspace
=======
>>>>>>> 23ab38d (add file)
  getProjects: async (workspaceId: number, token: string): Promise<ProjectResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects?workspace_id=${workspaceId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'Gagal mengambil daftar proyek');
=======
      throw new Error(formatApiError(errorData, 'Gagal mengambil daftar proyek'));
>>>>>>> 23ab38d (add file)
    }
    return response.json();
  },

<<<<<<< HEAD
  // 3. Mendapatkan detail proyek
=======
>>>>>>> 23ab38d (add file)
  getProjectById: async (id: number, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'Proyek tidak ditemukan');
=======
      throw new Error(formatApiError(errorData, 'Proyek tidak ditemukan'));
>>>>>>> 23ab38d (add file)
    }
    return response.json();
  },

<<<<<<< HEAD
  // 4. Update proyek
=======
>>>>>>> 23ab38d (add file)
  updateProject: async (id: number, data: ProjectUpdate, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'Gagal memperbarui proyek');
=======
      throw new Error(formatApiError(errorData, 'Gagal memperbarui proyek'));
>>>>>>> 23ab38d (add file)
    }
    return response.json();
  },

<<<<<<< HEAD
  // 5. Hapus proyek
=======
>>>>>>> 23ab38d (add file)
  deleteProject: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'Gagal menghapus proyek');
=======
      throw new Error(formatApiError(errorData, 'Gagal menghapus proyek'));
>>>>>>> 23ab38d (add file)
    }
    return response.json();
  },

<<<<<<< HEAD
  // 6. Integrasi AI: saran deskripsi proyek singkat
=======
>>>>>>> 23ab38d (add file)
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
<<<<<<< HEAD
      throw new Error(errorData.detail || 'AI gagal memberikan saran deskripsi');
=======
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran deskripsi'));
>>>>>>> 23ab38d (add file)
    }
    return response.json();
  },

<<<<<<< HEAD
  // 7. Integrasi AI: saran user journey
  suggestJourney: async (
    data: SuggestJourneyPayload,
    token: string
  ): Promise<SuggestJourneyResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/suggest-journey`, {
=======
  // 7. Integrasi AI: Generate Requirements (epics, user stories, user types, NFRs)
  // TAMBAHAN: dipanggil tombol AI Suggest (Sparkles) di step UserTypeGoals wizard
  suggestUserGoals: async (
    data: SuggestUserGoalsPayload,
    token: string
  ): Promise<SuggestUserGoalsResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/suggest-user-goals`, {
>>>>>>> 23ab38d (add file)
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'AI gagal memberikan saran user journey');
=======
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
>>>>>>> 23ab38d (add file)
    }
    return response.json();
  },

<<<<<<< HEAD
  // 8. Integrasi AI: Generate Requirements
=======
>>>>>>> 23ab38d (add file)
  generateRequirements: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}/generate-requirements`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'AI gagal memproses data');
=======
      throw new Error(formatApiError(errorData, 'AI gagal memproses data'));
>>>>>>> 23ab38d (add file)
    }
    return response.json();
  },

<<<<<<< HEAD
  // 9. Integrasi AI: Simpan hasil requirements ke DB dengan sanitasi payload yang aman
  saveRequirements: async (id: number, rawData: any, token: string) => {
    // Normalisasi struktur data agar sesuai dengan Pydantic Schema backend
    const sanitizedPayload: RequirementsPayload = {
      user_types: (rawData.user_types || []).map((ut: any) => ({
        name: ut.name || 'General User',
        description: ut.description || 'No description provided',
      })),
      epics: (rawData.epics || []).map((ep: any) => ({
        name: ep.name || ep.title || 'Core Module',
        description: ep.description || 'No description provided',
      })),
      user_stories: (rawData.user_stories || []).map((st: any) => ({
        epic_name: st.epic_name || st.epicTitle || 'Core Module',
        story_name: st.story_name || st.storyName || 'Manage Feature',
        user_type: st.user_type || st.userType || 'User',
        description: st.description || 'System feature requirement',
        acceptance_criteria: st.acceptance_criteria || ['Given user is active, When interacting, Then system processes.'],
        tech_notes: st.tech_notes || ['Implement standard API and database storage.'],
        test_cases: st.test_cases || ['Functional Test: Verify feature works as expected.'],
      })),
      nfrs: (rawData.nfrs || []).map((nfr: any) => ({
        category: nfr.category || 'Performance',
        description: nfr.description || 'System should perform efficiently under normal load.',
      })),
    };

    const response = await fetch(`${API_BASE_URL}/api/projects/${id}/save-requirements`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(sanitizedPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal menyimpan draf kebutuhan');
    }
    return response.json();
  },
=======
  // 8. Integrasi AI: Simpan hasil requirements (yang sudah diedit user) ke DB

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
>>>>>>> 23ab38d (add file)
};