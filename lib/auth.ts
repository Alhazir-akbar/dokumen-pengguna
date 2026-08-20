// lib/auth.ts

export const AUTH_TOKEN_KEY = 'token';

/**
 * Ambil token auth dari localStorage.
 * Terpusat di sini supaya kalau nama key berubah di masa depan,
 * cukup ubah satu tempat ini, nggak perlu cari-cari ke semua komponen.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null; // guard untuk SSR / build time
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}