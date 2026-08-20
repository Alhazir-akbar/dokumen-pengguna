// src/services/storiesApi.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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