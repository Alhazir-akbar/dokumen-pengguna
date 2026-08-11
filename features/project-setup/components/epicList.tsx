// features/wizard/components/epicList.tsx
'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, EpicItem } from '../store/wizard-store';
import { Sparkles, Trash2, ArrowRight, Plus, Edit3 } from 'lucide-react';

export default function EpicsList() {
  const { projectName, epics, addEpic, updateEpic, removeEpic, nextStep } = useWizardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const titleName = projectName.trim() ? projectName : 'your project';

  // Membuka modal untuk mode Tambah Baru
  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(true);
  };

  // Membuka modal untuk mode Edit (ketika kartu Epic diklik)
  const handleOpenEditModal = (epic: EpicItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(epic.id);
    setNewTitle(epic.title);
    setNewDesc(epic.description);
    setIsModalOpen(true);
  };

  // Simpan data (bisa untuk Create baru atau Update data lama)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (editingId) {
      // Mode Update / Edit
      updateEpic(editingId, {
        title: newTitle,
        description: newDesc || 'No description provided.',
      });
    } else {
      // Mode Create / Tambah Baru
      const newItem: EpicItem = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDesc || 'No description provided.',
      };
      addEpic(newItem);
    }

    setNewTitle('');
    setNewDesc('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-6 text-center">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Epics for {titleName}
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-6 max-w-xl">
        Epics are high-level feature categories that help organize your user stories. Click on any epic card to edit its contents, or add/remove them as needed.
      </p>

      {/* Grid Container untuk Epics */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 w-full mb-6 backdrop-blur-md shadow-xl text-left">
        {epics.length === 0 ? (
          <div className="py-12 text-center text-blue-200 text-sm">
            No epics available. Click &quot;Add epic&quot; below or generate with AI.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {epics.map((epic: EpicItem) => (
              <div 
                key={epic.id} 
                onClick={(e) => handleOpenEditModal(epic, e)}
                className="bg-blue-600/20 hover:bg-blue-600/40 border border-white/10 rounded-xl p-4 flex flex-col justify-between transition-all group relative cursor-pointer"
                title="Click to edit epic"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                      {epic.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {/* Tombol Edit Cepat */}
                      <span className="text-blue-200 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <Edit3 className="w-3.5 h-3.5" />
                      </span>
                      {/* Tombol Delete */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEpic(epic.id);
                        }}
                        title="Delete epic"
                        className="text-red-300 hover:text-red-100 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-blue-200/80 text-xs leading-relaxed line-clamp-4">
                    {epic.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-2 border-t border-white/10">
                  <span className="text-[10px] text-gray-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Generated
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tombol Navigasi Bawah */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={nextStep}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-blue-600/50 hover:bg-blue-600/80 border border-blue-400/40 text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-sm shadow-sm cursor-pointer"
        >
          Add epic <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Tambah / Edit Epic */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-400/30 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Epic' : 'Add New Epic'}
            </h3>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Epic Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Payment Gateway Integration"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what features this epic includes..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
                >
                  {editingId ? 'Update Epic' : 'Save Epic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}