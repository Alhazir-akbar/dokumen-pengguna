// services/workspaceApi.ts
import { formatApiError } from '@/lib/api-error';

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
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
}

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const workspaceApi = {
  createWorkspace: async (data: WorkspaceCreate, token: string): Promise<WorkspaceResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData));
    }
    return response.json();
  },

  getMyWorkspaces: async (token: string): Promise<WorkspaceResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData));
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
      throw new Error(formatApiError(errorData));
    }
    return response.json();
  },

  updateWorkspace: async (id: number, data: { name: string }, token: string): Promise<WorkspaceResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData));
    }
    return response.json();
  },

  deleteWorkspace: async (id: number, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('API deleteWorkspace error details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      });
      throw new Error(formatApiError(data));
    }
    return data;
  },

  getWorkspaceAIRules: async (workspaceId: number, token: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces/${workspaceId}/ai-rules`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData));
    }
    return response.json();
  },

  createWorkspaceAIRule: async (workspaceId: number, data: { name: string; content: string }, token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces/${workspaceId}/ai-rules`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData));
    }
    return response.json();
  },

  deleteWorkspaceAIRule: async (ruleId: number, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/ai-rules/${ruleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData));
    }
  },

  addWorkspaceMember: async (
    workspaceId: number,
    email: string,
    role: 'editor' | 'viewer',
    token: string
  ): Promise<{ message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/api/workspaces/${workspaceId}/members?email=${encodeURIComponent(email)}&role=${role}`,
      { method: 'POST', headers: getAuthHeaders(token) }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(formatApiError(data));
    }
    return data;
  },

  removeWorkspaceMember: async (workspaceId: number, userId: number, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/workspaces/${workspaceId}/members/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(formatApiError(data));
    }
    return data;
  },
};