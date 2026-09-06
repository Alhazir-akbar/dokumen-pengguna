// services/settingsApi.ts
import { formatApiError } from '@/lib/api-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export interface AIRule {
  id: number;
  name: string;
  content: string;
  created_at: string;
  project_id?: number | null;
  workspace_id?: number | null;
}

export const settingsApi = {
  // Aturan project-level (bukan workspace-level) — sesuai yang dipakai di halaman Settings project
  getProjectAIRules: async (projectId: number, token: string): Promise<AIRule[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/ai-rules`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal mengambil aturan AI'));
    }
    return response.json();
  },

  createProjectAIRule: async (
    projectId: number,
    data: { name: string; content: string },
    token: string
  ): Promise<AIRule> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/ai-rules`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menambahkan aturan AI'));
    }
    return response.json();
  },

  // TAMBAHAN: dipanggil tombol "Generate" -- hasilnya BELUM disimpan, cuma draf
  // saran yang ditampilkan ke user untuk dipilih.
  generateAIRuleSuggestions: async (
    projectId: number,
    token: string
  ): Promise<{ name: string; content: string }[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/ai-rules/generate`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'AI gagal memberikan saran aturan'));
    }
    const data = await response.json();
    return data.suggestions || [];
  },

  deleteAIRule: async (ruleId: number, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/ai-rules/${ruleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menghapus aturan AI'));
    }
  },
};