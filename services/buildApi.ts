// services/buildApi.ts
import { formatApiError } from '@/lib/api-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export interface TechStack {
  id: number;
  project_id: number;
  ui_layer: string | null;
  app_layer: string | null;
  data_layer: string | null;
  integration_layer: string | null;
}

export interface CodingGuideline {
  id: number;
  project_id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface DevelopmentPlan {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  created_at: string;
}

export const buildApi = {
  getTechStack: async (projectId: number, token: string): Promise<TechStack | null> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/tech-stack`, {
      headers: getAuthHeaders(token),
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal mengambil tech stack'));
    }
    return response.json();
  },

  upsertTechStack: async (
    projectId: number,
    data: { ui_layer: string; app_layer: string; data_layer: string; integration_layer: string },
    token: string
  ): Promise<TechStack> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/tech-stack`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menyimpan tech stack'));
    }
    return response.json();
  },

  getGuidelines: async (projectId: number, token: string): Promise<CodingGuideline[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/guidelines`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal mengambil coding guidelines'));
    }
    return response.json();
  },

  createGuideline: async (
    projectId: number,
    data: { title: string; content: string },
    token: string
  ): Promise<CodingGuideline> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/guidelines`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal membuat guideline'));
    }
    return response.json();
  },

  updateGuideline: async (
    projectId: number,
    guidelineId: number,
    data: { title: string; content: string },
    token: string
  ): Promise<CodingGuideline> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/guidelines/${guidelineId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal memperbarui guideline'));
    }
    return response.json();
  },

  deleteGuideline: async (projectId: number, guidelineId: number, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/guidelines/${guidelineId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menghapus guideline'));
    }
  },

  getDevPlans: async (projectId: number, token: string): Promise<DevelopmentPlan[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/dev-plans`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal mengambil development plans'));
    }
    return response.json();
  },

  createDevPlan: async (
    projectId: number,
    data: { title: string; description: string; status: string },
    token: string
  ): Promise<DevelopmentPlan> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/dev-plans`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal membuat development plan'));
    }
    return response.json();
  },

  updateDevPlan: async (
    projectId: number,
    planId: number,
    data: Partial<{ title: string; description: string; status: string }>,
    token: string
  ): Promise<DevelopmentPlan> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/dev-plans/${planId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal memperbarui development plan'));
    }
    return response.json();
  },

  deleteDevPlan: async (projectId: number, planId: number, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/dev-plans/${planId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menghapus development plan'));
    }
  },

  // TAMBAHAN: dipanggil sekali otomatis begitu wizard project-setup selesai, supaya
  // Build page (Tech Stack, Guidelines, Dev Plan) sudah terisi draf awal dari AI.
  // Sengaja tidak melempar error kalau gagal sebagian -- ini best-effort, tidak boleh
  // menghambat proses "Finished, Create my Project" di wizard.
  generateDefaults: async (projectId: number, token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/generate-build-defaults`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal auto-generate Build defaults'));
    }
    return response.json();
  },
};