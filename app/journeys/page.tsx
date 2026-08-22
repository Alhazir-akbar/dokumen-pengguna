'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import JourneysSidebar from '@/features/journeys/components/journeySidebar';
import EmptyJourneyPanel from '@/features/journeys/components/emptyJourneyPanel';
import JourneyDetailPanel from '@/features/journeys/components/journeyDetailPanel';
import { Upload, Download, X, Loader2 } from 'lucide-react';
import { journeysApi } from '@/services/journeysApi';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';

function JourneysPageContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');

  const [projectName, setProjectName] = useState('');
  const [journeys, setJourneys] = useState<any[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Fetch journeys + nama project asli dari backend (bukan dummy/local state lagi)
  useEffect(() => {
    const loadData = async () => {
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
        const [journeyData, projectData] = await Promise.all([
          journeysApi.fetchJourneys(Number(projectId), token),
          projectApi.getProjectById(Number(projectId), token),
        ]);
        setJourneys(journeyData);
        setProjectName(projectData.name);
        setSelectedJourney(journeyData[0] || null);
      } catch (err: any) {
        console.error('Gagal memuat data journeys:', err);
        setLoadError(err.message || 'Gagal memuat data dari server.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedJourney) return;
    setIsEditMode(true);
    setNewTitle(selectedJourney.title || '');
    setNewDesc(selectedJourney.description || '');
    setIsModalOpen(true);
  };

  // Create/update journey (title & description) via backend beneran
  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !projectId) return;

    const token = getAuthToken();
    if (!token) {
      alert('Sesi habis, silakan login kembali.');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode && selectedJourney) {
        const updated = await journeysApi.updateJourney(
          Number(selectedJourney.id),
          { name: newTitle, description: newDesc },
          token
        );
        setJourneys(journeys.map((j) => (j.id === updated.id ? { ...updated, steps: selectedJourney.steps } : j)));
        setSelectedJourney({ ...updated, steps: selectedJourney.steps });
      } else {
        const created = await journeysApi.createJourney(
          { name: newTitle, description: newDesc || 'Deskripsi user journey baru...', project_id: Number(projectId) },
          token
        );
        setJourneys([created, ...journeys]);
        setSelectedJourney(created);
      }
      setNewTitle('');
      setNewDesc('');
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Gagal menyimpan journey:', err);
      alert(err.message || 'Gagal menyimpan journey ke server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Dipanggil dari JourneyDetailPanel saat user edit judul/deskripsi/steps journey.
  // Kita simpan title+description lewat updateJourney, lalu steps lewat saveSteps
  // (replace-all), supaya seluruh perubahan di panel benar-benar tersimpan.
  const handleSaveJourneyDetail = async (updated: any) => {
    const token = getAuthToken();
    if (!token) return;

    setIsSaving(true);
    try {
      await journeysApi.updateJourney(
        Number(updated.id),
        { name: updated.title, description: updated.description },
        token
      );
      const withSteps = await journeysApi.saveSteps(Number(updated.id), updated.steps || [], token);

      setJourneys(journeys.map((j) => (j.id === withSteps.id ? withSteps : j)));
      setSelectedJourney(withSteps);
    } catch (err: any) {
      console.error('Gagal menyimpan detail journey:', err);
      alert(err.message || 'Gagal menyimpan perubahan journey ke server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            alert(`Journey file "${file.name}" berhasil di-upload!`);
          } catch (err) {
            alert('Format file tidak valid.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(journeys, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${projectName || 'project'}-journeys.json`);
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
      {isSaving && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center text-white font-medium">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Menyimpan ke server...
        </div>
      )}

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
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-medium text-gray-600 flex items-center gap-2">
            {/* Nama project asli dari backend, bukan dummy "alalal" lagi */}
            {projectName || 'Untitled Project'} <span className="text-gray-400">/</span>
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

            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ml-1">
              UD
            </div>
          </div>
        </div>

        {selectedJourney ? (
          <JourneyDetailPanel
            journey={selectedJourney}
            onClose={() => setSelectedJourney(null)}
            onSave={handleSaveJourneyDetail}
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  placeholder="Deskripsi singkat mengenai alur journey ini..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  {isEditMode ? 'Simpan Perubahan' : 'Simpan Journey'}
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
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <JourneysPageContent />
    </Suspense>
  );
}