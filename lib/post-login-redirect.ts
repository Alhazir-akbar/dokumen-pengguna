// lib/post-login-redirect.ts
import { workspaceApi } from '@/services/workspaceApi';

/**
 * Menentukan halaman tujuan setelah login berhasil:
 * - Kalau user sudah punya team/workspace -> ke /workspace (hub yang menampilkan
 *   semua project di team itu, user pilih sendiri mau buka yang mana atau buat baru)
 * - Kalau user belum pernah punya team sama sekali -> ke wizard /project-setup
 *   (mulai dari step "Setup your team")
 *
 * Dipanggil sekali setelah token didapat dari endpoint login, sebelum melakukan redirect.
 */
export async function resolvePostLoginRoute(token: string): Promise<string> {
  try {
    const workspaces = await workspaceApi.getMyWorkspaces(token);
    if (!workspaces || workspaces.length === 0) {
      return '/project-setup';
    }
    return '/workspace';
  } catch (err) {
    console.error('Gagal menentukan halaman tujuan setelah login:', err);
    // Kalau gagal cek (misal network error), fallback aman ke wizard
    return '/project-setup';
  }
}