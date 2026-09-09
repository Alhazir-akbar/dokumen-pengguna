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

export interface TokenUsageHistoryItem {
  id: number;
  feature: string;
  provider: string;
  model_name: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  created_at: string;
}

export interface ProviderInfo {
  name: string;
  provider_key: string;
  model: string;
  status: string;
}

export interface TokenUsageData {
  monthly_quota: number;
  monthly_used: number;
  remaining_tokens: number;
  usage_percentage: number;
  usage_by_provider: Record<string, number>;
  usage_by_feature: Record<string, number>;
  providers_info: ProviderInfo[];
  history: TokenUsageHistoryItem[];
}

export const settingsApi = {
  // Aturan project-level (bukan workspace-level)
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

  // Mengambil statistik token dan kuota
  getTokenUsage: async (token: string, projectId?: number): Promise<TokenUsageData> => {
    const url = projectId 
      ? `${API_BASE_URL}/api/tokens/usage?project_id=${projectId}`
      : `${API_BASE_URL}/api/tokens/usage`;
      
    const res = await fetch(url, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal memuat data token usage'));
    }
    return res.json();
  }
};