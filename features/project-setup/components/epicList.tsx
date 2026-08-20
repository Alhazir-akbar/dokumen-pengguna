'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Check, Plus, X, Pencil } from 'lucide-react';

export default function EpicsList() {
  const { projectName, epics, addEpic, removeEpic, updateEpic, nextStep } = useWizardStore() as any;

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleAddEpic = () => {
    if (!newTitle.trim()) return;

    addEpic({
      id: `epic-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
    });

    setNewTitle('');
    setNewDescription('');
    setIsAdding(false);
  };

  const startEditing = (epic: { id: string; title: string; description: string }) => {
    setEditingId(epic.id);
    setEditTitle(epic.title);
    setEditDescription(epic.description);
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateEpic(editingId, {
      title: editTitle.trim() || 'Untitled Epic',
      description: editDescription.trim(),
    });
    setEditingId(null);
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="flex flex-col items-start w-full max-w-5xl mx-auto pt-10 px-4">

      <div className="w-full flex flex-col items-center mb-8">
        <LogoUserdoc />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        Epics for {titleName}
      </h1>

      <p className="text-blue-200 text-sm mb-6 leading-relaxed max-w-3xl">
        Epics are high-level feature categories that help organize your user stories. We've suggested some epics below based on your project, but feel free to add more, edit, or remove them.
      </p>

      {/* Grid Epics */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {epics.map((epic: any) => (
          <div
            key={epic.id}
            className="group relative bg-white/10 border border-blue-300/30 rounded-xl p-4 backdrop-blur-sm hover:bg-white/15 transition-all"
          >
            {/* Aksi Edit & Hapus (muncul saat hover) */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => startEditing(epic)}
                className="text-blue-200 hover:text-white p-1 cursor-pointer"
                title="Edit epic"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeEpic(epic.id)}
                className="text-blue-200 hover:text-red-300 p-1 cursor-pointer"
                title="Remove epic"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {editingId === epic.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-2.5 py-1.5 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
                  autoFocus
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-2.5 py-1.5 text-blue-100 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-blue-200 hover:text-white text-xs px-2 py-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="bg-white text-blue-700 text-xs px-3 py-1 rounded-lg font-medium hover:bg-blue-50 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-white text-sm font-semibold mb-1.5 pr-10">
                  {epic.title}
                </h3>
                <p className="text-blue-200 text-xs leading-relaxed line-clamp-4">
                  {epic.description}
                </p>
              </>
            )}
          </div>
        ))}

        {/* Card kosong / placeholder kalau belum ada epic sama sekali */}
        {epics.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-10 text-blue-200 text-sm">
            Belum ada epic. Klik "Add epic" untuk menambahkan secara manual.
          </div>
        )}
      </div>

      {/* Form Tambah Epic Baru */}
      {isAdding && (
        <div className="w-full bg-white/10 border border-blue-300/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Judul epic..."
            autoFocus
            className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-3 py-2 text-white text-sm font-semibold placeholder-blue-300/60 mb-2 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Deskripsi singkat epic ini..."
            rows={3}
            className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-3 py-2 text-blue-100 text-xs placeholder-blue-300/60 resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTitle('');
                setNewDescription('');
              }}
              className="text-blue-200 hover:text-white text-xs px-3 py-1.5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddEpic}
              disabled={!newTitle.trim()}
              className="bg-white text-blue-700 text-xs px-4 py-1.5 rounded-lg font-medium hover:bg-blue-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Tombol Navigasi Bawah */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={handleNext}
          className="bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          Next <Check className="w-4 h-4" />
        </button>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add epic
          </button>
        )}
      </div>
    </div>
  );
}