// features/project-setup/components/userTypes.tsx
'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, UserTypeItem } from '../store/wizard-store';
import { Sparkles, Trash2, ArrowRight, Plus, AlertCircle } from 'lucide-react';

export default function UserTypes() {
  const { projectName, userTypes, addUserType, removeUserType, updateUserTypeDescription, nextStep } = useWizardStore() as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [error, setError] = useState(false);

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    const newItem: UserTypeItem = {
      id: Date.now().toString(),
      name: newTypeName.trim(),
      description: newTypeDesc.trim() || 'No description provided.',
    };

    addUserType(newItem);
    setNewTypeName('');
    setNewTypeDesc('');
    setIsModalOpen(false);
    if (error) setError(false);
  };

  const handleAiGenerateDesc = (user: UserTypeItem) => {
    const aiGeneratedDescription = `A key stakeholder responsible for interacting with ${titleName}, managing core features, ensuring seamless operational workflow, and meeting system objectives.`;
    if (updateUserTypeDescription) {
      updateUserTypeDescription(user.id, aiGeneratedDescription);
    }
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
        Gunakan tombol <Sparkles className="w-3.5 h-3.5 inline text-yellow-300 mx-0.5" /> untuk memperbarui deskripsi dengan AI.
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
              <div className="flex flex-col max-w-[75%]">
                <span className="text-white font-bold text-sm sm:text-base mb-1.5">{user.name}</span>
                <p className="text-blue-200/90 text-xs sm:text-sm leading-relaxed">{user.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => handleAiGenerateDesc(user)}
                  title="Generate or enhance with AI"
                  className="p-2 text-yellow-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-white/10 cursor-pointer shadow-sm bg-white/5"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
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
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="w-full text-left mb-4 animate-fadeIn">
          <p className="text-red-300 text-xs flex items-center gap-1.5 bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            Tambahkan minimal 1 user type sebelum melanjutkan ke tahap berikutnya.
          </p>
        </div>
      )}

      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={handleNext}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2.5 shadow-xl text-sm cursor-pointer"
        >
          <span>Next</span> <ArrowRight className="w-4 h-4" />
        </button>

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
                  className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what this user does..."
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
                  className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 resize-none placeholder:text-blue-200/30"
                />
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
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
    </div>
  );
}