'use client';

import { useState } from 'react';
import AppSidebar from '@/features/common/components/AppSidebar';
import JourneysSidebar from '@/features/journeys/components/journeySidebar';
import EmptyJourneyPanel from '@/features/journeys/components/emptyJourneyPanel';
import JourneyDetailPanel from '@/features/journeys/components/journeyDetailPanel';
import { Upload, Download, X } from 'lucide-react';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

export default function JourneysPage() {
  const { projectName } = useWizardStore() as any;

  const [journeys, setJourneys] = useState([
    {
      id: '1',
      title: 'From guest preview to shared signup loop',
      description: 'Guest User visits alalal, browses limited content...',
      personasCount: 2,
      storiesCount: 0,
      stepsCount: 11,
    }
  ]);

  const [selectedJourney, setSelectedJourney] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Handler Buka Modal Create Baru
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit
  const handleOpenEditModal = () => {
    if (!selectedJourney) return;
    setIsEditMode(true);
    setNewTitle(selectedJourney.title || '');
    setNewDesc(selectedJourney.description || '');
    setIsModalOpen(true);
  };

  // Handler Simpan (Create atau Update)
  const handleSaveJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (isEditMode && selectedJourney) {
      // Update Journey yang ada
      const updatedJourneys = journeys.map(j => 
        j.id === selectedJourney.id ? { ...j, title: newTitle, description: newDesc } : j
      );
      setJourneys(updatedJourneys);
      setSelectedJourney({ ...selectedJourney, title: newTitle, description: newDesc });
    } else {
      // Buat Journey Baru
      const newJ = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDesc || 'Deskripsi user journey baru...',
        personasCount: 1,
        storiesCount: 0,
        stepsCount: 1,
      };
      setJourneys([newJ, ...journeys]);
      setSelectedJourney(newJ);
    }

    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans relative">
      <AppSidebar activeMenu="journeys" />

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
            {projectName || 'alalal'} <span className="text-gray-400">/</span>
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
            onSave={(updated) => {
              setJourneys(journeys.map(j => j.id === updated.id ? updated : j));
              setSelectedJourney(updated);
            }}
          />
        ) : (
          <EmptyJourneyPanel onOpenAddModal={handleOpenCreateModal} />
        )}
      </main>

      {/* Modal Form Create & Edit */}
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