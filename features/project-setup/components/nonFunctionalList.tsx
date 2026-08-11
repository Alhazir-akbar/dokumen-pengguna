'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, NonFunctionalItem } from '../store/wizard-store';
import { Sparkles, Trash2, ArrowRight, Plus } from 'lucide-react';

export default function NonFunctionalList() {
  const { projectName, nonFunctionals, addNonFunctional, removeNonFunctional, nextStep } = useWizardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const titleName = projectName.trim() ? projectName : 'your project';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const newItem: NonFunctionalItem = {
      id: Date.now().toString(),
      category: newCategory,
      description: newDesc || 'No description provided.',
    };

    addNonFunctional(newItem);
    setNewCategory('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  return (
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
            </div>
          ))
        )}
      </div>

      {/* Tombol Navigasi Bawah */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={nextStep}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>

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

    </div>
  );
}