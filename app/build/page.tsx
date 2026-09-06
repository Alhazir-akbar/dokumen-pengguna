// app/build/page.tsx
'use client';

<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
>>>>>>> 23ab38d (add file)
import AppSidebar from '@/features/common/components/AppSidebar';
import {
  Code,
  Layers,
  BookOpen,
  ClipboardList,
  MessageSquare,
  Save,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertCircle,
  X,
<<<<<<< HEAD
  ChevronRight
} from 'lucide-react';

// ============ TIPE DATA ============

interface TechStack {
  id: number;
  project_id: number;
  ui_layer: string | null;
  app_layer: string | null;
  data_layer: string | null;
  integration_layer: string | null;
}

interface CodingGuideline {
  id: number;
  project_id: number;
  title: string;
  content: string;
  created_at: string;
}

interface DevelopmentPlan {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  created_at: string;
}

type ActiveTab = 'tech-stack' | 'guidelines' | 'dev-plans';

// ============ KOMPONEN UTAMA ============

export default function BuildPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tech-stack');
  const [projectId, setProjectId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Ambil project ID dari localStorage
  useEffect(() => {
    const id = localStorage.getItem('active_project_id');
    if (id) setProjectId(Number(id));
  }, []);
=======
  ChevronRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { buildApi, CodingGuideline, DevelopmentPlan } from '@/services/buildApi';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';
import { getStoredProjectId, setStoredProjectId } from '@/lib/project-context';

type ActiveTab = 'tech-stack' | 'guidelines' | 'dev-plans';

function BuildPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectIdParam = searchParams.get('project_id');

  const [activeTab, setActiveTab] = useState<ActiveTab>('tech-stack');
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  // PERBAIKAN: sebelumnya project_id diambil dari localStorage key 'active_project_id'
  // yang sebenarnya tidak pernah di-set di alur manapun saat ini, jadi Build selalu
  // menampilkan "Tidak ada proyek aktif" walau project sudah ada. Sekarang mengikuti
  // pola yang sama dengan Stories/Users/Journeys: baca dari URL, fallback localStorage.
  useEffect(() => {
    if (!projectIdParam) {
      const stored = getStoredProjectId();
      if (stored) {
        router.replace(`/build?project_id=${stored}`);
        return;
      }
    }

    const loadProject = async () => {
      if (!projectIdParam) {
        setLoadError('project_id tidak ditemukan di URL.');
        setIsLoading(false);
        return;
      }
      const token = getAuthToken();
      if (!token) {
        setLoadError('Sesi habis, silakan login kembali.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError('');
      try {
        const project = await projectApi.getProjectById(Number(projectIdParam), token);
        setProjectName(project.name);
        setStoredProjectId(projectIdParam);
      } catch (err: any) {
        console.error('Gagal memuat data project:', err);
        setLoadError(err.message || 'Gagal memuat data project.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectIdParam, reloadToken, router]);

  const handleRetry = useCallback(() => setReloadToken((n) => n + 1), []);
>>>>>>> 23ab38d (add file)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
  };

<<<<<<< HEAD
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    'Content-Type': 'application/json',
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AppSidebar activeMenu="build" />

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
=======
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <p className="text-red-600 font-medium mb-2">Gagal memuat data</p>
          <p className="text-sm text-gray-500 mb-4">{loadError}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba lagi
          </button>
        </div>
      </div>
    );
  }

  const projectIdNum = Number(projectIdParam);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <AppSidebar activeMenu="build" projectId={projectIdParam} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">{projectName || 'Untitled Project'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
>>>>>>> 23ab38d (add file)
            <Code className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">Build</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-sm text-gray-500">
              {activeTab === 'tech-stack' ? 'Technology Stack' : activeTab === 'guidelines' ? 'Coding Guidelines' : 'Development Plans'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs font-medium cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">UD</div>
          </div>
        </header>

<<<<<<< HEAD
        {/* Tab Navigasi */}
=======
>>>>>>> 23ab38d (add file)
        <div className="border-b border-gray-200 bg-white px-6">
          <nav className="flex gap-1">
            {[
              { key: 'tech-stack', label: 'Technology Stack', icon: Layers },
              { key: 'guidelines', label: 'Coding Guidelines', icon: BookOpen },
              { key: 'dev-plans', label: 'Development Plans', icon: ClipboardList },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

<<<<<<< HEAD
        {/* Notifikasi */}
=======
>>>>>>> 23ab38d (add file)
        {statusMessage.text && (
          <div className={`mx-6 mt-4 p-3.5 rounded-xl flex items-center gap-3 text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {statusMessage.type === 'success'
              ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {statusMessage.text}
          </div>
        )}

<<<<<<< HEAD
        {/* Konten Tab */}
        <div className="flex-1 overflow-y-auto p-6">
          {!projectId ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              <Code className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Tidak ada proyek aktif. Silakan buka proyek terlebih dahulu.</p>
            </div>
          ) : (
            <>
              {activeTab === 'tech-stack' && (
                <TechStackTab projectId={projectId} apiUrl={apiUrl} getAuthHeaders={getAuthHeaders} showMessage={showMessage} />
              )}
              {activeTab === 'guidelines' && (
                <GuidelinesTab projectId={projectId} apiUrl={apiUrl} getAuthHeaders={getAuthHeaders} showMessage={showMessage} />
              )}
              {activeTab === 'dev-plans' && (
                <DevPlansTab projectId={projectId} apiUrl={apiUrl} getAuthHeaders={getAuthHeaders} showMessage={showMessage} />
              )}
            </>
=======
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'tech-stack' && (
            <TechStackTab projectId={projectIdNum} showMessage={showMessage} />
          )}
          {activeTab === 'guidelines' && (
            <GuidelinesTab projectId={projectIdNum} showMessage={showMessage} />
          )}
          {activeTab === 'dev-plans' && (
            <DevPlansTab projectId={projectIdNum} showMessage={showMessage} />
>>>>>>> 23ab38d (add file)
          )}
        </div>
      </main>
    </div>
  );
}

<<<<<<< HEAD
// ============ TAB 1: TECH STACK ============

function TechStackTab({ projectId, apiUrl, getAuthHeaders, showMessage }: any) {
  const [techStack, setTechStack] = useState<TechStack | null>(null);
  const [form, setForm] = useState({ ui_layer: '', app_layer: '', data_layer: '', integration_layer: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/api/projects/${projectId}/tech-stack`, { headers: getAuthHeaders() })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setTechStack(data);
=======
export default function BuildPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <BuildPageContent />
    </Suspense>
  );
}

// ============ TAB 1: TECH STACK ============

function TechStackTab({ projectId, showMessage }: any) {
  const [form, setForm] = useState({ ui_layer: '', app_layer: '', data_layer: '', integration_layer: '' });
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) return;
      setIsLoading(true);
      try {
        const data = await buildApi.getTechStack(projectId, token);
        if (data) {
>>>>>>> 23ab38d (add file)
          setForm({
            ui_layer: data.ui_layer || '',
            app_layer: data.app_layer || '',
            data_layer: data.data_layer || '',
            integration_layer: data.integration_layer || '',
          });
        }
<<<<<<< HEAD
      });
=======
      } catch (err: any) {
        showMessage('error', err.message || 'Gagal memuat tech stack.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
>>>>>>> 23ab38d (add file)
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/projects/${projectId}/tech-stack`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Gagal menyimpan tech stack');
      const data = await res.json();
      setTechStack(data);
      showMessage('success', 'Technology Stack berhasil disimpan!');
    } catch {
      showMessage('error', 'Gagal menyimpan. Pastikan backend menyala.');
=======
    const token = getAuthToken();
    if (!token) {
      showMessage('error', 'Sesi habis, silakan login kembali.');
      return;
    }
    setSaving(true);
    try {
      await buildApi.upsertTechStack(projectId, form, token);
      showMessage('success', 'Technology Stack berhasil disimpan!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menyimpan tech stack.');
>>>>>>> 23ab38d (add file)
    } finally {
      setSaving(false);
    }
  };

  const layers = [
    { key: 'ui_layer', label: 'UI Layer', placeholder: 'Contoh: Next.js, React, Vue.js', desc: 'Framework antarmuka pengguna' },
    { key: 'app_layer', label: 'Application Layer', placeholder: 'Contoh: FastAPI, Django, Express', desc: 'Framework backend & logika bisnis' },
    { key: 'data_layer', label: 'Data Layer', placeholder: 'Contoh: PostgreSQL, SQLite, MongoDB', desc: 'Database & penyimpanan data' },
    { key: 'integration_layer', label: 'Integration Layer', placeholder: 'Contoh: REST API, GraphQL, WebSocket', desc: 'Protokol & integrasi layanan eksternal' },
  ];

<<<<<<< HEAD
=======
  if (isLoading) {
    return <div className="max-w-3xl py-12 flex justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>;
  }

>>>>>>> 23ab38d (add file)
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">Konfigurasi Technology Stack</h2>
          <p className="text-xs text-gray-500 mt-0.5">Tentukan teknologi yang digunakan pada setiap lapisan arsitektur proyek.</p>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {layers.map(({ key, label, placeholder, desc }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">{label}</label>
              <p className="text-[11px] text-gray-400 mt-0.5 mb-1.5">{desc}</p>
              <input
                type="text"
                value={(form as any)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Tech Stack'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============ TAB 2: CODING GUIDELINES ============

<<<<<<< HEAD
function GuidelinesTab({ projectId, apiUrl, getAuthHeaders, showMessage }: any) {
  const [guidelines, setGuidelines] = useState<CodingGuideline[]>([]);
=======
function GuidelinesTab({ projectId, showMessage }: any) {
  const [guidelines, setGuidelines] = useState<CodingGuideline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> 23ab38d (add file)
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CodingGuideline | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  const fetchGuidelines = async () => {
<<<<<<< HEAD
    const res = await fetch(`${apiUrl}/api/projects/${projectId}/guidelines`, { headers: getAuthHeaders() });
    if (res.ok) setGuidelines(await res.json());
=======
    const token = getAuthToken();
    if (!token) return;
    setIsLoading(true);
    try {
      setGuidelines(await buildApi.getGuidelines(projectId, token));
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal memuat guidelines.');
    } finally {
      setIsLoading(false);
    }
>>>>>>> 23ab38d (add file)
  };

  useEffect(() => { fetchGuidelines(); }, [projectId]);

  const openAddModal = () => { setEditingItem(null); setForm({ title: '', content: '' }); setShowModal(true); };
  const openEditModal = (item: CodingGuideline) => { setEditingItem(item); setForm({ title: item.title, content: item.content }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `${apiUrl}/api/projects/${projectId}/guidelines/${editingItem.id}`
        : `${apiUrl}/api/projects/${projectId}/guidelines`;
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      await fetchGuidelines();
      setShowModal(false);
      showMessage('success', editingItem ? 'Guideline berhasil diperbarui!' : 'Guideline baru berhasil ditambahkan!');
    } catch {
      showMessage('error', 'Gagal menyimpan guideline.');
=======
    const token = getAuthToken();
    if (!token) {
      showMessage('error', 'Sesi habis, silakan login kembali.');
      return;
    }
    setSaving(true);
    try {
      if (editingItem) {
        await buildApi.updateGuideline(projectId, editingItem.id, form, token);
      } else {
        await buildApi.createGuideline(projectId, form, token);
      }
      await fetchGuidelines();
      setShowModal(false);
      showMessage('success', editingItem ? 'Guideline berhasil diperbarui!' : 'Guideline baru berhasil ditambahkan!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menyimpan guideline.');
>>>>>>> 23ab38d (add file)
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus guideline ini?')) return;
<<<<<<< HEAD
    const res = await fetch(`${apiUrl}/api/projects/${projectId}/guidelines/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) { await fetchGuidelines(); showMessage('success', 'Guideline berhasil dihapus!'); }
    else showMessage('error', 'Gagal menghapus guideline.');
=======
    const token = getAuthToken();
    if (!token) return;
    try {
      await buildApi.deleteGuideline(projectId, id, token);
      await fetchGuidelines();
      showMessage('success', 'Guideline berhasil dihapus!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menghapus guideline.');
    }
>>>>>>> 23ab38d (add file)
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Coding Guidelines</h2>
          <p className="text-xs text-gray-500 mt-0.5">Panduan standar penulisan kode untuk seluruh tim developer.</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> Tambah Guideline
        </button>
      </div>

<<<<<<< HEAD
      {guidelines.length === 0 ? (
=======
      {isLoading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>
      ) : guidelines.length === 0 ? (
>>>>>>> 23ab38d (add file)
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Belum ada coding guideline. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guidelines.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditModal(item)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-gray-500">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

<<<<<<< HEAD
      {/* Modal */}
=======
>>>>>>> 23ab38d (add file)
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold">{editingItem ? 'Edit Guideline' : 'Tambah Guideline Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Judul Guideline</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Penamaan Variabel, Struktur Folder"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Isi Guideline</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Tuliskan aturan atau panduan coding di sini..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 cursor-pointer">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ TAB 3: DEVELOPMENT PLANS ============

const STATUS_CONFIG = {
  todo: { label: 'To Do', color: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700' },
};

<<<<<<< HEAD
function DevPlansTab({ projectId, apiUrl, getAuthHeaders, showMessage }: any) {
  const [plans, setPlans] = useState<DevelopmentPlan[]>([]);
=======
function DevPlansTab({ projectId, showMessage }: any) {
  const [plans, setPlans] = useState<DevelopmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> 23ab38d (add file)
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DevelopmentPlan | null>(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo' });
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
<<<<<<< HEAD
    const res = await fetch(`${apiUrl}/api/projects/${projectId}/dev-plans`, { headers: getAuthHeaders() });
    if (res.ok) setPlans(await res.json());
=======
    const token = getAuthToken();
    if (!token) return;
    setIsLoading(true);
    try {
      setPlans(await buildApi.getDevPlans(projectId, token));
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal memuat development plans.');
    } finally {
      setIsLoading(false);
    }
>>>>>>> 23ab38d (add file)
  };

  useEffect(() => { fetchPlans(); }, [projectId]);

  const openAddModal = () => { setEditingItem(null); setForm({ title: '', description: '', status: 'todo' }); setShowModal(true); };
  const openEditModal = (item: DevelopmentPlan) => { setEditingItem(item); setForm({ title: item.title, description: item.description || '', status: item.status }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `${apiUrl}/api/projects/${projectId}/dev-plans/${editingItem.id}`
        : `${apiUrl}/api/projects/${projectId}/dev-plans`;
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      await fetchPlans();
      setShowModal(false);
      showMessage('success', editingItem ? 'Plan berhasil diperbarui!' : 'Development plan baru ditambahkan!');
    } catch {
      showMessage('error', 'Gagal menyimpan plan.');
=======
    const token = getAuthToken();
    if (!token) {
      showMessage('error', 'Sesi habis, silakan login kembali.');
      return;
    }
    setSaving(true);
    try {
      if (editingItem) {
        await buildApi.updateDevPlan(projectId, editingItem.id, form, token);
      } else {
        await buildApi.createDevPlan(projectId, form, token);
      }
      await fetchPlans();
      setShowModal(false);
      showMessage('success', editingItem ? 'Plan berhasil diperbarui!' : 'Development plan baru ditambahkan!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menyimpan plan.');
>>>>>>> 23ab38d (add file)
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus development plan ini?')) return;
<<<<<<< HEAD
    const res = await fetch(`${apiUrl}/api/projects/${projectId}/dev-plans/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) { await fetchPlans(); showMessage('success', 'Plan berhasil dihapus!'); }
    else showMessage('error', 'Gagal menghapus plan.');
  };

  const handleStatusChange = async (item: DevelopmentPlan, newStatus: string) => {
    const res = await fetch(`${apiUrl}/api/projects/${projectId}/dev-plans/${item.id}`, {
      method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) { await fetchPlans(); showMessage('success', 'Status plan diperbarui!'); }
=======
    const token = getAuthToken();
    if (!token) return;
    try {
      await buildApi.deleteDevPlan(projectId, id, token);
      await fetchPlans();
      showMessage('success', 'Plan berhasil dihapus!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menghapus plan.');
    }
  };

  const handleStatusChange = async (item: DevelopmentPlan, newStatus: string) => {
    const token = getAuthToken();
    if (!token) return;
    try {
      await buildApi.updateDevPlan(projectId, item.id, { status: newStatus }, token);
      await fetchPlans();
      showMessage('success', 'Status plan diperbarui!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal memperbarui status.');
    }
>>>>>>> 23ab38d (add file)
  };

  const grouped = {
    todo: plans.filter(p => p.status === 'todo'),
    in_progress: plans.filter(p => p.status === 'in_progress'),
    done: plans.filter(p => p.status === 'done'),
  };

<<<<<<< HEAD
=======
  if (isLoading) {
    return <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>;
  }

>>>>>>> 23ab38d (add file)
  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Development Plans</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola rencana pengembangan proyek berdasarkan status pengerjaannya.</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> Tambah Plan
        </button>
      </div>

<<<<<<< HEAD
      {/* Kanban Board */}
=======
>>>>>>> 23ab38d (add file)
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['todo', 'in_progress', 'done'] as const).map(statusKey => (
          <div key={statusKey} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[statusKey].color}`}>
                  {STATUS_CONFIG[statusKey].label}
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium">{grouped[statusKey].length} item</span>
            </div>
            <div className="p-3 space-y-2 min-h-32">
              {grouped[statusKey].length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">Kosong</p>
              )}
              {grouped[statusKey].map(item => (
                <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEditModal(item)} className="p-1 hover:bg-gray-200 rounded-lg cursor-pointer text-gray-400">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-rose-100 rounded-lg cursor-pointer text-rose-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
<<<<<<< HEAD
                  {/* Tombol Pindah Status */}
=======
>>>>>>> 23ab38d (add file)
                  <div className="flex gap-1 mt-2">
                    {statusKey !== 'todo' && (
                      <button onClick={() => handleStatusChange(item, statusKey === 'in_progress' ? 'todo' : 'in_progress')}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors cursor-pointer">
                        ← Mundur
                      </button>
                    )}
                    {statusKey !== 'done' && (
                      <button onClick={() => handleStatusChange(item, statusKey === 'todo' ? 'in_progress' : 'done')}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors cursor-pointer">
                        Maju →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Modal */}
=======
>>>>>>> 23ab38d (add file)
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold">{editingItem ? 'Edit Plan' : 'Tambah Development Plan'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Judul Plan</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Setup Authentication API"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Deskripsi (Opsional)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat rencana pengembangan ini..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 cursor-pointer">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}