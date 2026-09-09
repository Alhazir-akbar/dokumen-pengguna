// app/settings/page.tsx
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import { MessageSquare, Settings as SettingsIcon, Brain, Save, Trash2, Plus, AlertCircle, Loader2, RefreshCw, Sparkles, Coins, Zap, History } from 'lucide-react';
import { projectApi } from '@/services/projectsApi';
import { settingsApi, AIRule, TokenUsageData } from '@/services/settingsApi';
import { getAuthToken } from '@/lib/auth';
import { getStoredProjectId, setStoredProjectId, clearStoredProjectId } from '@/lib/project-context';

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectIdParam = searchParams.get('project_id');

  const [activeTab, setActiveTab] = useState<'general' | 'ai-rules' | 'token-usage'>('general');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const [aiRules, setAiRules] = useState<AIRule[]>([]);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleContent, setNewRuleContent] = useState('');

  // TAMBAHAN: saran AI Rules yang belum disimpan, ditampilkan untuk dipilih user
  const [suggestions, setSuggestions] = useState<{ name: string; content: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
    // State untuk Token & AI Usage
  const [tokenData, setTokenData] = useState<TokenUsageData | null>(null);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  const loadTokenUsage = async () => {
    const token = getAuthToken();
    if (!token) return;
    setIsLoadingTokens(true);
    try {
      const data = await settingsApi.getTokenUsage(token, projectIdParam ? Number(projectIdParam) : undefined);
      setTokenData(data);
    } catch (err) {
      console.error("Gagal memuat data token usage:", err);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'token-usage') {
      loadTokenUsage();
    }
  }, [activeTab]);

  // PERBAIKAN PENTING: sebelumnya ada fallback hardcode `|| '1'` di sini — kalau
  // localStorage kosong, halaman ini diam-diam mencoba mengedit project ID 1 milik
  // siapapun itu, tanpa sepengetahuan user. Sekarang mengikuti pola yang sama dengan
  // halaman lain: baca project_id dari URL, fallback ke localStorage, TIDAK ADA fallback
  // hardcode ke ID tertentu.
  useEffect(() => {
    if (!projectIdParam) {
      const stored = getStoredProjectId();
      if (stored) {
        router.replace(`/settings?project_id=${stored}`);
        return;
      }
    }

    const loadData = async () => {
      if (!projectIdParam) {
        setLoadError('project_id tidak ditemukan di URL.');
        setIsPageLoading(false);
        return;
      }
      const token = getAuthToken();
      if (!token) {
        setLoadError('Sesi habis, silakan login kembali.');
        setIsPageLoading(false);
        return;
      }

      setIsPageLoading(true);
      setLoadError('');
      try {
        const [project, rules] = await Promise.all([
          projectApi.getProjectById(Number(projectIdParam), token),
          settingsApi.getProjectAIRules(Number(projectIdParam), token),
        ]);
        setProjectName(project.name);
        setProjectDesc(project.description || '');
        setAiRules(rules);
        setStoredProjectId(projectIdParam);
      } catch (err: any) {
        console.error('Gagal memuat data settings:', err);
        setLoadError(err.message || 'Gagal memuat data project.');
      } finally {
        setIsPageLoading(false);
      }
    };

    loadData();
  }, [projectIdParam, reloadToken, router]);

  const handleRetry = useCallback(() => setReloadToken((n) => n + 1), []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const token = getAuthToken();
    if (!token || !projectIdParam) {
      setMessage({ type: 'error', text: 'Sesi habis, silakan login kembali.' });
      setLoading(false);
      return;
    }

    try {
      // PERBAIKAN: sebelumnya pakai fetch manual, sekarang pakai projectApi.updateProject
      // yang sudah ada dan konsisten dipakai di seluruh aplikasi.
      await projectApi.updateProject(Number(projectIdParam), { name: projectName, description: projectDesc }, token);
      setMessage({ type: 'success', text: 'Pengaturan proyek berhasil disimpan!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal memperbarui proyek' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAIRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleContent.trim() || !projectIdParam) return;

    const token = getAuthToken();
    if (!token) {
      setMessage({ type: 'error', text: 'Sesi habis, silakan login kembali.' });
      return;
    }

    try {
      const newRule = await settingsApi.createProjectAIRule(
        Number(projectIdParam),
        { name: newRuleName, content: newRuleContent },
        token
      );
      setAiRules([...aiRules, newRule]);
      setNewRuleName('');
      setNewRuleContent('');
      setShowAddRuleModal(false);
    } catch (err: any) {
      console.error('Gagal menambahkan aturan AI', err);
      setMessage({ type: 'error', text: err.message || 'Gagal menambahkan aturan AI' });
    }
  };

  const handleDeleteRule = async (ruleId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus aturan AI ini?')) return;
    const token = getAuthToken();
    if (!token) return;

    try {
      await settingsApi.deleteAIRule(ruleId, token);
      setAiRules(aiRules.filter(r => r.id !== ruleId));
    } catch (err: any) {
      console.error('Gagal menghapus aturan AI', err);
      setMessage({ type: 'error', text: err.message || 'Gagal menghapus aturan AI' });
    }
  };

  // TAMBAHAN: tombol "Generate" -- AI menyarankan beberapa rule, user pilih mana yang mau ditambahkan
  const handleGenerateSuggestions = async () => {
    if (!projectIdParam) return;
    const token = getAuthToken();
    if (!token) return;

    setIsGenerating(true);
    setMessage({ type: '', text: '' });
    try {
      const result = await settingsApi.generateAIRuleSuggestions(Number(projectIdParam), token);
      setSuggestions(result);
      if (result.length === 0) {
        setMessage({ type: 'error', text: 'AI tidak menghasilkan saran. Coba lagi.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'AI gagal memberikan saran.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSuggestion = async (suggestion: { name: string; content: string }) => {
    if (!projectIdParam) return;
    const token = getAuthToken();
    if (!token) return;

    try {
      const newRule = await settingsApi.createProjectAIRule(Number(projectIdParam), suggestion, token);
      setAiRules((prev) => [...prev, newRule]);
      setSuggestions((prev) => prev.filter((s) => s.name !== suggestion.name));
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal menambahkan aturan.' });
    }
  };

  // TAMBAHAN: hapus project langsung dari Settings
  const handleDeleteProject = async () => {
    if (!projectIdParam) return;
    if (!confirm(`Hapus project "${projectName}"? Seluruh data akan terhapus permanen dan tidak bisa dikembalikan.`)) return;

    const token = getAuthToken();
    if (!token) return;

    setIsDeletingProject(true);
    try {
      await projectApi.deleteProject(Number(projectIdParam), token);
      clearStoredProjectId();
      router.push('/workspace');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal menghapus project.' });
      setIsDeletingProject(false);
    }
  };

  if (isPageLoading) {
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      <AppSidebar activeMenu="settings" projectId={projectIdParam} />

      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-semibold text-gray-500">
            {projectName || 'Nama Proyek'} <span className="text-gray-300">/</span> Pengaturan
          </span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              UD
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 px-8 flex gap-6 shrink-0 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> General Settings
          </button>
          <button
            onClick={() => setActiveTab('ai-rules')}
            className={`py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ai-rules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Brain className="w-4 h-4" /> AI Rules
          </button>
                    <button
            onClick={() => setActiveTab('token-usage')}
            className={`py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'token-usage' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Coins className="w-4 h-4" /> Token & AI Usage
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-2.5 text-sm ${
              message.type === 'success' ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-red-50 border border-red-100 text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Proyek</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 text-sm focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Deskripsi Proyek</label>
                <textarea
                  rows={4}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2.5 border text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  disabled={isDeletingProject}
                  className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer disabled:opacity-50"
                >
                  {isDeletingProject ? 'Menghapus...' : 'Delete Project'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
                            </div>
            </form>
          )}

          {/* TAB 2: AI RULES */}
          {activeTab === 'ai-rules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Aturan AI Proyek</h3>
                  <p className="text-xs text-gray-500">Aturan ini akan memandu AI dalam memformulasikan dokumen kebutuhan proyek Anda.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateSuggestions}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </button>
                  <button
                    onClick={() => setShowAddRuleModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Aturan
                  </button>
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="space-y-2 bg-amber-50/50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-2">Saran AI — pilih yang mau ditambahkan:</p>
                  {suggestions.map((s, i) => (
                    <div key={i} className="bg-white border border-amber-100 rounded-xl p-3.5 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-xs">{s.name}</h4>
                        <p className="text-[11px] text-gray-600 mt-1">{s.content}</p>
                      </div>
                      <button
                        onClick={() => handleAddSuggestion(s)}
                        className="shrink-0 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {aiRules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Belum ada aturan AI khusus</p>
                  <p className="text-xs text-gray-500">Buat aturan baru manual, atau klik "Generate" untuk saran dari AI.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiRules.map((rule) => (
                    <div key={rule.id} className="p-5 border border-gray-200 rounded-2xl flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{rule.name}</h4>
                        <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{rule.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-gray-400">
                Aturan di sini akan otomatis diikutsertakan setiap kali AI men-generate requirements
                untuk project ini (di step Describe Project pada wizard).
              </p>
              
            </div>
          )}
                    {/* TAB 3: TOKEN & AI USAGE */}
          {activeTab === 'token-usage' && (
            <div className="space-y-6">
              {isLoadingTokens ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
                  <span className="ml-2 text-sm text-gray-500">Memuat statistik token...</span>
                </div>
              ) : (
                <>
                  {/* Card Kuota & Sisa Token */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sisa Kuota Bulanan</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {tokenData ? tokenData.remaining_tokens.toLocaleString() : '0'}
                        </span>
                        <span className="text-xs text-gray-500">/ {tokenData?.monthly_quota.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${tokenData?.usage_percentage || 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 block">{tokenData?.usage_percentage || 0}% kuota terpakai</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Token Terpakai Bulan Ini</span>
                      <div className="mt-2 text-2xl font-bold text-blue-600">
                        {tokenData ? tokenData.monthly_used.toLocaleString() : '0'}
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">Dihitung otomatis per pemanggilan AI</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Multi-AI</span>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          3 Provider Aktif
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 mt-2 block">Round-Robin & Failover Siap</span>
                    </div>
                  </div>

                  {/* Provider Status Cards */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> Model AI Terhubung
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {tokenData?.providers_info.map((p, idx) => (
                        <div key={idx} className="border border-gray-100 bg-gray-50/70 p-4 rounded-xl">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm text-gray-800">{p.name}</span>
                            <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {p.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 font-mono truncate">{p.model}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Riwayat Pemakaian Token */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-600" /> Riwayat Pemanggilan AI Terakhir
                    </h3>
                    {tokenData?.history && tokenData.history.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-gray-200 text-gray-500">
                              <th className="pb-3 font-medium">Fitur</th>
                              <th className="pb-3 font-medium">Provider</th>
                              <th className="pb-3 font-medium">Model</th>
                              <th className="pb-3 font-medium text-right">Prompt</th>
                              <th className="pb-3 font-medium text-right">Completion</th>
                              <th className="pb-3 font-medium text-right">Total Tokens</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                            {tokenData.history.map((h) => (
                              <tr key={h.id} className="hover:bg-gray-50/70">
                                <td className="py-3 font-medium text-gray-900">{h.feature}</td>
                                <td className="py-3 uppercase font-semibold text-[10px] text-gray-500">{h.provider}</td>
                                <td className="py-3 font-mono text-[11px] text-gray-500">{h.model_name}</td>
                                <td className="py-3 text-right font-mono">{h.prompt_tokens.toLocaleString()}</td>
                                <td className="py-3 text-right font-mono">{h.completion_tokens.toLocaleString()}</td>
                                <td className="py-3 text-right font-mono font-bold text-blue-600">{h.total_tokens.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        Belum ada riwayat pemanggilan AI yang tercatat.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {showAddRuleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Tambah Aturan AI Baru</h3>
            </div>
            <form onSubmit={handleAddAIRule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Aturan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Format Cerita Pengguna"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Konten Aturan</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Misal: Tulis cerita pengguna menggunakan struktur Bahasa Indonesia yang formal..."
                  value={newRuleContent}
                  onChange={(e) => setNewRuleContent(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  Simpan Aturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  );
}