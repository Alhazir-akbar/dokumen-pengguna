<<<<<<< HEAD
<<<<<<< HEAD
// features/project-setup/components/userTypes.tsx
=======
>>>>>>> origin/dev
=======
// features/project-setup/components/UserTypes.tsx
>>>>>>> 23ab38d (add file)
'use client';

import { useState, useEffect } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, UserTypeItem } from '../store/wizard-store';
<<<<<<< HEAD
import { Sparkles, Trash2, ArrowRight, Plus, AlertCircle } from 'lucide-react';

export default function UserTypes() {
<<<<<<< HEAD
  const { projectName, userTypes, addUserType, removeUserType, updateUserTypeDescription, nextStep } = useWizardStore() as any;
=======
  const { projectName, userTypes, addUserType, removeUserType, updateUserTypeDescription, nextStep } = useWizardStore();
>>>>>>> origin/dev
  const [isModalOpen, setIsModalOpen] = useState(false);
=======
import { Plus, X, Pencil, Sparkles, ArrowRight, Trash2 } from 'lucide-react';

export default function UserTypes() {
  const { projectName, userTypes, addUserType, removeUserType, updateUserTypeDescription, nextStep } = useWizardStore() as any;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const [isAdding, setIsAdding] = useState(false);
>>>>>>> 23ab38d (add file)
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [error, setError] = useState(false);

<<<<<<< HEAD
  const titleName = projectName?.trim() ? projectName : 'your project';
=======
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
>>>>>>> 23ab38d (add file)

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleAddUserType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

<<<<<<< HEAD
    const newItem: UserTypeItem = {
      id: Date.now().toString(),
      name: newTypeName.trim(),
      description: newTypeDesc.trim() || 'No description provided.',
    };

    addUserType(newItem);
=======
    addUserType({
      id: `ut-${Date.now()}`,
      name: newTypeName.trim(),
      description: newTypeDesc.trim() || 'No description provided.',
    });
    
>>>>>>> 23ab38d (add file)
    setNewTypeName('');
    setNewTypeDesc('');
    setIsAdding(false);
    if (error) setError(false);
  };

<<<<<<< HEAD
<<<<<<< HEAD
  const handleAiGenerateDesc = (user: UserTypeItem) => {
    const aiGeneratedDescription = `A key stakeholder responsible for interacting with ${titleName}, managing core features, ensuring seamless operational workflow, and meeting system objectives.`;
=======
  // Fungsi untuk mensimulasikan AI Generate deskripsi berdasarkan nama tipe user
  const handleAiGenerateDesc = (user: UserTypeItem) => {
    const aiGeneratedDescription = `A key stakeholder responsible for interacting with ${titleName}, managing core features, and overseeing workflow efficiency.`;
    
    // Jika store Anda memiliki fungsi update, gunakan itu. Jika belum, kita fallback atau asumsikan ada.
    // Pastikan fungsi updateUserTypeDescription ada di wizard-store.ts Anda.
>>>>>>> origin/dev
=======
  const handleAiGenerateDesc = (user: UserTypeItem) => {
    const aiGeneratedDescription = `A key stakeholder responsible for interacting with ${titleName}, managing core features, and overseeing workflow efficiency.`;
>>>>>>> 23ab38d (add file)
    if (updateUserTypeDescription) {
      updateUserTypeDescription(user.id, aiGeneratedDescription);
    }
  };

  const startEditing = (user: UserTypeItem) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditDesc(user.description || '');
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    if (updateUserTypeDescription) {
      updateUserTypeDescription(editingId, editDesc);
    }
    setEditingId(null);
  };

  const handleNext = () => {
<<<<<<< HEAD
    if (!userTypes || userTypes.length === 0) {
=======
    if (userTypes.length === 0) {
>>>>>>> origin/dev
      setError(true);
      return;
    }
    setError(false);
    nextStep();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-6 text-center pb-12">
<<<<<<< HEAD
      <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
        User types of <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-white">{titleName}</span>
      </h1>
      
      <p className="text-blue-100/80 text-xs sm:text-sm mb-8 max-w-lg leading-relaxed">
        Software is nothing without users. What are the different types of users who will interact with {titleName}? 
        Gunakan tombol <Sparkles className="w-3.5 h-3.5 inline text-yellow-300 mx-0.5" /> untuk memperbarui deskripsi dengan AI.
      </p>

<<<<<<< HEAD
      <div className={`bg-white/10 border rounded-3xl w-full mb-4 backdrop-blur-xl shadow-2xl overflow-hidden divide-y divide-white/10 text-left transition-all ${
        error ? 'border-red-400 ring-4 ring-red-400/20 bg-red-950/10' : 'border-blue-400/30'
      }`}>
        {!userTypes || userTypes.length === 0 ? (
          <div className="p-10 text-center text-blue-200/70 text-sm">
            Belum ada tipe pengguna yang ditambahkan. Klik &quot;Add user type&quot; di bawah untuk mulai.
=======
      {/* List Card Container */}
      <div className={`bg-white/10 border rounded-2xl w-full mb-2 backdrop-blur-md shadow-xl overflow-hidden divide-y divide-white/10 text-left transition-all ${
=======
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        User types of {titleName}
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-6 max-w-lg">
        Software is nothing without users. What are the different types of users who will interact with {titleName}?
      </p>

      <div className={`bg-white/10 border rounded-2xl w-full mb-4 backdrop-blur-md shadow-xl overflow-hidden divide-y divide-white/10 text-left transition-all ${
>>>>>>> 23ab38d (add file)
        error ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/20'
      }`}>
        {userTypes.length === 0 ? (
          <div className="p-8 text-center text-blue-200 text-sm">
            No user types added yet. Click &quot;Add user type&quot; below.
>>>>>>> origin/dev
          </div>
        ) : (
          userTypes.map((user: UserTypeItem) => (
<<<<<<< HEAD
            <div key={user.id} className="p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex flex-col max-w-[75%]">
                <span className="text-white font-bold text-sm sm:text-base mb-1.5">{user.name}</span>
                <p className="text-blue-200/90 text-xs sm:text-sm leading-relaxed">{user.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => handleAiGenerateDesc(user)}
                  title="Generate or enhance with AI"
<<<<<<< HEAD
                  className="p-2 text-yellow-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-white/10 cursor-pointer shadow-sm bg-white/5"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
=======
                  className="p-1.5 text-blue-200 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
>>>>>>> origin/dev
                </button>
                <button
                  type="button"
                  onClick={() => removeUserType(user.id)}
                  title="Delete user type"
<<<<<<< HEAD
                  className="p-2 text-red-300 hover:text-white transition-colors rounded-xl hover:bg-red-500/20 border border-red-500/20 cursor-pointer shadow-sm bg-red-950/20"
=======
                  className="p-1.5 text-gray-300 hover:text-red-100 transition-colors rounded-lg hover:bg-red-500/20 cursor-pointer"
>>>>>>> origin/dev
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
=======
            <div key={user.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors">
              {editingId === user.id ? (
                <div className="w-full flex flex-col gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white/10 border border-blue-300/40 rounded-xl px-3 py-1.5 text-white text-sm font-semibold focus:outline-none"
                    autoFocus
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-white/10 border border-blue-300/40 rounded-xl px-3 py-1.5 text-blue-100 text-xs resize-none focus:outline-none"
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
                  <div className="flex flex-col max-w-[75%]">
                    <span className="text-white font-semibold text-sm sm:text-base mb-1">{user.name}</span>
                    <p className="text-blue-200 text-xs leading-relaxed">{user.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAiGenerateDesc(user)}
                      title="Generate description with AI"
                      className="p-1.5 text-yellow-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditing(user)}
                      title="Edit user type"
                      className="p-1.5 text-blue-200 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUserType(user.id)}
                      title="Delete user type"
                      className="p-1.5 text-red-300 hover:text-red-100 transition-colors rounded-lg hover:bg-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
>>>>>>> 23ab38d (add file)
            </div>
          ))
        )}
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      {error && (
        <div className="w-full text-left mb-4 animate-fadeIn">
          <p className="text-red-300 text-xs flex items-center gap-1.5 bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            Tambahkan minimal 1 user type sebelum melanjutkan ke tahap berikutnya.
=======
      {/* Pesan Peringatan Jika Kosong */}
=======
      {isAdding && (
        <form onSubmit={handleAddUserType} className="bg-white/10 border border-blue-300/40 rounded-2xl p-4 w-full mb-4 backdrop-blur-md shadow-xl text-left flex flex-col gap-3">
          <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Add New User Type</span>
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="User type name (e.g. Administrator, Customer)..."
            autoFocus
            className="w-full bg-white/10 border border-blue-300/40 rounded-xl px-3 py-2 text-white text-sm font-semibold placeholder-blue-300/60 focus:outline-none"
          />
          <textarea
            value={newTypeDesc}
            onChange={(e) => setNewTypeDesc(e.target.value)}
            placeholder="Describe what this user does..."
            rows={2}
            className="w-full bg-white/10 border border-blue-300/40 rounded-xl px-3 py-2 text-blue-100 text-xs placeholder-blue-300/60 resize-none focus:outline-none"
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
              type="submit"
              disabled={!newTypeName.trim()}
              className="bg-white text-blue-700 text-xs px-4 py-1.5 rounded-lg font-medium hover:bg-blue-50 cursor-pointer disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>
      )}

>>>>>>> 23ab38d (add file)
      {error && (
        <div className="w-full text-left mb-4">
          <p className="text-red-300 text-xs">
            ⚠️ Tambahkan minimal 1 user type sebelum melanjutkan ke tahap berikutnya.
>>>>>>> origin/dev
          </p>
        </div>
      )}

<<<<<<< HEAD
<<<<<<< HEAD
=======
      {!error && <div className="mb-4"></div>}

      {/* Tombol Bawah (Next & Add User Type) */}
>>>>>>> origin/dev
=======
>>>>>>> 23ab38d (add file)
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={handleNext}
<<<<<<< HEAD
<<<<<<< HEAD
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2.5 shadow-xl text-sm cursor-pointer"
=======
          className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
>>>>>>> origin/dev
=======
          className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg cursor-pointer text-sm"
>>>>>>> 23ab38d (add file)
        >
          <span>Next</span> <ArrowRight className="w-4 h-4" />
        </button>

<<<<<<< HEAD
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm shadow-xl cursor-pointer"
        >
          <span>Add user type</span> <Plus className="w-4 h-4" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-400/30 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl text-left backdrop-blur-2xl">
            <h3 className="text-lg font-extrabold text-white mb-4">Add New User Type</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1.5">User Type Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Administrator, Customer, Moderator"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
<<<<<<< HEAD
                  className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30"
=======
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-blue-400"
>>>>>>> origin/dev
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what this user does..."
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
<<<<<<< HEAD
                  className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 resize-none placeholder:text-blue-200/30"
=======
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-blue-400 resize-none"
>>>>>>> origin/dev
                />
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
<<<<<<< HEAD
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
=======
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
>>>>>>> origin/dev
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
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
            <Plus className="w-4 h-4" /> Add user type
          </button>
        )}
      </div>
>>>>>>> 23ab38d (add file)
    </div>
  );
}