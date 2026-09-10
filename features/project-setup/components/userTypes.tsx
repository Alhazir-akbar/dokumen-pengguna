// features/wizard/components/userTypes.tsx
'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, UserTypeItem } from '../store/wizard-store';
<<<<<<< Updated upstream
import { Sparkles, Trash2, ArrowRight, Plus } from 'lucide-react';

export default function UserTypes() {
  const { projectName, userTypes, addUserType, removeUserType, nextStep } = useWizardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
=======
import { Sparkles, Trash2, ArrowRight, Plus, AlertCircle, Pencil, Loader2 } from 'lucide-react';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';

export default function UserTypes() {
  const {
    projectName,
    projectDescription,
    userTypes,
    addUserType,
    removeUserType,
    updateUserTypeDescription,
    nextStep,
  } = useWizardStore() as any;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const [isAdding, setIsAdding] = useState(false);
>>>>>>> Stashed changes
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');

  const titleName = projectName.trim() ? projectName : 'your project';

<<<<<<< Updated upstream
  const handleAdd = (e: React.FormEvent) => {
=======
  // ID user type yang AI-nya lagi diproses (dipakai buat nampilin spinner di
  // tombol Sparkles yang sedang jalan, tanpa ganggu tombol di baris lain).
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [aiError, setAiError] = useState('');

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleAddUserType = (e: React.FormEvent) => {
>>>>>>> Stashed changes
    e.preventDefault();
    if (!newTypeName.trim()) return;

    const newItem: UserTypeItem = {
      id: Date.now().toString(),
      name: newTypeName,
      description: newTypeDesc || 'No description provided.',
    };

    addUserType(newItem);
    setNewTypeName('');
    setNewTypeDesc('');
<<<<<<< Updated upstream
    setIsModalOpen(false);
=======
    setIsAdding(false);
    if (error) setError(false);
  };

  // Sebelumnya fungsi ini cuma mengisi string template statis. Sekarang beneran
  // memanggil endpoint AI (/api/projects/suggest-user-type-description).
  const handleAiGenerateDesc = async (user: UserTypeItem) => {
    setAiError('');
    const token = getAuthToken();
    if (!token) {
      setAiError('Sesi habis, silakan login kembali.');
      return;
    }

    setGeneratingId(user.id);
    try {
      const result = await projectApi.suggestUserTypeDescription(
        {
          project_name: titleName,
          user_type_name: user.name,
          project_description: projectDescription || '',
        },
        token
      );
      updateUserTypeDescription(user.id, result.description);
    } catch (err: any) {
      console.error('Gagal generate deskripsi user type dengan AI:', err);
      setAiError(err.message || 'AI gagal memberikan saran deskripsi. Silakan coba lagi.');
    } finally {
      setGeneratingId(null);
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
    if (!userTypes || userTypes.length === 0) {
      setError(true);
      return;
    }
    setError(false);
    nextStep();
>>>>>>> Stashed changes
  };

  return (
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
      <div className="bg-white/10 border border-white/20 rounded-2xl w-full mb-6 backdrop-blur-md shadow-xl overflow-hidden divide-y divide-white/10 text-left">
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

<<<<<<< Updated upstream
              {/* Aksi Ikon (AI & Delete) */}
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <button
                  type="button"
                  title="Generate or enhance with AI"
                  className="p-1.5 text-blue-200 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <Sparkles className="w-4 h-4 text-gray-300" />
                </button>
                <button
                  type="button"
                  onClick={() => removeUserType(user.id)}
                  title="Delete user type"
                  className="p-1.5 text-gray-300 hover:text-red-100 transition-colors rounded-lg hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
=======
                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAiGenerateDesc(user)}
                      disabled={generatingId === user.id}
                      title="Generate description with AI"
                      className="p-2 text-yellow-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-white/10 cursor-pointer shadow-sm bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {generatingId === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditing(user)}
                      title="Edit user type"
                      className="p-2 text-blue-200 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-white/10 cursor-pointer shadow-sm bg-white/5"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUserType(user.id)}
                      title="Delete user type"
                      className="p-2 text-red-300 hover:text-white transition-colors rounded-xl hover:bg-red-500/20 border border-red-500/20 cursor-pointer shadow-sm bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
>>>>>>> Stashed changes
            </div>
          ))
        )}
      </div>

<<<<<<< Updated upstream
      {/* Tombol Bawah (Next & Add User Type) */}
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

      {aiError && (
        <div className="w-full text-left mb-4 animate-fadeIn">
          <p className="text-red-300 text-xs flex items-center gap-1.5 bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            {aiError}
          </p>
        </div>
      )}

      {error && (
        <div className="w-full text-left mb-4 animate-fadeIn">
          <p className="text-red-300 text-xs flex items-center gap-1.5 bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ⚠️ Tambahkan minimal 1 user type sebelum melanjutkan ke tahap berikutnya.
          </p>
        </div>
      )}

>>>>>>> Stashed changes
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={nextStep}
          className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>

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
                  className="w-full bg-blue-500/60 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what this user does..."
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
                  className="w-full bg-blue-500/60 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-400 hover:bg-white/10 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
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

    </div>
  );
}