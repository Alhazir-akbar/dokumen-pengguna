// src/services/storiesApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;

export async function fetchNFRs(projectId: number, token: string) {
  const response = await fetch(`${API_URL}/stories/nfrs?project_id=${projectId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal mengambil data NFR');
  }
  return response.json();
}

export async function fetchUserTypes(projectId: number, token: string) {
  const response = await fetch(`${API_URL}/users/types?project_id=${projectId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal mengambil data User Types');
  }
  return response.json();
}

export async function fetchEpics(projectId: number, token: string) {
  const response = await fetch(`${API_URL}/stories/epics?project_id=${projectId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal mengambil data epics dari server');
  }
  return response.json();
}

export async function fetchStories(projectId: number, token: string) {
  const response = await fetch(`${API_URL}/stories?project_id=${projectId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal mengambil data stories dari server');
  }
  return response.json();
}

export async function submitWizardBatch(
  projectId: number,
  wizardData: { epics: any[]; userStories: any[] },
  token: string
) {
  const response = await fetch(`${API_URL}/stories/batch?project_id=${projectId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(wizardData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detailMessage = Array.isArray(errorData.detail)
      ? errorData.detail.map((d: any) => `${d.loc?.join('.')}: ${d.msg}`).join('; ')
      : errorData.detail;
    throw new Error(detailMessage || 'Gagal menyimpan data wizard ke database');
  }

  return response.json();
}

// TAMBAHAN: dipanggil saat user memilih "No, not at this stage" di step AiChoice.
// Membuat 1 Epic + 1 User Story contoh (lengkap acceptance criteria) untuk
// project_id ini, supaya dashboard Stories tidak kosong total.
// Idempotent di sisi backend -- aman dipanggil berkali-kali untuk project yang sama.
export async function seedExampleStory(projectId: number, token: string) {
  const response = await fetch(`${API_URL}/stories/seed-example?project_id=${projectId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal membuat example story');
  }

  return response.json();
}
export async function suggestStoryWithAi(
  params: {
    as_a?: string;
    i_want?: string;
    so_that?: string;
    epic_name?: string;
    project_name?: string;
  },
  token: string
) {
  const response = await fetch(`${API_URL}/stories/ai-suggest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal generate User Story dengan AI');
  }

  return response.json();
}

export async function createEpic(
  payload: { name: string; description?: string; project_id: number },
  token: string
) {
  const response = await fetch(`${API_URL}/stories/epics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal membuat Epic baru');
  }
  return response.json();
}

export async function suggestEpicWithAi(
  payload: {
    project_name: string;
    project_description?: string;
    application_type?: string;
    domain_business?: string;
    existing_epics?: string[];
  },
  token: string
) {
  const response = await fetch(`${API_URL}/stories/epics/ai-suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal generate draf Epic dengan AI');
  }
  return response.json();
}

export async function fetchNfrs(projectId: number, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/nfrs?project_id=${projectId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error('Gagal memuat data NFR.');
  return res.json();
}

export async function createNFR(
  payload: { category: string; description: string; project_id: number },
  token: string
) {
  const response = await fetch(`${API_URL}/stories/nfrs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal membuat NFR baru');
  }
  return response.json();
}

export async function updateNFR(
  id: number,
  payload: { category: string; description: string; project_id: number },
  token: string
) {
  const response = await fetch(`${API_URL}/stories/nfrs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal update NFR');
  }
  return response.json();
}

export async function deleteNFR(id: number, token: string) {
  const response = await fetch(`${API_URL}/stories/nfrs/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal menghapus NFR');
  }
  return response.json();
}

export async function suggestNfrWithAi(
  payload: {
    project_name: string;
    project_description?: string;
    application_type?: string;
    domain_business?: string;
    existing_categories?: string[];
  },
  token: string
) {
  const response = await fetch(`${API_URL}/stories/nfrs/ai-suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Gagal generate draf NFR dengan AI');
  }
  return response.json();
}