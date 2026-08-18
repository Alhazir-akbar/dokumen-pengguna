// app/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AppSidebar from '@/features/common/components/AppSidebar';
import {
  Users,
  UserPlus,
  Trash2,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  X,
  Crown,
  Shield,
  Eye,
  ChevronRight
} from 'lucide-react';

// ============ TIPE DATA ============

interface WorkspaceMember {
  user_id: number;
  username: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
}

// ============ KONFIGURASI ROLE ============

const ROLE_CONFIG = {
  owner: {
    label: 'Owner',
    icon: Crown,
    color: 'bg-amber-100 text-amber-700',
    desc: 'Akses penuh: kelola anggota & hapus proyek'
  },
  editor: {
    label: 'Editor',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700',
    desc: 'Dapat edit & generate konten AI'
  },
  viewer: {
    label: 'Viewer',
    icon: Eye,
    color: 'bg-gray-100 text-gray-600',
    desc: 'Hanya dapat melihat konten'
  },
};

// ============ KOMPONEN UTAMA ============

export default function TeamPage() {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviting, setInviting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    'Content-Type': 'application/json',
  });

  const showMsg = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
  };

  // Ambil data user & workspace dari localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    const wsId = localStorage.getItem('active_workspace_id');
    if (user) setCurrentUser(JSON.parse(user));
    if (wsId) setWorkspaceId(Number(wsId));
  }, []);

  // Ambil daftar anggota dari backend
  const fetchMembers = async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/workspaces/${workspaceId}/members`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setMembers(await res.json());
      else throw new Error('Gagal memuat anggota');
    } catch {
      showMsg('error', 'Gagal memuat daftar anggota tim.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) fetchMembers();
  }, [workspaceId]);

  // Cek apakah user saat ini adalah Owner
  const isCurrentUserOwner = members.find(
    m => m.user_id === currentUser?.id
  )?.role === 'owner';

  // Handler: Undang anggota baru
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/members?email=${encodeURIComponent(inviteEmail)}&role=${inviteRole}`,
        { method: 'POST', headers: getAuthHeaders() }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Gagal mengundang anggota');
      await fetchMembers();
      setShowModal(false);
      setInviteEmail('');
      showMsg('success', `Berhasil mengundang ${inviteEmail} sebagai ${inviteRole}!`);
    } catch (err: any) {
      showMsg('error', err.message);
    } finally {
      setInviting(false);
    }
  };

  // Handler: Hapus anggota
  const handleRemove = async (member: WorkspaceMember) => {
    if (!confirm(`Keluarkan ${member.username} dari workspace ini?`)) return;
    try {
      const res = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/members/${member.user_id}`,
        { method: 'DELETE', headers: getAuthHeaders() }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Gagal menghapus anggota');
      await fetchMembers();
      showMsg('success', `${member.username} berhasil dikeluarkan.`);
    } catch (err: any) {
      showMsg('error', err.message);
    }
  };

  // Format tanggal bergabung
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AppSidebar activeMenu="settings" />

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">Team Settings</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-sm text-gray-500">Kelola Anggota Tim</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs font-medium cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser?.full_name?.substring(0, 2).toUpperCase() || 'UD'}
            </div>
          </div>
        </header>

        {/* Isi Konten */}
        <div className="p-8 max-w-4xl w-full mx-auto space-y-5">

          {/* Notifikasi */}
          {statusMessage.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {statusMessage.type === 'success'
                ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              {statusMessage.text}
            </div>
          )}

          {/* Card Daftar Anggota */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header Card */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Anggota Workspace</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {members.length} anggota terdaftar dalam workspace ini.
                </p>
              </div>
              {isCurrentUserOwner && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Undang Anggota
                </button>
              )}
            </div>

            {/* Tabel Anggota */}
            {loading ? (
              <div className="p-12 text-center text-gray-400 text-sm">Memuat daftar anggota...</div>
            ) : members.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Belum ada anggota di workspace ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {members.map((member) => {
                  const roleConfig = ROLE_CONFIG[member.role];
                  const RoleIcon = roleConfig.icon;
                  const isMe = member.user_id === currentUser?.id;

                  return (
                    <div key={member.user_id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {member.username.substring(0, 2).toUpperCase()}
                      </div>

                      {/* Info Anggota */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 truncate">{member.username}</p>
                          {isMe && (
                            <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Anda</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Bergabung {formatDate(member.joined_at)}</p>
                      </div>

                      {/* Badge Role */}
                      <div className="shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleConfig.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleConfig.label}
                        </span>
                      </div>

                      {/* Tombol Hapus (hanya untuk Owner, dan tidak bisa hapus diri sendiri jika satu-satunya owner) */}
                      {isCurrentUserOwner && !isMe && (
                        <button
                          onClick={() => handleRemove(member)}
                          className="p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-rose-400 hover:text-rose-600 shrink-0"
                          title="Keluarkan anggota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card Keterangan Role */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Keterangan Role Anggota</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(ROLE_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <div key={key} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{config.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{config.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Undang Anggota */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Undang Anggota Baru</h3>
                <p className="text-xs text-gray-500 mt-0.5">Anggota harus sudah terdaftar di sistem terlebih dahulu.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Alamat Email Anggota
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Berikan Role Sebagai
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['editor', 'viewer'] as const).map(role => {
                    const cfg = ROLE_CONFIG[role];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setInviteRole(role)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-colors cursor-pointer ${
                          inviteRole === role
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`p-1.5 rounded-lg ${cfg.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{cfg.label}</p>
                          <p className="text-[10px] text-gray-500 leading-tight">{cfg.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={inviting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-colors">
                  <UserPlus className="w-4 h-4" />
                  {inviting ? 'Mengundang...' : 'Undang Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}