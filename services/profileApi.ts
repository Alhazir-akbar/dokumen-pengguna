// services/profileApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const profileApi = {
  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Gagal mengambil profil');
    return response.json();
  },

  updateProfile: async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Gagal memperbarui profil');
    return response.json();
  },

  updatePassword: async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/password`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Gagal mengubah password');
    return response.json();
  },
};