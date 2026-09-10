// app/journeys/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import JourneysSidebar from '@/features/journeys/components/journeySidebar';
import EmptyJourneyPanel from '@/features/journeys/components/emptyJourneyPanel';
import JourneyDetailPanel from '@/features/journeys/components/journeyDetailPanel';
import AccountMenu from '@/features/common/components/accountMenu';
import { Upload, Download, X, MessageSquare, Loader2 } from 'lucide-react';
import { journeysApi, UserJourneyResponse } from '@/services/journeysApi';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';

interface JourneyStepVM {
  id: number | string;
  title: string;
  description: string;
}

interface JourneyVM {
  id: string;
  title: string;
  description: string;
  steps: JourneyStepVM[];
  stepsCount: number;
  personasCount: number;
  storiesCount: number;
}

function mapJourneyFromBackend(j: UserJourneyResponse): JourneyVM {
  const sortedSteps = [...(j.steps || [])].sort((a, b) => a.step_order - b.step_order);
  return {
    id: String(j.id),
    title: j.name,
    description: j.description || '',
    steps: sortedSteps.map((s, idx) => ({
      id: s.id ?? `${j.id}-${idx}`,
      title: s.title,
      description: s.description || '',
    })),
    stepsCount: sortedSteps.length,
    personasCount: 0,
    storiesCount: 0,
  };
}

function JourneysPageContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');

  const [projectName, setProjectName] = useState('');
  const [projectWorkspaceId, setProjectWorkspaceId] = useState<number | null>(null);
  const [journeys, setJourneys] = useState<JourneyVM[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<JourneyVM | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const loadData = async (selectId?: string) => {
    if (!projectId) {
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
    try {
      const [journeysData, projectData] = await Promise.all([
        journeysApi.getJourneysByProject(Number(projectId), token),
        projectApi.getProjectById(Number(projectId), token),
      ]);

      const mapped = journeysData.map(mapJourneyFromBackend);
      setJourneys(mapped);
      setProjectName(projectData.name);
      setProjectWorkspaceId(projectData.workspace_id);

      if (selectId) {
        setSelectedJourney(mapped.find((j) => j.id === selectId) || mapped[0] || null);
      } else if (mapped.length > 0) {
        setSelectedJourney((prev) => (prev ? mapped.find((j) => j.id === prev.id) || mapped[0] : mapped[0]));
      } else {
        setSelectedJourney(null);
      }
    } catch (err: any) {
      console.error('Gagal memuat data journeys:', err);
      setLoadError(err.message || 'Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(true);
  };

  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !projectId) return;

    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    try {
      if (isEditMode && selectedJourney) {
        // Update journey yang sudah ada (nama & deskripsi)
        const updated = await journeysApi.updateJourney(
          Number(selectedJourney.id),
          { name: newTitle, description: newDesc },
          token
        );
        await loadData(String(updated.id));
      } else {
        // 1. Buat journey baru dulu (steps kosong)
        const created = await journeysApi.createJourney(
          {
            project_id: Number(projectId),
            name: newTitle,
            description: newDesc || 'Deskripsi user journey baru...',
            steps: [],
          },
          token
        );

        // 2. Trigger AI untuk generate steps step-by-step
        setIsGenerating(true);
        const withAiSteps = await journeysApi.generateAiSteps(created.id, token);
        setIsGenerating(false);

        // 3. Refresh dari server supaya steps hasil AI ikut tampil
        await loadData(String(withAiSteps.id));
      }

      setNewTitle('');
      setNewDesc('');
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving/generating journey:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan atau men-generate journey.');
      setIsGenerating(false);
    }
  };

  const handleUpdateJourneyDetail = async (updated: JourneyVM) => {
    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    try {
      await journeysApi.updateJourney(
        Number(updated.id),
        { name: updated.title, description: updated.description },
        token
      );
      await journeysApi.replaceSteps(
        Number(updated.id),
        updated.steps.map((s, index) => ({
          step_order: index + 1,
          title: s.title,
          description: s.description,
        })),
        token
      );
      await loadData(updated.id);
    } catch (err: any) {
      console.error('Gagal menyimpan perubahan journey:', err);
      alert(err.message || 'Gagal menyimpan perubahan journey ke server.');
    }
  };

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
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(journeys, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${projectName || 'project'}-journeys.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500">Memuat data journeys...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <p className="text-red-600 font-medium mb-2">Gagal memuat data</p>
          <p className="text-sm text-gray-500">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans relative">
      <AppSidebar activeMenu="journeys" projectId={projectId} />

      <JourneysSidebar
        journeys={journeys}
        selectedJourneyId={selectedJourney?.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectJourney={setSelectedJourney}
        onOpenMapModal={handleOpenCreateModal}
      />

      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Top Navbar */}
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-medium text-gray-500">
            {projectName || 'Untitled Project'} <span className="text-gray-300">/</span>
          </span>

          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>

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

            <AccountMenu currentWorkspaceId={projectWorkspaceId} />
          </div>
        </div>

        {/* Main Content Area */}
        {selectedJourney ? (
          <JourneyDetailPanel
            journey={selectedJourney}
            onClose={() => setSelectedJourney(null)}
            onSave={handleUpdateJourneyDetail}
          />
        ) : (
          <EmptyJourneyPanel onOpenAddModal={handleOpenCreateModal} />
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">
                {isEditMode ? 'Edit Journey' : 'Create New Journey'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
                disabled={isGenerating}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJourney} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Journey Title</label>
                <input
                  type="text"
                  placeholder="Contoh: Checkout flow & Payment gateway"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  disabled={isGenerating}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  placeholder="Deskripsi singkat mengenai alur journey ini..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  disabled={isGenerating}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isGenerating}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI Generating...
                    </>
                  ) : isEditMode ? (
                    'Simpan Perubahan'
                  ) : (
                    'Simpan & Generate AI'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JourneysPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <JourneysPageContent />
    </Suspense>
  );
}