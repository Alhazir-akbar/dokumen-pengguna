'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import JourneysSidebar from '@/features/journeys/components/journeySidebar';
import EmptyJourneyPanel from '@/features/journeys/components/emptyJourneyPanel';
import JourneyDetailPanel from '@/features/journeys/components/journeyDetailPanel';
import CreateJourneyModal from '@/features/journeys/components/createJourneyModal';
import AccountMenu from '@/features/common/components/accountMenu';
import { Upload, Download, Loader2 } from 'lucide-react';
import { journeysApi, UserJourneyResponse } from '@/services/journeysApi';
import { projectApi } from '@/services/projectsApi';
import { personasApi, Persona } from '@/services/personasApi';
import { getAuthToken } from '@/lib/auth';

interface JourneyStepVM {
  id: number | string;
  title: string;
  description: string;
  personaId: number | null;
  personaName: string | null;
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
  const uniquePersonaIds = new Set(
    sortedSteps.map((s) => s.persona_id).filter((pid): pid is number => pid != null)
  );
  return {
    id: String(j.id),
    title: j.name,
    description: j.description || '',
    steps: sortedSteps.map((s, idx) => ({
      id: s.id ?? `${j.id}-${idx}`,
      title: s.title,
      description: s.description || '',
      personaId: s.persona_id ?? null,
      personaName: s.persona?.name ?? null,
    })),
    stepsCount: sortedSteps.length,
    personasCount: uniquePersonaIds.size,
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
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Modal Create Journey State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      const [journeysData, projectData, personasData] = await Promise.all([
        journeysApi.getJourneysByProject(Number(projectId), token),
        projectApi.getProjectById(Number(projectId), token),
        personasApi.getPersonasByProject(Number(projectId), token),
      ]);

      const mapped = journeysData.map(mapJourneyFromBackend);
      setJourneys(mapped);
      setProjectName(projectData.name);
      setProjectWorkspaceId(projectData.workspace_id);
      setPersonas(personasData);

      if (selectId) {
        const found = mapped.find((j) => j.id === selectId);
        setSelectedJourney(found || mapped[0] || null);
      } else if (mapped.length > 0) {
        setSelectedJourney((prev) => {
          if (prev) {
            const updatedPrev = mapped.find((j) => j.id === prev.id);
            return updatedPrev || mapped[0];
          }
          return mapped[0];
        });
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

  // Handler Submit Modal Buat Journey Baru
  const handleCreateJourneyFromModal = async (data: { name: string; description: string }) => {
    if (!projectId) return;
    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    const created = await journeysApi.createJourney(
      {
        project_id: Number(projectId),
        name: data.name,
        description: data.description,
        steps: [],
      },
      token
    );

    await loadData(String(created.id));
  };

  // Handler Update Journey & Steps
  const handleUpdateJourneyDetail = async (updated: JourneyVM) => {
    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    try {
      // 1. Update nama & deskripsi journey
      await journeysApi.updateJourney(
        Number(updated.id),
        { name: updated.title, description: updated.description },
        token
      );

      // 2. Replace langkah-langkah steps
      await journeysApi.replaceSteps(
        Number(updated.id),
        updated.steps.map((s, index) => ({
          step_order: index + 1,
          title: s.title,
          description: s.description,
          persona_id: s.personaId ?? null,
        })),
        token
      );

      await loadData(updated.id);
    } catch (err: any) {
      console.error('Gagal menyimpan perubahan journey:', err);
      alert(err.message || 'Gagal menyimpan perubahan journey ke server.');
    }
  };

  // Handler Hapus Journey
  const handleDeleteJourney = async (journeyId: string) => {
    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    try {
      await journeysApi.deleteJourney(Number(journeyId), token);
      setSelectedJourney(null);
      await loadData();
    } catch (err: any) {
      console.error('Gagal menghapus journey:', err);
      alert(err.message || 'Gagal menghapus journey dari server.');
    }
  };

  // Handler AI Generate Steps
  const handleGenerateAiSteps = async (journeyId: string) => {
    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    try {
      await journeysApi.generateAiSteps(Number(journeyId), token);
      await loadData(journeyId);
    } catch (err: any) {
      console.error('Gagal generate AI steps:', err);
      alert(err.message || 'Gagal menghasilkan langkah alur dengan AI.');
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

  const safeSelectedJourney = selectedJourney
    ? JSON.parse(JSON.stringify(selectedJourney))
    : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans relative">
      <AppSidebar activeMenu="journeys" projectId={projectId} />

      <JourneysSidebar
        journeys={journeys}
        selectedJourneyId={selectedJourney?.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectJourney={(j) => setSelectedJourney(j)}
        onOpenMapModal={() => setIsCreateModalOpen(true)}
      />

      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-medium text-gray-500">
            {projectName || 'Untitled Project'} <span className="text-gray-300">/</span>
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-500">
              <button
                type="button"
                onClick={handleUpload}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer"
                title="Upload Document"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
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

        {selectedJourney ? (
          <JourneyDetailPanel
            journey={safeSelectedJourney}
            personas={personas}
            onClose={() => {
              const original = journeys.find((j) => j.id === selectedJourney.id);
              setSelectedJourney(original || null);
            }}
            onSave={handleUpdateJourneyDetail}
            onDeleteJourney={handleDeleteJourney}
            onGenerateAiSteps={handleGenerateAiSteps}
          />
        ) : (
          <EmptyJourneyPanel onOpenAddModal={() => setIsCreateModalOpen(true)} />
        )}
      </main>

      {/* Modal Popup Create Journey Sesuai PRD */}
      <CreateJourneyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateJourneyFromModal}
      />
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