// services/journeysApi.ts

<<<<<<< HEAD
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
=======
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper untuk menangani format error dari FastAPI
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

export interface JourneyStep {
  id?: number;
  step_order: number;
  title: string;
  description?: string;
}

export interface UserJourneyResponse {
  id: number;
  project_id: number;
  name: string;
  description?: string | null;
  steps: JourneyStep[];
  created_at?: string;
}

export interface CreateJourneyPayload {
  project_id: number;
  name: string;
  description?: string;
  steps: Array<{
    step_order: number;
    title: string;
    description?: string;
  }>;
}

// ============ Helper ============
>>>>>>> 23ab38d (add file)

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

<<<<<<< HEAD
// ============ Mapping backend -> frontend ============
// Backend: { id, name, description, project_id, steps: [{id, title, description, step_order, persona_id}] }
// Frontend (dipakai JourneysSidebar/JourneyDetailPanel): { id, title, description, stepsCount, personasCount, storiesCount, steps }

function mapJourneyFromBackend(j: any) {
  const sortedSteps = [...(j.steps || [])].sort((a, b) => a.step_order - b.step_order);
  const distinctPersonaIds = new Set(sortedSteps.map((s) => s.persona_id).filter(Boolean));

  return {
    id: String(j.id),
    title: j.name,
    description: j.description || '',
    stepsCount: sortedSteps.length,
    personasCount: distinctPersonaIds.size || 1,
    storiesCount: 0, // backend belum menautkan journey ke story
    steps: sortedSteps.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description || '',
    })),
  };
}

export const journeysApi = {
  fetchJourneys: async (projectId: number, token: string) => {
    const response = await fetch(`${API_URL}/journeys?project_id=${projectId}`, {
=======
// ============ API ============

export const journeysApi = {
  // Mengambil daftar user journey berdasarkan project_id
  getJourneysByProject: async (projectId: number, token: string): Promise<UserJourneyResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/journeys?project_id=${projectId}`, {
>>>>>>> 23ab38d (add file)
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'Gagal mengambil data Journeys');
    }
    const data = await response.json();
    return data.map(mapJourneyFromBackend);
  },

  createJourney: async (payload: { name: string; description: string; project_id: number }, token: string) => {
    const response = await fetch(`${API_URL}/journeys`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal membuat Journey');
    }
    return mapJourneyFromBackend(await response.json());
  },

  updateJourney: async (id: number, payload: { name: string; description: string }, token: string) => {
    const response = await fetch(`${API_URL}/journeys/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal memperbarui Journey');
    }
    return mapJourneyFromBackend(await response.json());
  },

  deleteJourney: async (id: number, token: string) => {
    const response = await fetch(`${API_URL}/journeys/${id}`, {
=======
      throw new Error(formatApiError(errorData, 'Gagal mengambil data user journey'));
    }
    return response.json();
  },

  // Mengambil detail user journey berdasarkan ID
  getJourneyById: async (journeyId: number, token: string): Promise<UserJourneyResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'User journey tidak ditemukan'));
    }
    return response.json();
  },

  // Membuat/Menyimpan user journey baru beserta langkah-langkahnya
  createJourney: async (data: CreateJourneyPayload, token: string): Promise<UserJourneyResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/journeys`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal menyimpan user journey'));
    }
    return response.json();
  },

  // Memperbarui user journey yang sudah ada
  updateJourney: async (journeyId: number, data: Partial<CreateJourneyPayload>, token: string): Promise<UserJourneyResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData, 'Gagal memperbarui user journey'));
    }
    return response.json();
  },

  // Menghapus user journey
  deleteJourney: async (journeyId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}`, {
>>>>>>> 23ab38d (add file)
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
<<<<<<< HEAD
      throw new Error(errorData.detail || 'Gagal menghapus Journey');
    }
    return response.json();
  },

  // Replace seluruh steps sekaligus (dipanggil saat user save perubahan steps di JourneyDetailPanel)
  saveSteps: async (
    id: number,
    steps: { title: string; description?: string }[],
    token: string
  ) => {
    const payload = {
      steps: steps.map((s, index) => ({
        title: s.title,
        description: s.description || '',
        step_order: index + 1,
      })),
    };
    const response = await fetch(`${API_URL}/journeys/${id}/steps`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Gagal menyimpan steps Journey');
    }
    return mapJourneyFromBackend(await response.json());
  },
=======
      throw new Error(formatApiError(errorData, 'Gagal menghapus user journey'));
    }
    return response.json();
  },
>>>>>>> 23ab38d (add file)
};