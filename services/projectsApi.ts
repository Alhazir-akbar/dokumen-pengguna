// services/projectsApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
}

// ============ Helper ============

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// ============ API ============

export const projectApi = {
  // 1. Membuat proyek baru
  createProject: async (data: ProjectCreate, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal membuat proyek');
    }
    return response.json();
  },

  // 2. Mengambil semua proyek di workspace
  getProjects: async (workspaceId: number, token: string): Promise<ProjectResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects?workspace_id=${workspaceId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal mengambil daftar proyek');
    }
    return response.json();
  },

  // 3. Mendapatkan detail proyek
  getProjectById: async (id: number, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Proyek tidak ditemukan');
    }
    return response.json();
  },

  // 4. Update proyek
  updateProject: async (id: number, data: ProjectUpdate, token: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal memperbarui proyek');
    }
    return response.json();
  },

  // 5. Hapus proyek
  deleteProject: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal menghapus proyek');
    }
    return response.json();
  },

  // 6. Integrasi AI: saran deskripsi proyek singkat
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
      throw new Error(errorData.detail || 'AI gagal memberikan saran deskripsi');
    }
    return response.json();
  },

  // 7. Integrasi AI: saran user journey
  suggestJourney: async (
    data: SuggestJourneyPayload,
    token: string
  ): Promise<SuggestJourneyResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/suggest-journey`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'AI gagal memberikan saran user journey');
    }
    return response.json();
  },

  // 8. Integrasi AI: Generate Requirements
  generateRequirements: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}/generate-requirements`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'AI gagal memproses data');
    }
    return response.json();
  },

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
};