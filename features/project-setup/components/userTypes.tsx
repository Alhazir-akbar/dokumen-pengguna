'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, UserTypeItem } from '../store/wizard-store';
import { Sparkles, Trash2, ArrowRight, Plus } from 'lucide-react';

export default function UserTypes() {
  const { projectName, userTypes, addUserType, removeUserType, updateUserTypeDescription, nextStep } = useWizardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [error, setError] = useState(false);

  const titleName = projectName.trim() ? projectName : 'your project';

  const handleAdd = (e: React.FormEvent) => {
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
    setIsModalOpen(false);
    if (error) setError(false);
  };

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
    nextStep();
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

      {!error && <div className="mb-4"></div>}

      {/* Tombol Bawah (Next & Add User Type) */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={handleNext}
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

    </div>
  );
}