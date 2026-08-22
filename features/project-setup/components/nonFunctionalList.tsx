'use client';

import { useState, useEffect } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, NonFunctionalItem } from '../store/wizard-store';
import { Sparkles, Trash2, ArrowRight, Plus, Pencil, X, AlertCircle } from 'lucide-react';

export default function NonFunctionalList() {
  const {
    projectName,
    nonFunctionals,
    addNonFunctional,
    removeNonFunctional,
    updateNonFunctional,
    nextStep,
  } = useWizardStore() as any;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const newItem: NonFunctionalItem = {
      id: Date.now().toString(),
      category: newCategory.trim(),
      description: newDesc.trim() || 'No description provided.',
    };

    addNonFunctional(newItem);
    setNewCategory('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  const startEditing = (item: NonFunctionalItem) => {
    setEditingId(item.id);
    setEditCategory(item.category);
    setEditDesc(item.description);
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (typeof updateNonFunctional === 'function') {
      updateNonFunctional(editingId, {
        category: editCategory.trim() || 'Untitled',
        description: editDesc.trim(),
      });
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto pt-6 text-center">

      <div className="w-full flex flex-col items-center mb-4 header-fade">
        <LogoUserdoc />
      </div>

      <div className="header-fade" style={{ animationDelay: '80ms' }}>
        <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3 text-xs text-blue-200 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          {nonFunctionals.length} kebutuhan direkomendasikan oleh AI
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Non-Functional Requirements for {titleName}
        </h1>

        <p className="text-blue-200 text-xs sm:text-sm mb-6 max-w-xl">
          Non-functional requirements mendefinisikan batasan dan atribut kualitas sistemmu — bagaimana sistem
          seharusnya bekerja, bukan sekadar fitur apa yang dimiliki. Kami sudah menyusun beberapa kebutuhan umum
          di bawah, silakan tambah, edit, atau hapus sesuai kebutuhan.
        </p>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 w-full mb-6 backdrop-blur-md shadow-xl text-left flex flex-col gap-3">
        {nonFunctionals.length === 0 ? (
          <div className="py-8 text-center text-blue-200 text-sm">
            Belum ada non-functional requirement. Klik &quot;Add requirement&quot; di bawah.
          </div>
        ) : (
          nonFunctionals.map((item: NonFunctionalItem, index: number) => (
            <div
              key={item.id}
              className={`bg-blue-600/20 hover:bg-blue-600/30 border border-white/10 hover:border-blue-300/40 rounded-xl p-4 flex items-start justify-between gap-4 transition-all duration-300 group ${
                mounted ? 'card-enter' : 'opacity-0'
              }`}
              style={{ animationDelay: mounted ? `${Math.min(index, 10) * 60}ms` : undefined }}
            >
              {editingId === item.id ? (
                <div className="flex flex-col gap-2 w-full">
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
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono text-blue-300/70">
                        NFR-{index + 1}
                      </span>
                      <span className="text-white font-semibold text-sm">{item.category}</span>
                    </div>
                    <p className="text-blue-200/80 text-xs leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      title="Edit requirement"
                      className="p-1.5 text-blue-200 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeNonFunctional(item.id)}
                      title="Delete requirement"
                      className="p-1.5 text-red-300 hover:text-red-100 transition-colors rounded-lg hover:bg-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

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
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600/50 hover:bg-blue-600/80 border border-blue-400/40 text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-sm shadow-sm cursor-pointer"
        >
          Add requirement <Plus className="w-4 h-4" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-400/30 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left card-enter">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add Non-Functional Requirement</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Category / Attribute</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scalability, Maintainability"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  autoFocus
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

              {!newCategory.trim() && (
                <p className="text-red-300 text-xs flex items-center gap-1.5 -mt-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Kategori wajib diisi.
                </p>
              )}

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
                  disabled={!newCategory.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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