'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import JourneysSidebar from '@/features/journeys/components/journeySidebar';
import EmptyJourneyPanel from '@/features/journeys/components/emptyJourneyPanel';
import JourneyDetailPanel from '@/features/journeys/components/journeyDetailPanel';
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

  // Menggantikan modal lama -- sekarang "Create New Journey" langsung
  // menampilkan JourneyDetailPanel dalam mode edit kosong di panel utama,
  // bukan modal kecil terpisah.
  const [isCreatingNew, setIsCreatingNew] = useState(false);

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

  // Dipanggil oleh KEDUA trigger: tombol "New Journey" di EmptyJourneyPanel
  // dan ikon peta di sebelah search bar (JourneysSidebar). Keduanya sengaja
  // memanggil fungsi yang sama persis supaya perilakunya identik.
  const handleStartCreateJourney = () => {
    setSelectedJourney(null);
    setIsCreatingNew(true);
  };

  const handleCancelCreateJourney = () => {
    setIsCreatingNew(false);
  };

  const handleCreateNewJourney = async (draft: JourneyVM) => {
    if (!projectId) return;

    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    try {
      const created = await journeysApi.createJourney(
        {
          project_id: Number(projectId),
          name: draft.title?.trim() || 'Untitled journey',
          description: draft.description || '',
          steps: (draft.steps || []).map((s, idx) => ({
            title: s.title,
            description: s.description,
            step_order: idx + 1,
            persona_id: s.personaId ?? null,
          })),
        },
        token
      );

      setIsCreatingNew(false);
      await loadData(String(created.id));
    } catch (error: any) {
      console.error('Gagal membuat journey baru:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan journey.');
    }
  };

  const handleUpdateJourneyDetail = async (updated: JourneyVM) => {
    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    try {
      // Update nama & deskripsi
      await journeysApi.updateJourney(
        Number(updated.id),
        { name: updated.title, description: updated.description },
        token
      );

      // Update steps secara terpisah (replace) -- kirim persona_id (relasional),
      // BUKAN assigned_persona (string bebas, gak match ke tabel personas)
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

      // Fetch ulang data bersih dari backend
      await loadData(updated.id);
    } catch (err: any) {
      console.error('Gagal menyimpan perubahan journey:', err);
      alert(err.message || 'Gagal menyimpan perubahan journey ke server.');
    }
  };

  const handleUpload = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    const token = getAuthToken();
    if (!token) { alert('Sesi habis, silakan login kembali.'); return; }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : [parsed];

      for (const j of list) {
        await journeysApi.createJourney(
          {
            project_id: Number(projectId),
            name: j.title || j.name || 'Untitled journey',
            description: j.description || '',
            steps: (j.steps || []).map((s: any, idx: number) => ({
              title: s.title,
              description: s.description,
              step_order: idx + 1,
              persona_id: s.personaId ?? null,
            })),
          },
          token
        );
      }
      await loadData();
      alert(`Berhasil import ${list.length} journey dari "${file.name}".`);
    } catch (err: any) {
      alert('File tidak valid atau gagal diimport: ' + (err.message || ''));
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

  // Deep clone agar JourneyDetailPanel tidak bisa memutasi state asli
  // secara langsung saat user mengetik/edit (fix bug Cancel sebelumnya).
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
        onSelectJourney={(j) => {
          setIsCreatingNew(false);
          setSelectedJourney(j);
        }}
        onOpenMapModal={handleStartCreateJourney}
      />

      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-medium text-gray-500">
            {projectName || 'Untitled Project'} <span className="text-gray-300">/</span>
          </span>

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

            <AccountMenu currentWorkspaceId={projectWorkspaceId} />
          </div>
        </div>

        {isCreatingNew ? (
          <JourneyDetailPanel
            key="new-journey"
            journey={null}
            personas={personas}
            isEditingInitially
            isNew
            startWithEmptySteps
            onClose={handleCancelCreateJourney}
            onSave={handleCreateNewJourney}
          />
        ) : selectedJourney ? (
          <JourneyDetailPanel
            key={selectedJourney.id}
            journey={safeSelectedJourney}
            personas={personas}
            onClose={() => {
              const original = journeys.find((j) => j.id === selectedJourney.id);
              setSelectedJourney(original || null);
            }}
            onSave={handleUpdateJourneyDetail}
          />
        ) : (
          <EmptyJourneyPanel onOpenAddModal={handleStartCreateJourney} />
        )}
      </main>
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