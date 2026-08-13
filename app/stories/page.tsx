'use client';

import { useState } from 'react';
import { UserStory, Epic } from '@/features/stories/types';
import StoriesSidebar from '@/features/stories/components/StoriesSidebar';
import EmptyDetailPanel from '@/features/stories/components/EmptyDetailPanel';
import EpicDetailPanel from '@/features/stories/components/EpicDetailPanel';
import ManualStoryDetailPanel from '@/features/stories/components/ManualStoryDetailPanel'; 
import AppSidebar from '@/features/common/components/AppSidebar';
import { MessageSquare, Upload, Download, X, Lightbulb } from 'lucide-react';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

export default function StoriesPage() {
  const { epics, userStories, projectName, addStory, updateStory, deleteStory, useAi } = useWizardStore() as any;

  const formattedEpics: Epic[] = epics.map((epic: any, index: number) => ({
    id: epic.id,
    code: `EP-${index + 1}`,
    name: epic.title,
    title: epic.title,
    description: epic.description,
    user_stories: userStories
      .filter((story: any) => story.epicId === epic.id)
      .map((story: any, sIndex: number) => ({
        id: story.id,
        epicId: story.epicId,
        code: `US-${index + 1}.${sIndex + 1}`,
        as_a: story.userType || 'User',
        i_want: story.storyName || 'Melakukan sesuatu',
        so_that: story.description || 'Sistem berjalan dengan baik',
        acceptanceCriteria: [],
        techNotes: [],
        testCases: [],
      })),
  }));

  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  
  // State untuk modal Create New
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAsA, setNewAsA] = useState('');
  const [newSoThat, setNewSoThat] = useState('');
  const [selectedEpicId, setSelectedEpicId] = useState(epics[0]?.id || '');

  // 1. Fungsi Tombol Create New (Menyimpan story baru ke store)
  const handleSaveNewStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (typeof addStory === 'function') {
      addStory({
        id: Date.now().toString(),
        epicId: selectedEpicId || epics[0]?.id,
        storyName: newTitle,
        userType: newAsA || 'User',
        description: newSoThat || 'Sistem berjalan dengan baik',
      });
    }

    // Reset form & tutup modal
    setNewTitle('');
    setNewAsA('');
    setNewSoThat('');
    setIsModalOpen(false);
  };

  // 2. Fungsi Update Story (Mode Manual)
  const handleUpdateStory = (updatedStory: UserStory) => {
    setSelectedStory(updatedStory);
    if (typeof updateStory === 'function') {
      updateStory(updatedStory);
    }
  };

  // 3. Fungsi Delete Story (Mode Manual)
  const handleDeleteStory = () => {
    if (!selectedStory) return;
    if (confirm('Apakah Anda yakin ingin menghapus user story ini?')) {
      if (typeof deleteStory === 'function') {
        deleteStory(selectedStory.id);
      }
      setSelectedStory(null);
    }
  };

  // 4. Fungsi Tombol Upload Dokumen
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
            alert(`File "${file.name}" berhasil di-upload dan dibaca!`);
          } catch (err) {
            alert('Format file tidak valid.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // 5. Fungsi Tombol Download / Export JSON
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formattedEpics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${projectName || 'project'}-stories.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 6. Fungsi Chat Assistant
  const handleChatAssistant = () => {
    alert('Membuka Userdoc Assistant Chat Panel...');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans relative">
      <AppSidebar activeMenu="stories" />

      <StoriesSidebar 
        epics={formattedEpics} 
        selectedStoryId={selectedStory?.id} 
        onSelectStory={(story: UserStory) => {
          setSelectedStory(story);
          setSelectedEpic(null);
        }} 
        onSelectEpic={(epic: Epic) => {
          setSelectedEpic(epic);
          setSelectedStory(null);
        }}
        onAddNew={() => setIsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Header Atas */}
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">
              {projectName ? projectName : 'alalal'} <span className="text-gray-400">/</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              useAi ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {useAi ? 'AI Powered' : 'Manual Mode'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleChatAssistant}
              className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium cursor-pointer"
            >
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

            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ml-1">
              UD
            </div>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!useAi && userStories.length === 0 && (
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-800 shrink-0">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Anda sedang berada di Mode Manual. Silakan buat Epic dan User Story pertama Anda secara mandiri.</span>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            {selectedStory ? (
              // Pengecekan Panel Detail Berdasarkan Mode (AI / Manual)
              useAi ? (
                <EpicDetailPanel story={selectedStory} />
              ) : (
                <ManualStoryDetailPanel 
                  story={selectedStory} 
                  onDelete={handleDeleteStory}
                  onUpdate={handleUpdateStory}
                />
              )
            ) : selectedEpic ? (
              <div className="flex-1 bg-white p-8 overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedEpic.name}</h1>
                <p className="text-sm text-gray-600 mb-6">{selectedEpic.description || 'Tidak ada deskripsi epic.'}</p>
                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">Daftar Stories dalam Epic Ini</h3>
                <ul className="space-y-2">
                  {selectedEpic.user_stories?.map((st) => (
                    <li key={st.id} onClick={() => setSelectedStory(st)} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-800">{st.i_want}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{st.code}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyDetailPanel onOpenAddModal={() => setIsModalOpen(true)} />
            )}
          </div>
        </div>
      </main>

      {/* Modal Form Create New Story */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Create New User Story</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewStory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Pilih Epic</label>
                <select 
                  value={selectedEpicId}
                  onChange={(e) => setSelectedEpicId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                >
                  {epics.map((ep: any) => (
                    <option key={ep.id} value={ep.id}>{ep.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Sebagai (As a)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Admin, Guest, Registered User" 
                  value={newAsA}
                  onChange={(e) => setNewAsA(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Saya ingin (I want to)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: melakukan login ke dalam sistem" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Sehingga (So that)</label>
                <textarea 
                  placeholder="Contoh: saya dapat mengakses dashboard utama" 
                  value={newSoThat}
                  onChange={(e) => setNewSoThat(e.target.value)}
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
                  Simpan Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}