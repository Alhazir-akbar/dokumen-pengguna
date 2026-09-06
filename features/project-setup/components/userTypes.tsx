'use client';

import { useState, useEffect } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
<<<<<<< Updated upstream
import { useWizardStore, UserTypeItem } from '../store/wizard-store';
import { Sparkles, Trash2, ArrowRight, Plus } from 'lucide-react';

export default function UserTypes() {
  const { projectName, userTypes, addUserType, removeUserType, updateUserTypeDescription, nextStep } = useWizardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
=======
import { useWizardStore } from '../store/wizard-store';
import { Plus, X, Pencil, Sparkles, ArrowRight } from 'lucide-react';

export default function UserTypes() {
  const { projectName, userTypes, addUserType, removeUserType, updateUserTypeDescription, nextStep } = useWizardStore() as any;

  const [isAdding, setIsAdding] = useState(false);
>>>>>>> Stashed changes
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const titleName = projectName.trim() ? projectName : 'your project';

  const handleAddUserType = () => {
    if (!newTypeName.trim()) return;
<<<<<<< Updated upstream

    const newItem: UserTypeItem = {
      id: Date.now().toString(),
      name: newTypeName,
      description: newTypeDesc || 'No description provided.',
    };

    addUserType(newItem);
=======
    addUserType({
      id: `ut-${Date.now()}`,
      name: newTypeName.trim(),
      description: newTypeDesc.trim() || 'No description provided.',
    });
>>>>>>> Stashed changes
    setNewTypeName('');
    setNewTypeDesc('');
    setIsAdding(false);
  };

<<<<<<< Updated upstream
  // Fungsi untuk mensimulasikan AI Generate deskripsi berdasarkan nama tipe user
  const handleAiGenerateDesc = (user: UserTypeItem) => {
    const aiGeneratedDescription = `A key stakeholder responsible for interacting with ${titleName}, managing core features, and overseeing workflow efficiency.`;
    
    // Jika store Anda memiliki fungsi update, gunakan itu. Jika belum, kita fallback atau asumsikan ada.
    // Pastikan fungsi updateUserTypeDescription ada di wizard-store.ts Anda.
    if (updateUserTypeDescription) {
      updateUserTypeDescription(user.id, aiGeneratedDescription);
    }
  };

  const handleNext = () => {
    if (userTypes.length === 0) {
      setError(true);
      return;
    }
    setError(false);
=======
  const startEditing = (user: { id: string; name: string; description: string }) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditDescription(user.description);
  };

  const saveEdit = () => {
    if (!editingId) return;
    // Menggunakan fungsi update store atau custom update description
    updateUserTypeDescription(editingId, editDescription.trim());
    setEditingId(null);
  };

  const handleAiEnhance = (user: { id: string; name: string }) => {
    const enhancedDesc = `A key stakeholder (${user.name}) responsible for interacting with ${titleName}, managing core workflows, and utilizing tailored system capabilities.`;
    updateUserTypeDescription(user.id, enhancedDesc);
  };

  const handleNext = () => {
>>>>>>> Stashed changes
    nextStep();
  };

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-6 text-center">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        User types of {titleName}
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-6 max-w-lg">
        Software is nothing without users. What are the different types of users who will interact with {titleName}? (click the <Sparkles className="w-3.5 h-3.5 inline text-yellow-300 mx-0.5" /> to create a user type, or add a description based on the name).
      </p>

      {/* List Card Container */}
      <div className={`bg-white/10 border rounded-2xl w-full mb-2 backdrop-blur-md shadow-xl overflow-hidden divide-y divide-white/10 text-left transition-all ${
        error ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/20'
      }`}>
        {userTypes.length === 0 ? (
          <div className="p-8 text-center text-blue-200 text-sm">
            No user types added yet. Click &quot;Add user type&quot; below.
          </div>
        ) : (
          userTypes.map((user: UserTypeItem) => (
            <div key={user.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex flex-col max-w-[75%]">
                <span className="text-white font-semibold text-sm sm:text-base mb-1">{user.name}</span>
                <p className="text-blue-200 text-xs leading-relaxed">{user.description}</p>
              </div>

              {/* Aksi Ikon (AI & Delete) */}
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => handleAiGenerateDesc(user)}
                  title="Generate or enhance with AI"
                  className="p-1.5 text-blue-200 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </button>
                <button
                  type="button"
                  onClick={() => removeUserType(user.id)}
                  title="Delete user type"
                  className="p-1.5 text-gray-300 hover:text-red-100 transition-colors rounded-lg hover:bg-red-500/20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pesan Peringatan Jika Kosong */}
      {error && (
        <div className="w-full text-left mb-4">
          <p className="text-red-300 text-xs">
            ⚠️ Tambahkan minimal 1 user type sebelum melanjutkan ke tahap berikutnya.
          </p>
        </div>
      )}
=======
    <div className="flex flex-col items-start w-full max-w-5xl mx-auto pt-10 px-4">
      <div className="w-full flex flex-col items-center mb-8 header-fade">
        <LogoUserdoc />
      </div>

      <div className="header-fade" style={{ animationDelay: '80ms' }}>
        <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3 text-xs text-blue-200 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          {userTypes.length} user types terdeteksi untuk proyek ini
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          User types of {titleName}
        </h1>

        <p className="text-blue-200 text-sm mb-6 leading-relaxed max-w-3xl">
          Software is nothing without users. Siapa saja tipe pengguna yang akan berinteraksi dengan sistem ini? 
          Kamu bisa menambah, mengubah, atau menyempurnakan deskripsinya menggunakan AI.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {userTypes.map((user: any, index: number) => (
          <div
            key={user.id}
            className={`group relative bg-white/10 border border-blue-300/30 rounded-xl p-4 backdrop-blur-sm hover:bg-white/15 hover:border-blue-300/50 hover:-translate-y-0.5 transition-all duration-300 ${
              mounted ? 'card-enter' : 'opacity-0'
            }`}
            style={{ animationDelay: mounted ? `${Math.min(index, 8) * 60}ms` : undefined }}
          >
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleAiEnhance(user)}
                className="text-yellow-300 hover:text-white p-1 cursor-pointer"
                title="Enhance with AI"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => startEditing(user)}
                className="text-blue-200 hover:text-white p-1 cursor-pointer"
                title="Edit user type"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeUserType(user.id)}
                className="text-blue-200 hover:text-red-300 p-1 cursor-pointer"
                title="Remove user type"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {editingId === user.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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
                <div className="flex items-start gap-1.5 mb-1.5 pr-14">
                  <span className="text-[10px] font-mono text-blue-300/70 mt-0.5 shrink-0">
                    UT-{index + 1}
                  </span>
                  <h3 className="text-white text-sm font-semibold">{user.name}</h3>
                </div>
                <p className="text-blue-200 text-xs leading-relaxed line-clamp-4">{user.description}</p>
              </>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="card-enter w-full bg-white/10 border border-blue-300/40 rounded-xl p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-3">
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Nama tipe pengguna (cth: Administrator, Customer)..."
              autoFocus
              className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-3 py-2 text-white text-sm font-semibold placeholder-blue-300/60 mb-2 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <textarea
              value={newTypeDesc}
              onChange={(e) => setNewTypeDesc(e.target.value)}
              placeholder="Deskripsi singkat peran pengguna ini..."
              rows={3}
              className="w-full bg-white/10 border border-blue-300/40 rounded-lg px-3 py-2 text-blue-100 text-xs placeholder-blue-300/60 resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTypeName('');
                  setNewTypeDesc('');
                }}
                className="text-blue-200 hover:text-white text-xs px-3 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddUserType}
                disabled={!newTypeName.trim()}
                className="bg-white text-blue-700 text-xs px-4 py-1.5 rounded-lg font-medium hover:bg-blue-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {userTypes.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-10 text-blue-200 text-sm">
            Belum ada user type. Klik "Add user type" untuk menambahkan secara manual.
          </div>
        )}
      </div>
>>>>>>> Stashed changes

      {!error && <div className="mb-4"></div>}

      {/* Tombol Bawah (Next & Add User Type) */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={handleNext}
<<<<<<< Updated upstream
          className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
=======
          className="bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg cursor-pointer"
>>>>>>> Stashed changes
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>

<<<<<<< Updated upstream
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600/50 hover:bg-blue-600/80 border border-blue-400/40 text-white px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-2 text-sm shadow-sm cursor-pointer"
        >
          Add user type <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Modal / Popup Tambah User Type */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-blue-400/30 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Add New User Type</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-blue-500 mb-1">User Type Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Administrator, Customer"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what this user does..."
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
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
            className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add user type
          </button>
        )}
      </div>
>>>>>>> Stashed changes
    </div>
  );
}