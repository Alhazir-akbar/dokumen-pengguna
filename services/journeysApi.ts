// services/journeysApi.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

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
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
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
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
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
};