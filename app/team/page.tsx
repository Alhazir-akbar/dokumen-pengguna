<<<<<<< HEAD
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
=======
// app/team-settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoUserdoc from '@/public/logoUserDoc';
import { workspaceApi, WorkspaceResponse, WorkspaceMemberResponse } from '@/services/workspaceApi';
import { getAuthToken } from '@/lib/auth';
import {
  Users, Settings as SettingsIcon, Brain, Trash2, Plus, AlertCircle, Loader2,
  ArrowLeft, UserPlus, Crown, Shield, Eye, X, CheckCircle2
} from 'lucide-react';

const ROLE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  owner: { label: 'Owner', icon: Crown, color: 'bg-amber-100 text-amber-700' },
  editor: { label: 'Editor', icon: Shield, color: 'bg-blue-100 text-blue-700' },
  viewer: { label: 'Viewer', icon: Eye, color: 'bg-gray-100 text-gray-600' },
};

export default function TeamSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'ai-rules'>('general');

  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [members, setMembers] = useState<WorkspaceMemberResponse[]>([]);
  const [aiRules, setAiRules] = useState<any[]>([]);
  const [teamNameInput, setTeamNameInput] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const [savingName, setSavingName] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviting, setInviting] = useState(false);

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleContent, setNewRuleContent] = useState('');

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoadError('Sesi habis, silakan login kembali.');
        setIsLoading(false);
        return;
      }
      try {
        const workspaces = await workspaceApi.getMyWorkspaces(token);
        if (!workspaces || workspaces.length === 0) {
          router.replace('/project-setup');
          return;
        }
        const ws = workspaces[0];
        setWorkspace(ws);
        setTeamNameInput(ws.name);

        const [memberList, ruleList] = await Promise.all([
          workspaceApi.getWorkspaceMembers(ws.id, token),
          workspaceApi.getWorkspaceAIRules(ws.id, token),
        ]);
        setMembers(memberList);
        setAiRules(ruleList);
      } catch (err: any) {
        setLoadError(err.message || 'Gagal memuat data team.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [router]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    const token = getAuthToken();
    if (!token) return;

    setSavingName(true);
    try {
      const updated = await workspaceApi.updateWorkspace(workspace.id, { name: teamNameInput }, token);
      setWorkspace(updated);
      showMsg('success', 'Nama team berhasil disimpan!');
    } catch (err: any) {
      showMsg('error', err.message || 'Gagal menyimpan nama team.');
    } finally {
      setSavingName(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!workspace) return;
    if (!confirm(`Hapus team "${workspace.name}"? SELURUH project di dalamnya akan ikut terhapus permanen. Tindakan ini tidak bisa dibatalkan.`)) return;

    const token = getAuthToken();
    if (!token) return;

    setDeletingTeam(true);
    try {
      await workspaceApi.deleteWorkspace(workspace.id, token);
      router.push('/project-setup');
    } catch (err: any) {
      showMsg('error', err.message || 'Gagal menghapus team.');
      setDeletingTeam(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    const token = getAuthToken();
    if (!token) return;

    setInviting(true);
    try {
      await workspaceApi.addWorkspaceMember(workspace.id, inviteEmail, inviteRole, token);
      const memberList = await workspaceApi.getWorkspaceMembers(workspace.id, token);
      setMembers(memberList);
      setShowInviteModal(false);
      setInviteEmail('');
      showMsg('success', `Berhasil mengundang ${inviteEmail}!`);
    } catch (err: any) {
      showMsg('error', err.message || 'Gagal mengundang anggota.');
>>>>>>> 23ab38d (add file)
    } finally {
      setInviting(false);
    }
  };

<<<<<<< HEAD
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
=======
  const handleRemoveMember = async (member: WorkspaceMemberResponse) => {
    if (!workspace) return;
    if (!confirm(`Keluarkan ${member.username} dari team?`)) return;
    const token = getAuthToken();
    if (!token) return;

    try {
      await workspaceApi.removeWorkspaceMember(workspace.id, member.user_id, token);
      setMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
      showMsg('success', `${member.username} berhasil dikeluarkan.`);
    } catch (err: any) {
      showMsg('error', err.message || 'Gagal menghapus anggota.');
    }
  };

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !newRuleName.trim() || !newRuleContent.trim()) return;
    const token = getAuthToken();
    if (!token) return;

    try {
      const newRule = await workspaceApi.createWorkspaceAIRule(workspace.id, { name: newRuleName, content: newRuleContent }, token);
      setAiRules([...aiRules, newRule]);
      setNewRuleName('');
      setNewRuleContent('');
      setShowRuleModal(false);
    } catch (err: any) {
      showMsg('error', err.message || 'Gagal menambahkan aturan AI.');
    }
  };

  const handleDeleteRule = async (ruleId: number) => {
    if (!confirm('Hapus aturan AI ini?')) return;
    const token = getAuthToken();
    if (!token) return;

    try {
      await workspaceApi.deleteWorkspaceAIRule(ruleId, token);
      setAiRules((prev) => prev.filter((r) => r.id !== ruleId));
    } catch (err: any) {
      showMsg('error', err.message || 'Gagal menghapus aturan AI.');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;
  }

  if (loadError) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-red-600 text-sm">{loadError}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
        <button onClick={() => router.push('/workspace')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </button>
        <LogoUserdoc />
      </header>

      <main className="max-w-2xl mx-auto pt-10 px-6 pb-16">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Team Settings</h1>

        {message.text && (
          <div className={`mb-4 p-3.5 rounded-xl flex items-center gap-2.5 text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="border-b border-gray-100 px-6 flex gap-6">
            <button onClick={() => setActiveTab('general')} className={`py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <SettingsIcon className="w-4 h-4" /> General
            </button>
            <button onClick={() => setActiveTab('members')} className={`py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'members' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <Users className="w-4 h-4" /> Team Members <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full">{members.length}</span>
            </button>
            <button onClick={() => setActiveTab('ai-rules')} className={`py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'ai-rules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <Brain className="w-4 h-4" /> AI Rules
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <form onSubmit={handleSaveName} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Team Name</label>
                  <input
                    type="text"
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleDeleteTeam}
                    disabled={deletingTeam}
                    className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer disabled:opacity-50"
                  >
                    {deletingTeam ? 'Menghapus...' : 'Delete Team'}
                  </button>
                  <button
                    type="submit"
                    disabled={savingName}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    {savingName ? 'Menyimpan...' : 'Save'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => setShowInviteModal(true)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer">
                    <UserPlus className="w-3.5 h-3.5" /> Invite Member
                  </button>
                </div>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {members.map((m) => {
                    const cfg = ROLE_CONFIG[m.role] || ROLE_CONFIG.viewer;
                    const Icon = cfg.icon;
                    return (
                      <div key={m.user_id} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {m.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{m.username}</p>
                          <p className="text-[11px] text-gray-500 truncate">{m.email}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${cfg.color}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                        {m.role !== 'owner' && (
                          <button onClick={() => handleRemoveMember(m)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
>>>>>>> 23ab38d (add file)
                    );
                  })}
                </div>
              </div>
<<<<<<< HEAD
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={inviting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-colors">
                  <UserPlus className="w-4 h-4" />
                  {inviting ? 'Mengundang...' : 'Undang Sekarang'}
=======
            )}

            {activeTab === 'ai-rules' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 -mt-2">
                  Aturan di sini berlaku untuk SEMUA project dalam team ini (di luar aturan spesifik per project).
                </p>
                <div className="flex justify-end">
                  <button onClick={() => setShowRuleModal(true)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Add Rule
                  </button>
                </div>
                {aiRules.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Brain className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No AI rules yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {aiRules.map((rule) => (
                      <div key={rule.id} className="p-4 border border-gray-200 rounded-xl flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{rule.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{rule.content}</p>
                        </div>
                        <button onClick={() => handleDeleteRule(rule.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Invite Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleInvite} className="p-5 space-y-4">
              <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as any)} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500">
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" disabled={inviting} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 cursor-pointer">
                  {inviting ? 'Inviting...' : 'Invite'}
>>>>>>> 23ab38d (add file)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
<<<<<<< HEAD
=======

      {showRuleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Add Team AI Rule</h3>
              <button onClick={() => setShowRuleModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddRule} className="p-5 space-y-4">
              <input type="text" required value={newRuleName} onChange={(e) => setNewRuleName(e.target.value)} placeholder="Nama aturan"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
              <textarea required rows={4} value={newRuleContent} onChange={(e) => setNewRuleContent(e.target.value)} placeholder="Isi aturan..."
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowRuleModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> 23ab38d (add file)
    </div>
  );
}