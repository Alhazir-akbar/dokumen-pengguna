// features/project-setup/components/NonFunctionalList.tsx
'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, NonFunctionalItem } from '../store/wizard-store';
<<<<<<< Updated upstream
import { Sparkles, Trash2, ArrowRight, Plus } from 'lucide-react';

export default function NonFunctionalList() {
  const { projectName, nonFunctionals, addNonFunctional, removeNonFunctional, nextStep } = useWizardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
=======
import { Sparkles, Trash2, ArrowRight, Plus, Pencil, X } from 'lucide-react';

export default function NonFunctionalList() {
  const {
    projectName,
    nonFunctionals,
    addNonFunctional,
    removeNonFunctional,
    updateNonFunctional,
    nextStep,
  } = useWizardStore() as any;

  const [isAdding, setIsAdding] = useState(false);
>>>>>>> Stashed changes
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const titleName = projectName.trim() ? projectName : 'your project';

  const handleAdd = () => {
    if (!newCategory.trim()) return;

    const newItem: NonFunctionalItem = {
      id: Date.now().toString(),
      category: newCategory,
      description: newDesc || 'No description provided.',
    };

    addNonFunctional(newItem);
    setNewCategory('');
    setNewDesc('');
    setIsAdding(false);
  };

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto pt-6 text-center">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Non-Functional Requirements for {titleName}
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-6 max-w-xl">
        Non-functional requirements define the constraints and quality attributes of your system - how it should perform rather than what it should do. We&apos;ve suggested some common requirements below, but feel free to add more, edit, or remove them.
      </p>

      {/* List Container Transparan */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 w-full mb-6 backdrop-blur-md shadow-xl text-left flex flex-col gap-3">
        {nonFunctionals.length === 0 ? (
          <div className="py-8 text-center text-blue-200 text-sm">
            No non-functional requirements added yet. Click &quot;Add requirement&quot; below.
          </div>
        ) : (
          nonFunctionals.map((item) => (
            <div 
              key={item.id} 
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4 transition-all group"
            >
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm mb-1">{item.category}</span>
                <p className="text-blue-200/80 text-xs leading-relaxed">{item.description}</p>
              </div>

              {/* Tombol Hapus */}
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <button
                  type="button"
                  title="Generate with AI"
                  className="p-1.5 text-blue-200 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </button>
                <button
                  type="button"
                  onClick={() => removeNonFunctional(item.id)}
                  title="Delete requirement"
                  className="p-1.5 text-red-300 hover:text-red-100 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
=======
    <div className="flex flex-col items-start w-full max-w-5xl mx-auto pt-10 px-4 pb-12">
      <div className="w-full flex flex-col items-center mb-8 header-fade">
        <LogoUserdoc />
      </div>

      <div className="header-fade w-full" style={{ animationDelay: '80ms' }}>
        <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3 text-xs text-blue-200 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          {nonFunctionals.length} kebutuhan direkomendasikan oleh AI
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Non-Functional Requirements for {titleName}
        </h1>

        <p className="text-blue-200 text-sm mb-6 leading-relaxed max-w-3xl">
          Non-functional requirements mendefinisikan batasan dan atribut kualitas sistemmu — bagaimana sistem
          seharusnya bekerja, bukan sekadar fitur apa yang dimiliki. Kami sudah menyusun beberapa kebutuhan umum
          di bawah, silakan tambah, edit, atau hapus sesuai kebutuhan.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {nonFunctionals.map((item: NonFunctionalItem, index: number) => (
          <div
            key={item.id}
            className={`group relative bg-white/10 border border-blue-300/30 rounded-xl p-4 backdrop-blur-sm hover:bg-white/15 hover:border-blue-300/50 hover:-translate-y-0.5 transition-all duration-300 ${
              mounted ? 'card-enter' : 'opacity-0'
            }`}
            style={{ animationDelay: mounted ? `${Math.min(index, 10) * 60}ms` : undefined }}
          >
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => startEditing(item)}
                className="text-blue-200 hover:text-white p-1 cursor-pointer"
                title="Edit requirement"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeNonFunctional(item.id)}
                className="text-blue-200 hover:text-red-300 p-1 cursor-pointer"
                title="Remove requirement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
>>>>>>> Stashed changes
            </div>

            {editingId === item.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-2.5 py-1.5 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
                  autoFocus
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
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
                <div className="flex items-start gap-1.5 mb-1.5 pr-10">
                  <span className="text-[10px] font-mono text-blue-300/70 mt-0.5 shrink-0">
                    NFR-{index + 1}
                  </span>
                  <h3 className="text-white text-sm font-semibold">{item.category}</h3>
                </div>
                <p className="text-blue-200 text-xs leading-relaxed line-clamp-4">{item.description}</p>
              </>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="card-enter w-full bg-white/10 border border-blue-300/40 rounded-xl p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category / Attribute (cth: Scalability, Security)..."
              autoFocus
              className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-3 py-2 text-white text-sm font-semibold placeholder-blue-300/60 mb-2 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe the performance or constraint..."
              rows={3}
              className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-3 py-2 text-blue-100 text-xs placeholder-blue-300/60 resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategory('');
                  setNewDesc('');
                }}
                className="text-blue-200 hover:text-white text-xs px-3 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newCategory.trim()}
                className="bg-white text-blue-700 text-xs px-4 py-1.5 rounded-lg font-medium hover:bg-blue-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {nonFunctionals.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-10 text-blue-200 text-sm">
            Belum ada non-functional requirement. Klik "Add requirement" untuk menambahkan secara manual.
          </div>
        )}
      </div>

      {/* Tombol Navigasi Bawah */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={nextStep}
<<<<<<< Updated upstream
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm"
=======
          className="bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg cursor-pointer text-sm"
>>>>>>> Stashed changes
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>

<<<<<<< Updated upstream
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600/50 hover:bg-blue-600/80 border border-blue-400/40 text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-sm shadow-sm"
        >
          Add requirement <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Tambah Non-Functional Requirement Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-400/30 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white mb-4">Add Non-Functional Requirement</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Category / Attribute</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scalability, Maintainability"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the performance or constraint..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

=======
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" /> Add requirement
          </button>
        )}
      </div>
>>>>>>> Stashed changes
    </div>
  );
}