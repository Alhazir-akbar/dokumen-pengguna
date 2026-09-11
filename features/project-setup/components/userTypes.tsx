// features/project-setup/components/UserTypes.tsx
'use client';

import { useState, useEffect } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, UserTypeItem } from '../store/wizard-store';
<<<<<<< HEAD
import { Sparkles, Trash2, ArrowRight, Plus, AlertCircle, Pencil, Loader2 } from 'lucide-react';
=======
import { Plus, Trash2, Pencil, Sparkles, AlertCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
>>>>>>> skip,-next,-back-button-on-project-setup
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
    prevStep,
  } = useWizardStore() as any;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [error, setError] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

<<<<<<< HEAD
  // ID user type yang AI-nya lagi diproses (dipakai buat nampilin spinner di
  // tombol Sparkles yang sedang jalan, tanpa ganggu tombol di baris lain).
=======
>>>>>>> skip,-next,-back-button-on-project-setup
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [aiError, setAiError] = useState('');

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleAddUserType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    addUserType({
      id: `ut-${Date.now()}`,
      name: newTypeName.trim(),
      description: newTypeDesc.trim() || 'No description provided.',
    });

    setNewTypeName('');
    setNewTypeDesc('');
    setIsAdding(false);
    if (error) setError(false);
  };

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
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-6 text-center pb-12">
      <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
        User types of <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-white">{titleName}</span>
      </h1>
      
      <p className="text-blue-100/80 text-xs sm:text-sm mb-8 max-w-lg leading-relaxed">
        Software is nothing without users. What are the different types of users who will interact with {titleName}?
      </p>

      <div className={`bg-white/10 border rounded-3xl w-full mb-4 backdrop-blur-xl shadow-2xl overflow-hidden divide-y divide-white/10 text-left transition-all ${
        error ? 'border-red-400 ring-4 ring-red-400/20 bg-red-950/10' : 'border-blue-400/30'
      }`}>
        {!userTypes || userTypes.length === 0 ? (
          <div className="p-10 text-center text-blue-200/70 text-sm">
            Belum ada tipe pengguna yang ditambahkan. Klik &quot;Add user type&quot; di bawah untuk mulai.
          </div>
        ) : (
          userTypes.map((user: UserTypeItem) => (
            <div key={user.id} className="p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors">
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
                    <span className="text-white font-bold text-sm sm:text-base mb-1.5">{user.name}</span>
                    <p className="text-blue-200/90 text-xs sm:text-sm leading-relaxed">{user.description}</p>
                  </div>

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
            </div>
          ))
        )}
      </div>

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

<<<<<<< HEAD
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={handleNext}
          className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg cursor-pointer text-sm"
        >
          <span>Next</span> <ArrowRight className="w-4 h-4" />
        </button>

        {!isAdding && (
=======
      {/* Navigasi Bawah */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={prevStep}
          className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3">
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <Plus className="w-4 h-4" /> Add user type
            </button>
          )}

>>>>>>> skip,-next,-back-button-on-project-setup
          <button
            type="button"
            onClick={handleNext}
            className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg cursor-pointer text-sm"
          >
            <span>Next</span> <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
