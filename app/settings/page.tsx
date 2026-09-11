// app/settings/page.tsx
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import {
  SettingsIcon as SettingsIconLucide,
  Brain,
  Trash2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Coins,
  Zap,
  History,
  Bot,
} from 'lucide-react';
import { projectApi } from '@/services/projectsApi';
import { settingsApi, AIRule, AIRuleSuggestion, TokenUsageData } from '@/services/settingsApi';
import { getAuthToken } from '@/lib/auth';
import { getStoredProjectId, setStoredProjectId, clearStoredProjectId } from '@/lib/project-context';

const MAX_DESC_LENGTH = 2000;

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
  const [suggestions, setSuggestions] = useState<AIRuleSuggestion[]>([]);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingSuggestion, setIsAddingSuggestion] = useState(false);
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
      console.error('Gagal memuat data token usage:', err);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'token-usage') {
      loadTokenUsage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdParam, reloadToken, router]);

  const handleRetry = useCallback(() => setReloadToken((n) => n + 1), []);

  const handleSaveGeneral = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const token = getAuthToken();
    if (!token || !projectIdParam) {
      setMessage({ type: 'error', text: 'Sesi habis, silakan login kembali.' });
      setLoading(false);
      return;
    }

    try {
      await projectApi.updateProject(
        Number(projectIdParam),
        { name: projectName, description: projectDesc },
        token
      );
      setMessage({ type: 'success', text: 'Pengaturan proyek berhasil disimpan!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal memperbarui proyek' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus aturan AI ini?')) return;
    const token = getAuthToken();
    if (!token) return;

    try {
      await settingsApi.deleteAIRule(ruleId, token);
      setAiRules(aiRules.filter((r) => r.id !== ruleId));
    } catch (err: any) {
      console.error('Gagal menghapus aturan AI', err);
      setMessage({ type: 'error', text: err.message || 'Gagal menghapus aturan AI' });
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!projectIdParam) return;
    const token = getAuthToken();
    if (!token) return;

    setIsGenerating(true);
    setMessage({ type: '', text: '' });
    try {
      const result = await settingsApi.generateAIRuleSuggestions(Number(projectIdParam), token);
      setSuggestions(result);
      setSelectedSuggestionIdx(result.length > 0 ? '0' : '');
      if (result.length === 0) {
        setMessage({ type: 'error', text: 'AI tidak menghasilkan saran. Coba lagi.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'AI gagal memberikan saran.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSelectedSuggestion = async () => {
    if (!projectIdParam || selectedSuggestionIdx === '') return;
    const suggestion = suggestions[Number(selectedSuggestionIdx)];
    if (!suggestion) return;

    const token = getAuthToken();
    if (!token) return;

    setIsAddingSuggestion(true);
    try {
      const newRule = await settingsApi.createProjectAIRule(Number(projectIdParam), suggestion, token);
      setAiRules((prev) => [...prev, newRule]);
      setSuggestions((prev) => prev.filter((s) => s.name !== suggestion.name));
      setSelectedSuggestionIdx('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal menambahkan aturan.' });
    } finally {
      setIsAddingSuggestion(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectIdParam) return;
    if (
      !confirm(
        `Hapus project "${projectName}"? Seluruh data akan terhapus permanen dan tidak bisa dikembalikan.`
      )
    )
      return;

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

      <main className="flex-1 h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Project settings</h1>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-6 px-6 pt-5 border-b border-gray-100">
              <button
                onClick={() => setActiveTab('general')}
                className={`pb-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
                  activeTab === 'general'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('ai-rules')}
                className={`pb-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
                  activeTab === 'ai-rules'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                AI Rules
              </button>
              <button
                onClick={() => setActiveTab('token-usage')}
                className={`pb-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
                  activeTab === 'token-usage'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                <Coins className="w-3.5 h-3.5" /> Token & AI Usage
              </button>
            </div>

            <div className="p-6">
              {message.text && (
                <div
                  className={`mb-6 p-3.5 rounded-xl flex items-start gap-2.5 text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-100 text-green-800'
                      : 'bg-red-50 border border-red-100 text-red-800'
                  }`}
                >
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{message.text}</span>
                </div>
              )}

              {/* ============ TAB: GENERAL ============ */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Project name
                    </label>
                    <input
                      type="text"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Project description
                    </label>
                    <div className="relative">
                      <textarea
                        rows={5}
                        maxLength={MAX_DESC_LENGTH}
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        className="block w-full px-3.5 py-2.5 border text-gray-900 border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                      />
                      <span className="absolute bottom-2.5 right-3.5 text-[11px] text-gray-400">
                        {projectDesc.length} / {MAX_DESC_LENGTH}
                      </span>
                    </div>
                  </div>

                  {/* Manage members -- UI mengikuti referensi, BELUM disambungkan ke
                      backend member/invite karena endpoint-nya belum dibagikan. */}
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      Manage project members
                    </label>
                    <p className="text-xs text-gray-400 mb-3">Add team member</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        placeholder="Team member's email"
                        disabled
                        className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-400 bg-gray-50 text-sm cursor-not-allowed"
                      />
                      <select
                        disabled
                        className="px-3 py-2.5 border border-gray-200 rounded-xl text-gray-400 bg-gray-50 text-sm cursor-not-allowed"
                      >
                        <option>Viewer</option>
                      </select>
                      <button
                        type="button"
                        disabled
                        title="Fitur invite member belum tersedia"
                        className="px-4 py-2.5 border border-gray-200 text-gray-400 bg-gray-50 rounded-xl text-sm font-medium cursor-not-allowed"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleDeleteProject}
                      disabled={isDeletingProject}
                      className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer disabled:opacity-50"
                    >
                      {isDeletingProject ? 'Menghapus...' : 'Delete'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveGeneral}
                        disabled={loading}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Menyimpan...' : 'Save Project'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ TAB: AI RULES ============ */}
              {activeTab === 'ai-rules' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">AI Rules</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      AI Rules allow you to tailor the behaviour and responses of the AI assistant
                      for this project. Add reusable instructions that guide how user stories,
                      personas, journeys, requirements, and technical documentation are generated,
                      ensuring every output follows your team&apos;s standards and writing style.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">Project-specific AI Rules</p>
                      <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                        These AI rules apply only to this project. They can significantly influence
                        AI-generated content. Configure them carefully to maintain consistent,
                        accurate, and reliable outputs.
                      </p>
                    </div>
                  </div>

                  {/* Generate + pilih saran */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Select a prompt
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedSuggestionIdx}
                        onChange={(e) => setSelectedSuggestionIdx(e.target.value)}
                        disabled={suggestions.length === 0}
                        className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-800 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {suggestions.length === 0 ? (
                          <option value="">Choose a prompt...</option>
                        ) : (
                          suggestions.map((s, i) => (
                            <option key={i} value={i}>
                              {s.name}
                            </option>
                          ))
                        )}
                      </select>
                      {suggestions.length === 0 ? (
                        <button
                          type="button"
                          onClick={handleGenerateSuggestions}
                          disabled={isGenerating}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                        >
                          {isGenerating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          {isGenerating ? 'Generating...' : 'Generate'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleAddSelectedSuggestion}
                          disabled={isAddingSuggestion || selectedSuggestionIdx === ''}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                        >
                          {isAddingSuggestion ? 'Adding...' : 'Add'}
                        </button>
                      )}
                    </div>
                    {suggestions.length > 0 && selectedSuggestionIdx !== '' && (
                      <p className="text-[11px] text-gray-500 mt-2 leading-relaxed bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                        {suggestions[Number(selectedSuggestionIdx)]?.content}
                      </p>
                    )}
                    {suggestions.length > 0 && (
                      <button
                        type="button"
                        onClick={handleGenerateSuggestions}
                        disabled={isGenerating}
                        className="mt-2 text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer disabled:opacity-50"
                      >
                        {isGenerating ? 'Generating...' : 'Regenerate suggestions'}
                      </button>
                    )}
                  </div>

                  {/* List rules yang sudah tersimpan */}
                  {aiRules.length === 0 ? (
                    <div className="text-center py-10 border-t border-gray-100">
                      <Bot className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-700">No AI rules yet.</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Select a prompt template above to create your first AI Rule.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      {aiRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="p-4 border border-gray-200 rounded-xl flex justify-between items-start gap-4"
                        >
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{rule.name}</h4>
                            <p className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed">
                              {rule.content}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* ============ TAB: TOKEN & AI USAGE ============ */}
              {activeTab === 'token-usage' && (
                <div className="space-y-6">
                  {isLoadingTokens ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <span className="ml-2 text-sm text-gray-500">Memuat statistik token...</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Sisa Kuota Bulanan
                          </span>
                          <div className="mt-1.5 flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-gray-900">
                              {tokenData ? tokenData.remaining_tokens.toLocaleString() : '0'}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              / {tokenData?.monthly_quota.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${tokenData?.usage_percentage || 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {tokenData?.usage_percentage || 0}% kuota terpakai
                          </span>
                        </div>

                        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Token Terpakai Bulan Ini
                          </span>
                          <div className="mt-1.5 text-xl font-bold text-blue-600">
                            {tokenData ? tokenData.monthly_used.toLocaleString() : '0'}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            Dihitung otomatis per pemanggilan AI
                          </span>
                        </div>

                        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Status Multi-AI
                          </span>
                          <div className="mt-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-800">
                              3 Provider Aktif
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-2 block">
                            Round-Robin & Failover Siap
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-500" /> Model AI Terhubung
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {tokenData?.providers_info.map((p, idx) => (
                            <div key={idx} className="border border-gray-100 bg-gray-50/70 p-3.5 rounded-xl">
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-xs text-gray-800">{p.name}</span>
                                <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                  {p.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-1 font-mono truncate">
                                {p.model}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                          <History className="w-4 h-4 text-blue-600" /> Riwayat Pemanggilan AI Terakhir
                        </h3>
                        {tokenData?.history && tokenData.history.length > 0 ? (
                          <div className="overflow-x-auto -mx-1">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-gray-200 text-gray-500">
                                  <th className="pb-2.5 font-medium px-1">Fitur</th>
                                  <th className="pb-2.5 font-medium px-1">Provider</th>
                                  <th className="pb-2.5 font-medium px-1">Model</th>
                                  <th className="pb-2.5 font-medium text-right px-1">Prompt</th>
                                  <th className="pb-2.5 font-medium text-right px-1">Completion</th>
                                  <th className="pb-2.5 font-medium text-right px-1">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-gray-700">
                                {tokenData.history.map((h) => (
                                  <tr key={h.id} className="hover:bg-gray-50/70">
                                    <td className="py-2.5 px-1 font-medium text-gray-900">{h.feature}</td>
                                    <td className="py-2.5 px-1 uppercase font-semibold text-[10px] text-gray-500">
                                      {h.provider}
                                    </td>
                                    <td className="py-2.5 px-1 font-mono text-[10px] text-gray-500">
                                      {h.model_name}
                                    </td>
                                    <td className="py-2.5 px-1 text-right font-mono">
                                      {h.prompt_tokens.toLocaleString()}
                                    </td>
                                    <td className="py-2.5 px-1 text-right font-mono">
                                      {h.completion_tokens.toLocaleString()}
                                    </td>
                                    <td className="py-2.5 px-1 text-right font-mono font-bold text-blue-600">
                                      {h.total_tokens.toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-400 text-xs">
                            Belum ada riwayat pemanggilan AI yang tercatat.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}