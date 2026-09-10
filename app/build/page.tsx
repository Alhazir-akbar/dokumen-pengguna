// app/build/page.tsx
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import AccountMenu from '@/features/common/components/accountMenu'
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
  ChevronRight,
  Loader2,
  RefreshCw,
  Sparkles,
  Download,
  Monitor,
  Cpu,
  Database,
  Settings2,
  FolderTree,
  ShieldCheck,
  LayoutGrid,
  ServerCog,
  ArrowRight,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import { buildApi, TechStack, CodingGuideline, DevelopmentPlan, EpicOption } from '@/services/buildApi';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';
import { getStoredProjectId, setStoredProjectId } from '@/lib/project-context';

type ActiveTab = 'tech-stack' | 'guidelines' | 'dev-plans';

function BuildPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectIdParam = searchParams.get('project_id');

  const [activeTab, setActiveTab] = useState<ActiveTab>('tech-stack');
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        alert(`Journey file "${file.name}" berhasil di-upload!`);
      }
    };
    input.click();
  };

    const handleDownload = () => {
    const projectName = project?.name || 'project';
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${projectName}-builds.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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
        const proj = await projectApi.getProjectById(Number(projectIdParam), token);
        setProject(proj);
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

  const showMessage = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
  };

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
            <span className="text-sm font-medium text-gray-500">{project?.name || 'Untitled Project'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <Code className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">Build</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-sm text-gray-500">
              {activeTab === 'tech-stack' ? 'Technologies' : activeTab === 'guidelines' ? 'Coding Guidelines' : 'Dev Plans'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-500">
              <button
                onClick={handleUpload}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer"
                title="Upload Document"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer"
                title="Download / Export JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              </div>
            <AccountMenu />
          </div>
        </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-56 border-r border-gray-200 bg-white shrink-0 py-4">
            <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Implementation Tools</p>
            <nav className="flex flex-col gap-0.5 px-2">
              {[
                { key: 'tech-stack', label: 'Technologies', sub: 'Technology stack and architecture', icon: Layers },
                { key: 'guidelines', label: 'Coding guidelines', sub: 'Coding best practices and standards', icon: Code },
                { key: 'dev-plans', label: 'Dev Plans', sub: 'Plans to build the project with AI', icon: ClipboardList },
              ].map(({ key, label, sub, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as ActiveTab)}
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    activeTab === key ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${activeTab === key ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>
                    <span className={`block text-sm font-medium ${activeTab === key ? 'text-gray-900' : 'text-gray-700'}`}>{label}</span>
                    <span className="block text-[11px] text-gray-400 leading-tight">{sub}</span>
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 overflow-y-auto p-6">
            {statusMessage.text && (
              <div className={`mb-4 p-3.5 rounded-xl flex items-center gap-3 text-sm font-medium ${
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

            {activeTab === 'tech-stack' && (
              <TechStackTab projectId={projectIdNum} applicationType={project?.application_type} showMessage={showMessage} />
            )}
            {activeTab === 'guidelines' && (
              <GuidelinesTab projectId={projectIdNum} showMessage={showMessage} />
            )}
            {activeTab === 'dev-plans' && (
              <DevPlansTab projectId={projectIdNum} showMessage={showMessage} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

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

// ============ Komponen bantu ============

function BetaHeader({ title }: { title: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">BETA</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">In beta and may change, please contact us with feedback or issues.</p>
    </div>
  );
}

function OverviewCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Overview</p>
      <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
      />
    </div>
  );
}

// ============ TAB 1: TECH STACK ============

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-50/60', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100 text-blue-600' },
  emerald: { bg: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-100 text-emerald-600' },
  violet: { bg: 'bg-violet-50/60', border: 'border-violet-200', text: 'text-violet-700', iconBg: 'bg-violet-100 text-violet-600' },
  amber: { bg: 'bg-amber-50/60', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100 text-amber-600' },
};

const emptyTechForm = {
  target_users: '', scale: '', platform: '',
  ui_language: '', ui_framework: '', ui_library: '',
  app_language: '', app_framework: '',
  data_layer: '', integration_layer: '',
};

function TechStackTab({ projectId, applicationType, showMessage }: any) {
  const [data, setData] = useState<TechStack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState(emptyTechForm);

  const load = async () => {
    const token = getAuthToken();
    if (!token) return;
    setIsLoading(true);
    try {
      setData(await buildApi.getTechStack(projectId, token));
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal memuat tech stack.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [projectId]);

  const openEdit = () => {
    setForm({
      target_users: data?.target_users || '',
      scale: data?.scale || '',
      platform: data?.platform || '',
      ui_language: data?.ui_language || '',
      ui_framework: data?.ui_framework || '',
      ui_library: data?.ui_library || '',
      app_language: data?.app_language || '',
      app_framework: data?.app_framework || '',
      data_layer: data?.data_layer || '',
      integration_layer: data?.integration_layer || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) { showMessage('error', 'Sesi habis, silakan login kembali.'); return; }
    setSaving(true);
    try {
      const updated = await buildApi.upsertTechStack(projectId, form, token);
      setData(updated);
      setShowModal(false);
      showMessage('success', 'Technology Stack berhasil disimpan!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menyimpan tech stack.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    const token = getAuthToken();
    if (!token) { showMessage('error', 'Sesi habis, silakan login kembali.'); return; }
    setGenerating(true);
    try {
      const updated = await buildApi.generateTechStack(projectId, token);
      setForm({
        target_users: updated.target_users || '',
        scale: updated.scale || '',
        platform: updated.platform || '',
        ui_language: updated.ui_language || '',
        ui_framework: updated.ui_framework || '',
        ui_library: updated.ui_library || '',
        app_language: updated.app_language || '',
        app_framework: updated.app_framework || '',
        data_layer: updated.data_layer || '',
        integration_layer: updated.integration_layer || '',
      });
      setData(updated);
      showMessage('success', 'Saran Technology Stack berhasil dibuat oleh AI!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal generate tech stack.');
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl py-12 flex justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>;
  }

  const has = (v?: string | null) => !!(v && v.trim());
  const displayed = (v?: string | null) => v || 'Not configured';
  const valClass = (v?: string | null) => has(v) ? 'text-gray-800 font-medium' : 'text-gray-400 italic';

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-start justify-between gap-4">
        <BetaHeader title="Technology Stack Configuration" />
        <button onClick={openEdit} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors cursor-pointer shrink-0">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      <OverviewCard>
        Configure your project&apos;s application details, development approach, and architecture stack. This is
        used to help generate coding guidelines, and also development plans when it comes time for implementation.
      </OverviewCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Application Details</p>
          <p className="text-xs text-gray-400 mb-3">Basic application configuration</p>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Type</span><span className={valClass(applicationType)}>{displayed(applicationType)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Users</span><span className={valClass(data?.target_users)}>{displayed(data?.target_users)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Scale</span><span className={valClass(data?.scale)}>{displayed(data?.scale)}</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Development Approach</p>
          <p className="text-xs text-gray-400 mb-3">Development team and AI assistance configuration</p>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Platform</span><span className={valClass(data?.platform)}>{displayed(data?.platform)}</span></div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Architecture</p>
        <p className="text-xs text-gray-400 mb-3">Application layers and technology stack</p>

        <div className={`rounded-2xl border p-4 mb-3 ${COLOR_CLASSES.blue.bg} ${COLOR_CLASSES.blue.border}`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLOR_CLASSES.blue.iconBg}`}><Monitor className="w-4 h-4" /></div>
            <span className={`text-sm font-bold ${COLOR_CLASSES.blue.text}`}>User Interface Layer</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 pl-10">
            <span>Language: <span className={valClass(data?.ui_language)}>{displayed(data?.ui_language)}</span></span>
            <span>Framework: <span className={valClass(data?.ui_framework)}>{displayed(data?.ui_framework)}</span></span>
            <span>UI Library: <span className={valClass(data?.ui_library)}>{displayed(data?.ui_library)}</span></span>
          </div>
        </div>

        <div className="flex justify-center mb-3"><ChevronRight className="w-4 h-4 text-gray-300 rotate-90" /></div>

        <div className={`rounded-2xl border p-4 mb-3 ${COLOR_CLASSES.emerald.bg} ${COLOR_CLASSES.emerald.border}`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLOR_CLASSES.emerald.iconBg}`}><Cpu className="w-4 h-4" /></div>
            <span className={`text-sm font-bold ${COLOR_CLASSES.emerald.text}`}>Application Layer</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 pl-10">
            <span>Language: <span className={valClass(data?.app_language)}>{displayed(data?.app_language)}</span></span>
            <span>Framework: <span className={valClass(data?.app_framework)}>{displayed(data?.app_framework)}</span></span>
          </div>
        </div>

        <div className="flex justify-center mb-3"><ChevronRight className="w-4 h-4 text-gray-300 rotate-90" /></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`rounded-2xl border p-4 ${COLOR_CLASSES.violet.bg} ${COLOR_CLASSES.violet.border}`}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLOR_CLASSES.violet.iconBg}`}><Database className="w-4 h-4" /></div>
              <span className={`text-sm font-bold ${COLOR_CLASSES.violet.text}`}>Data Layer</span>
            </div>
            <div className="text-xs text-gray-500 pl-10">
              Database: <span className={valClass(data?.data_layer)}>{displayed(data?.data_layer)}</span>
            </div>
          </div>
          <div className={`rounded-2xl border p-4 ${COLOR_CLASSES.amber.bg} ${COLOR_CLASSES.amber.border}`}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLOR_CLASSES.amber.iconBg}`}><Settings2 className="w-4 h-4" /></div>
              <span className={`text-sm font-bold ${COLOR_CLASSES.amber.text}`}>Integration Layer</span>
            </div>
            <div className="text-xs text-gray-500 pl-10">
              <span className={valClass(data?.integration_layer)}>{displayed(data?.integration_layer)}</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-base font-semibold">Edit Technology Stack</h3>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleGenerate} disabled={generating}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" /> {generating ? 'Generating...' : 'Generate with AI'}
                </button>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Users" value={form.target_users} onChange={(v) => setForm({ ...form, target_users: v })} placeholder="Contoh: 1.000 - 10.000 pengguna" />
                <Field label="Scale" value={form.scale} onChange={(v) => setForm({ ...form, scale: v })} placeholder="Contoh: Small to Medium Scale" />
              </div>
              <Field label="Platform" value={form.platform} onChange={(v) => setForm({ ...form, platform: v })} placeholder="Contoh: Web-based, AI-assisted development" />

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">User Interface Layer</p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Language" value={form.ui_language} onChange={(v) => setForm({ ...form, ui_language: v })} placeholder="TypeScript" />
                  <Field label="Framework" value={form.ui_framework} onChange={(v) => setForm({ ...form, ui_framework: v })} placeholder="Next.js" />
                  <Field label="UI Library" value={form.ui_library} onChange={(v) => setForm({ ...form, ui_library: v })} placeholder="Tailwind CSS" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Application Layer</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Language" value={form.app_language} onChange={(v) => setForm({ ...form, app_language: v })} placeholder="Python" />
                  <Field label="Framework" value={form.app_framework} onChange={(v) => setForm({ ...form, app_framework: v })} placeholder="FastAPI" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Data Layer (Database)" value={form.data_layer} onChange={(v) => setForm({ ...form, data_layer: v })} placeholder="PostgreSQL" />
                <Field label="Integration Layer" value={form.integration_layer} onChange={(v) => setForm({ ...form, integration_layer: v })} placeholder="REST API" />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-2">
                  <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ TAB 2: CODING GUIDELINES ============

const GUIDELINE_CATEGORIES = [
  { key: 'project_structure', label: 'Project Structure', desc: 'Directory and file structure', icon: FolderTree },
  { key: 'security', label: 'Security', desc: 'Overview of security best practices', icon: ShieldCheck },
  { key: 'frontend', label: 'Frontend Guidelines', desc: 'Overview of frontend best practices', icon: LayoutGrid },
  { key: 'backend', label: 'Backend Guidelines', desc: 'Overview of backend best practices', icon: ServerCog },
  { key: 'database', label: 'Database Guidelines', desc: 'Overview of database best practices', icon: Database },
];

function GuidelinesTab({ projectId, showMessage }: any) {
  const [guidelines, setGuidelines] = useState<CodingGuideline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingAll, setGeneratingAll] = useState(false);

  const [activeItem, setActiveItem] = useState<{ category: string | null; label: string; existing: CodingGuideline | null } | null>(null);
  const [modalForm, setModalForm] = useState({ title: '', content: '' });
  const [savingModal, setSavingModal] = useState(false);
  const [generatingModal, setGeneratingModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', content: '' });
  const [savingAdd, setSavingAdd] = useState(false);

  const fetchGuidelines = async () => {
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
  };

  useEffect(() => { fetchGuidelines(); }, [projectId]);

  const byCategory = (key: string) => guidelines.find((g) => g.category === key) || null;
  const customGuidelines = guidelines.filter((g) => !g.category);

  const openCategory = (key: string, label: string) => {
    const existing = byCategory(key);
    setModalForm({ title: existing?.title || label, content: existing?.content || '' });
    setActiveItem({ category: key, label, existing });
  };

  const openCustom = (item: CodingGuideline) => {
    setModalForm({ title: item.title, content: item.content });
    setActiveItem({ category: null, label: item.title, existing: item });
  };

  const handleGenerateAll = async () => {
    const token = getAuthToken();
    if (!token) { showMessage('error', 'Sesi habis, silakan login kembali.'); return; }
    setGeneratingAll(true);
    try {
      const res = await buildApi.generateAllGuidelines(projectId, token);
      await fetchGuidelines();
      if (res.errors && res.errors.length > 0) {
        showMessage('error', `Sebagian kategori gagal digenerate: ${res.errors.join('; ')}`);
      } else {
        showMessage('success', 'Semua coding guidelines berhasil digenerate!');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal generate semua guidelines.');
    } finally {
      setGeneratingAll(false);
    }
  };

  const handleInstall = () => {
    if (guidelines.length === 0) {
      showMessage('error', 'Belum ada guideline untuk di-install.');
      return;
    }
    const orderedCategories = GUIDELINE_CATEGORIES.map((c) => byCategory(c.key)).filter(Boolean) as CodingGuideline[];
    const all = [...orderedCategories, ...customGuidelines];
    const md = all.map((g) => `## ${g.title}\n\n${g.content}\n`).join('\n');
    const blob = new Blob([`# Coding Guidelines\n\n${md}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coding-guidelines.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleModalGenerate = async () => {
    if (!activeItem?.category) return;
    const token = getAuthToken();
    if (!token) return;
    setGeneratingModal(true);
    try {
      const updated = await buildApi.generateGuideline(projectId, activeItem.category, token);
      setModalForm({ title: updated.title, content: updated.content });
      await fetchGuidelines();
      showMessage('success', 'Guideline berhasil digenerate ulang!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal generate guideline.');
    } finally {
      setGeneratingModal(false);
    }
  };

  const handleModalSave = async () => {
    const token = getAuthToken();
    if (!token) { showMessage('error', 'Sesi habis, silakan login kembali.'); return; }
    setSavingModal(true);
    try {
      if (activeItem?.existing) {
        await buildApi.updateGuideline(projectId, activeItem.existing.id, modalForm, token);
      } else {
        await buildApi.createGuideline(projectId, { ...modalForm, category: activeItem?.category || null }, token);
      }
      await fetchGuidelines();
      setActiveItem(null);
      showMessage('success', 'Guideline berhasil disimpan!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menyimpan guideline.');
    } finally {
      setSavingModal(false);
    }
  };

  const handleModalDelete = async () => {
    if (!activeItem?.existing) return;
    if (!confirm('Hapus guideline ini?')) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      await buildApi.deleteGuideline(projectId, activeItem.existing.id, token);
      await fetchGuidelines();
      setActiveItem(null);
      showMessage('success', 'Guideline berhasil dihapus!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menghapus guideline.');
    }
  };

  const handleAddSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) { showMessage('error', 'Sesi habis, silakan login kembali.'); return; }
    setSavingAdd(true);
    try {
      await buildApi.createGuideline(projectId, { ...addForm, category: null }, token);
      await fetchGuidelines();
      setShowAddModal(false);
      setAddForm({ title: '', content: '' });
      showMessage('success', 'Guideline baru berhasil ditambahkan!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menambahkan guideline.');
    } finally {
      setSavingAdd(false);
    }
  };

  const handleDeleteCustom = async (id: number) => {
    if (!confirm('Hapus guideline ini?')) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      await buildApi.deleteGuideline(projectId, id, token);
      await fetchGuidelines();
      showMessage('success', 'Guideline berhasil dihapus!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menghapus guideline.');
    }
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <BetaHeader title="Coding Guidelines" />
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleGenerateAll} disabled={generatingAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" /> {generatingAll ? 'Generating...' : 'Generate All'}
          </button>
          <button onClick={handleInstall}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Install Coding Guidelines
          </button>
        </div>
      </div>

      <OverviewCard>
        Generate, review, and manage coding guidelines tailored to your project. These represent best practices
        for the project, and can be used by your development team and AI coding agents and platforms. AI can help
        generate your coding guidelines and you can then edit them — or you can create your own from scratch.
      </OverviewCard>

      {isLoading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {GUIDELINE_CATEGORIES.map(({ key, label, desc, icon: Icon }) => {
            const existing = byCategory(key);
            return (
              <button key={key} onClick={() => openCategory(key, label)}
                className="text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-sm p-5 transition-all cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-1">{existing ? 'Configured' : desc}</p>
              </button>
            );
          })}

          {customGuidelines.map((item) => (
            <div key={item.id} className="relative bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-sm p-5 transition-all group">
              <button onClick={() => openCustom(item)} className="text-left w-full cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900 pr-6">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.content}</p>
              </button>
              <button onClick={() => handleDeleteCustom(item.id)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <button onClick={() => setShowAddModal(true)}
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-2xl p-5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer min-h-[140px]">
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Add new Coding Guideline</span>
          </button>
        </div>
      )}

      {activeItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold">{activeItem.label}</h3>
              <div className="flex items-center gap-2">
                {activeItem.category && (
                  <button onClick={handleModalGenerate} disabled={generatingModal}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5" /> {generatingModal ? '...' : 'Generate'}
                  </button>
                )}
                <button onClick={() => setActiveItem(null)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <Field label="Judul" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Isi Guideline</label>
                <textarea
                  value={modalForm.content}
                  onChange={(e) => setModalForm({ ...modalForm, content: e.target.value })}
                  rows={8}
                  placeholder="Tuliskan aturan atau panduan coding di sini, atau klik Generate untuk membuat draf otomatis via AI..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                {activeItem.existing && !activeItem.category ? (
                  <button onClick={handleModalDelete} className="text-sm text-rose-500 hover:text-rose-600 cursor-pointer flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                ) : <span />}
                <div className="flex gap-2">
                  <button onClick={() => setActiveItem(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                  <button onClick={handleModalSave} disabled={savingModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 cursor-pointer">
                    {savingModal ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold">Tambah Guideline Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Judul Guideline</label>
                <input type="text" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  placeholder="Contoh: Penamaan Variabel"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Isi Guideline</label>
                <textarea value={addForm.content} onChange={(e) => setAddForm({ ...addForm, content: e.target.value })}
                  rows={5} placeholder="Tuliskan aturan atau panduan coding di sini..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all resize-none" required />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={savingAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 cursor-pointer">
                  {savingAdd ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ TAB 3: DEV PLANS ============

const PLAN_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  todo: { label: 'To Do', color: 'bg-slate-100 text-slate-600' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
};

const STATUS_FLOW = ['draft', 'todo', 'in_progress', 'completed'];

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'completed', label: 'Completed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'todo', label: 'To Do' },
];

function DevPlansTab({ projectId, showMessage }: any) {
  const [plans, setPlans] = useState<DevelopmentPlan[]>([]);
  const [epics, setEpics] = useState<EpicOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DevelopmentPlan | null>(null);
  const [form, setForm] = useState<{ title: string; description: string; status: string; epic_id: string }>({
    title: '', description: '', status: 'draft', epic_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchAll = async () => {
    const token = getAuthToken();
    if (!token) return;
    setIsLoading(true);
    try {
      const [plansRes, epicsRes] = await Promise.all([
        buildApi.getDevPlans(projectId, token),
        buildApi.getEpicOptions(projectId, token),
      ]);
      setPlans(plansRes);
      setEpics(epicsRes);
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal memuat development plans.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [projectId]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ title: '', description: '', status: 'draft', epic_id: epics[0] ? String(epics[0].id) : '' });
    setShowModal(true);
  };

  const openEditModal = (item: DevelopmentPlan) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      description: item.description || '',
      status: item.status,
      epic_id: item.epic_id ? String(item.epic_id) : '',
    });
    setShowModal(true);
  };

  const handleGenerateInModal = async () => {
    if (!form.epic_id) { showMessage('error', 'Pilih requirement/epic terlebih dahulu.'); return; }
    const token = getAuthToken();
    if (!token) return;
    setGenerating(true);
    try {
      await buildApi.generateDevPlan(projectId, Number(form.epic_id), token);
      await fetchAll();
      setShowModal(false);
      showMessage('success', 'Development plan berhasil digenerate oleh AI!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal generate development plan.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) { showMessage('error', 'Sesi habis, silakan login kembali.'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        epic_id: form.epic_id ? Number(form.epic_id) : undefined,
      };
      if (editingItem) {
        await buildApi.updateDevPlan(projectId, editingItem.id, payload, token);
      } else {
        await buildApi.createDevPlan(projectId, payload as any, token);
      }
      await fetchAll();
      setShowModal(false);
      showMessage('success', editingItem ? 'Plan berhasil diperbarui!' : 'Development plan baru ditambahkan!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal menyimpan plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus development plan ini?')) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      await buildApi.deleteDevPlan(projectId, id, token);
      await fetchAll();
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
      await fetchAll();
      showMessage('success', 'Status plan diperbarui!');
    } catch (err: any) {
      showMessage('error', err.message || 'Gagal memperbarui status.');
    }
  };

  const filteredPlans = filter === 'all' ? plans : plans.filter((p) => p.status === filter);
  const epicName = (id?: number | null) => epics.find((e) => e.id === id)?.name;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-start justify-between gap-4">
        <BetaHeader title="Dev Plans" />
        <button onClick={openAddModal} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors cursor-pointer shrink-0">
          <Plus className="w-3.5 h-3.5" /> Create New Plan
        </button>
      </div>

      <OverviewCard>
        Dev plans guide AI coding agents and platforms (Lovable, v0, etc.) when it comes time to implement your
        requirements. Dev plans contain one or more requirements from your project, and take into account your
        project&apos;s technologies and coding guidelines. Userdoc&apos;s AI uses these to generate comprehensive
        plans that you can use directly with your AI tool of choice.
      </OverviewCard>

      <div className="bg-white rounded-2xl border border-gray-200 p-3 flex items-center gap-1 flex-wrap">
        <span className="text-xs text-gray-400 font-medium px-2">Filter by status:</span>
        {FILTER_TABS.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === t.key ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900 mb-2">Plans</p>
        {isLoading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>
        ) : filteredPlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-blue-200" />
            <p className="text-base font-semibold text-gray-900">You have not created any Dev Plans yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-5">Create your first dev plan to get started building with AI.</p>
            <button onClick={openAddModal} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer">
              <Sparkles className="w-4 h-4" /> Create Dev Plan
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPlans.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PLAN_STATUS_CONFIG[item.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {PLAN_STATUS_CONFIG[item.status]?.label || item.status}
                      </span>
                      {epicName(item.epic_id) && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{epicName(item.epic_id)}</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed whitespace-pre-wrap line-clamp-4">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => openEditModal(item)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3">
                  {STATUS_FLOW.indexOf(item.status) > 0 && (
                    <button onClick={() => handleStatusChange(item, STATUS_FLOW[STATUS_FLOW.indexOf(item.status) - 1])}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> {PLAN_STATUS_CONFIG[STATUS_FLOW[STATUS_FLOW.indexOf(item.status) - 1]].label}
                    </button>
                  )}
                  {STATUS_FLOW.indexOf(item.status) < STATUS_FLOW.length - 1 && (
                    <button onClick={() => handleStatusChange(item, STATUS_FLOW[STATUS_FLOW.indexOf(item.status) + 1])}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors cursor-pointer flex items-center gap-1">
                      {PLAN_STATUS_CONFIG[STATUS_FLOW[STATUS_FLOW.indexOf(item.status) + 1]].label} <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold">{editingItem ? 'Edit Plan' : 'Buat Development Plan'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Requirement / Epic</label>
                <select value={form.epic_id} onChange={(e) => setForm({ ...form, epic_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all">
                  <option value="">Tidak terhubung ke epic tertentu</option>
                  {epics.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>

              {!editingItem && (
                <button type="button" onClick={handleGenerateInModal} disabled={generating || !form.epic_id}
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer">
                  <Sparkles className="w-4 h-4" /> {generating ? 'AI sedang menyusun plan...' : 'Generate Plan Otomatis dengan AI'}
                </button>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-2 text-[10px] text-gray-400 uppercase">atau isi manual</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Judul Plan</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Setup Authentication API"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={5} placeholder="Deskripsi rencana pengembangan ini..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all">
                  {STATUS_FLOW.map((s) => <option key={s} value={s}>{PLAN_STATUS_CONFIG[s].label}</option>)}
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