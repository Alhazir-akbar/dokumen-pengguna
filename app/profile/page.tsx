<<<<<<< HEAD
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import AppSidebar from '@/features/common/components/AppSidebar';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  
  // State Ubah Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State Status & Loading
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // State Pesan Notifikasi
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: ''
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // 1. Ambil Data Profil Pengguna dari Backend
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });

      if (!res.ok) {
        throw new Error('Gagal mengambil data profil');
      }

      const data: UserProfile = await res.json();
      setProfile(data);
      setFullName(data.full_name || '');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Terjadi kesalahan jaringan' });
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 2. Handler Simpan Perubahan Nama
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({ full_name: fullName })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Gagal memperbarui profil');
      }

      const updatedUser = await res.json();
      setProfile(updatedUser);
      setStatusMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
=======
// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoUserdoc from '@/public/logoUserDoc';
import { profileApi } from '@/services/profileApi';
import { getAuthToken } from '@/lib/auth';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoadError('Sesi habis, silakan login kembali.');
        setIsLoading(false);
        return;
      }
      try {
        const profile = await profileApi.getProfile(token);
        setFullName(profile.full_name || '');
        setEmail(profile.email);
      } catch (err: any) {
        setLoadError(err.message || 'Gagal memuat profil.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      await profileApi.updateProfile({ full_name: fullName }, token);
      setProfileMsg({ type: 'success', text: 'Profil berhasil disimpan!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Gagal menyimpan profil.' });
>>>>>>> 23ab38d (add file)
    } finally {
      setSavingProfile(false);
    }
  };

<<<<<<< HEAD
  // 3. Handler Upload Foto Avatar ke MinIO
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'File harus berupa gambar (JPG/PNG/GIF)' });
      return;
    }

    setUploadingAvatar(true);
    setStatusMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Gagal mengunggah foto profil');
      }

      const updatedUser = await res.json();
      setProfile(updatedUser);
      setStatusMessage({ type: 'success', text: 'Foto profil berhasil diperbarui!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 4. Handler Ubah Kata Sandi
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (newPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'Kata sandi baru minimal harus 8 karakter!' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok!' });
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/profile/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Gagal mengubah kata sandi');
      }

      setStatusMessage({ type: 'success', text: 'Kata sandi berhasil diubah!' });
=======
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    setSavingPassword(true);
    setPasswordMsg({ type: '', text: '' });
    try {
      await profileApi.changePassword({ current_password: currentPassword, new_password: newPassword }, token);
      setPasswordMsg({ type: 'success', text: 'Kata sandi berhasil diubah!' });
>>>>>>> 23ab38d (add file)
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
<<<<<<< HEAD
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar Utama */}
      <AppSidebar activeMenu="settings" />

      {/* Area Konten Utama */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Atas */}
        <header className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">Manage Profile</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs font-medium cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'UD'}
            </div>
          </div>
        </header>

        {/* Isi Konten Halaman */}
        <div className="p-8 max-w-4xl w-full mx-auto space-y-6">
          
          {/* Pesan Alert Notifikasi */}
          {statusMessage.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {loadingProfile ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
              Memuat data profil...
            </div>
          ) : (
            <>
              {/* Seksi 1: Informasi Profil & Foto */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Informasi Pribadi</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Kelola foto profil, nama pengguna, dan email kamu.</p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>

                <div className="p-6 space-y-6">
                  {/* Foto Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl overflow-hidden border-2 border-white shadow-md">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          fullName ? fullName.substring(0, 2).toUpperCase() : 'UD'
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md cursor-pointer transition-transform hover:scale-105">
                        <Camera className="w-3.5 h-3.5" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarChange} 
                          className="hidden" 
                          disabled={uploadingAvatar}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{fullName || profile?.username}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{uploadingAvatar ? 'Mengunggah foto...' : 'Klik ikon kamera untuk mengganti foto profil.'}</p>
                    </div>
                  </div>

                  {/* Form Update Profil */}
                  <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Lengkap</label>
                      <div className="relative mt-1.5">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Alamat Email (Read-Only)</label>
                      <div className="relative mt-1.5">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={profile?.email || ''}
                          disabled
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-sm text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Sesuai aturan BRD (AC-06), alamat email tidak dapat diubah secara langsung.</p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        {savingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Seksi 2: Keamanan & Ubah Kata Sandi */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Keamanan Akun</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Perbarui kata sandi akun kamu secara berkala.</p>
                  </div>
                  <KeyRound className="w-5 h-5 text-gray-600" />
                </div>

                <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Kata Sandi Saat Ini</label>
                    <div className="relative mt-1.5">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Kata Sandi Baru</label>
                      <div className="relative mt-1.5">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Konfirmasi Kata Sandi Baru</label>
                      <div className="relative mt-1.5">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi baru"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      {changingPassword ? 'Memperbarui...' : 'Ubah Kata Sandi'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
=======
      setPasswordMsg({ type: 'error', text: err.message || 'Gagal mengubah kata sandi.' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-sm">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </header>

      <main className="max-w-lg mx-auto pt-12 px-6">
        <div className="flex justify-center mb-6">
          <LogoUserdoc />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Manage Profile</h1>

        <form onSubmit={handleSaveProfile} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 mb-6">
          {profileMsg.text && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {profileMsg.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-gray-400 mt-1">Email tidak dapat diubah dari sini.</p>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {savingProfile ? 'Menyimpan...' : 'Save Profile'}
          </button>
        </form>

        <form onSubmit={handleChangePassword} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-900">Change Password</h2>

          {passwordMsg.text && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
              passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {passwordMsg.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {savingPassword ? 'Menyimpan...' : 'Change Password'}
          </button>
        </form>
>>>>>>> 23ab38d (add file)
      </main>
    </div>
  );
}