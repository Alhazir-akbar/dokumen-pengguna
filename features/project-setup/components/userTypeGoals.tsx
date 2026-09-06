'use client';

import { useState, useEffect } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { ArrowRight, Sparkles, AlertCircle, Loader2, Plus, X, Pencil } from 'lucide-react';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';

export default function UserTypeGoals() {
<<<<<<< Updated upstream
  const { projectName, userTypes, userGoals, updateUserGoal, nextStep } = useWizardStore();
  const [error, setError] = useState(false);

  const titleName = projectName.trim() ? projectName : 'your project';

  const handleInputChange = (userTypeName: string, field: 'goals' | 'frustrations', value: string) => {
    const current = userGoals.find((g) => g.userTypeName === userTypeName) || { goals: '', frustrations: '' };
=======
  const { projectName, userTypes, userGoals, updateUserGoal, nextStep, addUserType, removeUserType, updateUserTypeDescription } = useWizardStore() as any;
  const [error, setError] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [isAiDraftingUt, setIsAiDraftingUt] = useState(false);

  const [editingUtId, setEditingUtId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [loadingUserType, setLoadingUserType] = useState<string | null>(null);
  const [aiError, setAiError] = useState<{ userTypeName: string; message: string } | null>(null);

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleInputChange = (userTypeName: string, field: 'goals' | 'frustrations', value: string) => {
    if (value.length > 800) return;

    const current = userGoals.find((g: any) => g.userTypeName === userTypeName) || { goals: '', frustrations: '' };
>>>>>>> Stashed changes
    const updatedGoals = field === 'goals' ? value : current.goals;
    const updatedFrustrations = field === 'frustrations' ? value : current.frustrations;

    updateUserGoal(userTypeName, updatedGoals, updatedFrustrations);
    if (error) setError(false);
  };

<<<<<<< Updated upstream
  // Fungsi untuk mengisi otomatis AI Suggestion dengan konteks yang lebih dinamis
  const handleAiSuggest = (userTypeName: string) => {
    const isAdmin = userTypeName.toLowerCase().includes('admin') || userTypeName.toLowerCase().includes('manager');
    
    const sampleGoals = isAdmin
      ? `To efficiently manage system operations, oversee activities, and ensure ${titleName} runs smoothly without downtime.`
      : `To easily navigate ${titleName}, accomplish daily tasks quickly, and achieve desired outcomes with minimal friction.`;
      
    const sampleFrustrations = isAdmin
      ? `Dealing with complicated settings, lack of bulk-action tools, and insufficient analytics or reporting features.`
      : `Experiencing confusing interfaces, slow load times, and lack of clear guidance or help when encountering errors.`;
=======
  const handleAddUserTypeInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
>>>>>>> Stashed changes

    const newId = `ut-${Date.now()}`;
    addUserType({
      id: newId,
      name: newTypeName.trim(),
      description: newTypeDesc.trim() || 'No description provided.',
    });

    setNewTypeName('');
    setNewTypeDesc('');
    setIsAdding(false);
  };

  const startEditingUt = (ut: any) => {
    setEditingUtId(ut.id);
    setEditName(ut.name);
    setEditDesc(ut.description || '');
  };

  const saveEditUt = (utId: string) => {
    if (!editName.trim()) return;
    if (typeof updateUserTypeDescription === 'function') {
      updateUserTypeDescription(utId, editDesc.trim());
    }
    setEditingUtId(null);
  };

  const handleAiDraftUserType = async () => {
    setIsAiDraftingUt(true);
    try {
      const token = getAuthToken();
      const response = await projectApi.suggestDescription({
        project_name: titleName,
        platform_type: 'Target Audience User Type',
      }, token || '');

      if (response && response.description) {
        setNewTypeName('Power User / Administrator');
        setNewTypeDesc(response.description);
      } else {
        setNewTypeName('Standard User');
        setNewTypeDesc(`A typical end-user interacting with ${titleName} daily.`);
      }
    } catch (err) {
      console.error('AI Draft Error:', err);
      setNewTypeName('Stakeholder');
      setNewTypeDesc(`Key participant engaging with system capabilities.`);
    } finally {
      setIsAiDraftingUt(false);
    }
  };

  const handleAiSuggest = async (userType: any) => {
    setAiError(null);
    const token = getAuthToken();
    if (!token) {
      setAiError({ userTypeName: userType.name, message: 'Sesi habis, silakan login kembali.' });
      return;
    }

    setLoadingUserType(userType.name);
    try {
      const result = await projectApi.suggestUserGoals(
        {
          project_name: titleName,
          user_type_name: userType.name,
          user_type_description: userType.description || '',
        },
        token
      );

      updateUserGoal(userType.name, result.goals, result.frustrations);
      if (error) setError(false);
    } catch (err: any) {
      console.error('Gagal mendapatkan saran AI:', err);
      setAiError({
        userTypeName: userType.name,
        message: err.message || 'AI gagal memberikan saran. Silakan coba lagi.',
      });
    } finally {
      setLoadingUserType(null);
    }
  };

  const handleNext = () => {
    // RULES / Validasi: Pastikan data ada dan panjang karakter minimal 10
    for (const ut of userTypes) {
      const goalData = userGoals.find((g) => g.userTypeName === ut.name);
      if (
<<<<<<< Updated upstream
        !goalData || 
        goalData.goals.trim().length < 10 || 
=======
        !goalData ||
        !goalData.goals ||
        goalData.goals.trim().length < 10 ||
        !goalData.frustrations ||
>>>>>>> Stashed changes
        goalData.frustrations.trim().length < 10
      ) {
        setError(true);
        return;
      }
    }
    setError(false);
    nextStep();
  };

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto pt-6 text-center pb-12">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        User type goals and frustrations
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-8 max-w-xl">
        We want to understand what motivates users of {titleName} - so we can craft the most realistic user personas. And as always, use ✨ to get some AI suggestions.
      </p>

      {/* List Card per User Type */}
      <div className="w-full flex flex-col gap-6 mb-6 text-left">
        {userTypes.map((ut) => {
          const goalData = userGoals.find((g) => g.userTypeName === ut.name) || { goals: '', frustrations: '' };
          
          // Cek apakah card ini tidak memenuhi rule (jika state error aktif)
          const isCardError = error && (goalData.goals.trim().length < 10 || goalData.frustrations.trim().length < 10);

          return (
            <div 
              key={ut.id} 
              className={`bg-white/10 border rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl relative transition-all ${
                isCardError ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/20'
              }`}
            >
              {/* Header Nama Tipe User & Tombol AI */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm sm:text-base">
                  {ut.name}
                </h3>
                <button
                  type="button"
                  onClick={() => handleAiSuggest(ut.name)}
                  title="Generate or enhance with AI"
                  className="text-yellow-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium border border-white/10 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Suggest
                </button>
              </div>

              {/* Input Fields menggunakan TEXTAREA */}
              <div className="flex flex-col gap-4">
                
                {/* Field Goals */}
                <div className="relative">
                  <label className="block text-[11px] font-medium text-blue-300/80 mb-1.5 uppercase tracking-wider ml-1">
                    Goals
                  </label>
=======
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-10 px-4 pb-16">
      {/* Scrollbar Transparan Total (Support Webkit & Firefox) */}
      <style jsx global>{`
        textarea {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
        textarea::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <div className="w-full flex flex-col items-center mb-8 header-fade">
        <LogoUserdoc />
      </div>

      <div className="header-fade w-full text-center" style={{ animationDelay: '80ms' }}>
        <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3 text-xs text-blue-200 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          {userTypes.length} user types terdefinisi untuk analisis goals
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          User Type Goals and Frustrations
        </h1>

        <p className="text-blue-200 text-sm mb-8 leading-relaxed max-w-2xl mx-auto">
          We want to understand what motivates users of {titleName}. So, we can craft realistic personas. 
        </p>
      </div>

      <div className="w-full flex flex-col gap-6 mb-8">
        {userTypes.map((ut: any, index: number) => {
          const goalData = userGoals.find((g: any) => g.userTypeName === ut.name) || { goals: '', frustrations: '' };
          const isCardError = error && (!goalData.goals || goalData.goals.trim().length < 10 || !goalData.frustrations || goalData.frustrations.trim().length < 10);
          const isThisLoading = loadingUserType === ut.name;
          const hasAiError = aiError?.userTypeName === ut.name;
          const isEditing = editingUtId === ut.id;

          return (
            <div
              key={ut.id}
              className={`group relative bg-white/10 border rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl transition-all duration-300 flex flex-col ${
                isCardError ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/20 hover:border-blue-300/50'
              } ${mounted ? 'card-enter' : 'opacity-0'}`}
              style={{ animationDelay: mounted ? `${Math.min(index, 8) * 60}ms` : undefined }}
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full pr-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/10 border border-blue-300/40 rounded-xl px-3 py-1.5 text-white text-xs font-semibold focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveEditUt(ut.id)}
                      className="bg-white text-blue-700 text-xs px-3 py-1.5 rounded-xl font-medium cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUtId(null)}
                      className="text-blue-200 hover:text-white text-xs px-2.5 py-1.5 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-blue-300/70">UT-{index + 1}</span>
                    <h3 className="text-white font-bold text-base">{ut.name}</h3>
                    <button
                      type="button"
                      onClick={() => startEditingUt(ut)}
                      className="text-blue-300/60 hover:text-white p-1 transition-colors cursor-pointer"
                      title="Edit name"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAiSuggest(ut)}
                    disabled={isThisLoading}
                    title="Generate with AI"
                    className="text-yellow-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium border border-white/10 cursor-pointer shadow-sm disabled:opacity-60"
                  >
                    {isThisLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin text-yellow-300" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeUserType(ut.id)}
                    title="Remove user type"
                    className="text-blue-200 hover:text-red-300 p-1.5 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-blue-200/80 text-xs mb-4 leading-relaxed">{ut.description}</p>

              {hasAiError && (
                <p className="text-red-300 text-xs mb-3 flex items-center gap-1.5 bg-red-950/40 p-2.5 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {aiError?.message}
                </p>
              )}

              {/* Area Input goals & frustrations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">
                      Goals (Min 10 chars)
                    </label>
                    <span className={`text-[10px] ${goalData.goals.length < 10 ? 'text-amber-300' : 'text-blue-300/70'}`}>
                      {goalData.goals.length}/800
                    </span>
                  </div>
>>>>>>> Stashed changes
                  <textarea
                    placeholder={`What are the goals of a ${ut.name}?`}
                    value={goalData.goals}
                    onChange={(e) => handleInputChange(ut.name, 'goals', e.target.value)}
<<<<<<< Updated upstream
                    maxLength={300}
                    rows={2}
                    className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30 resize-none transition-colors"
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] text-blue-300/50 pointer-events-none bg-blue-950/80 px-1 rounded">
                    {goalData.goals.length}/300
                  </div>
                </div>

                {/* Field Frustrations */}
                <div className="relative">
                  <label className="block text-[11px] font-medium text-blue-300/80 mb-1.5 uppercase tracking-wider ml-1">
                    Frustrations
                  </label>
=======
                    maxLength={800}
                    rows={3}
                    disabled={isThisLoading}
                    className="w-full bg-white/10 border border-blue-300/40 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-blue-300/40 resize-y transition-colors disabled:opacity-60 shadow-inner"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">
                      Frustrations (Min 10 chars)
                    </label>
                    <span className={`text-[10px] ${goalData.frustrations.length < 10 ? 'text-amber-300' : 'text-blue-300/70'}`}>
                      {goalData.frustrations.length}/800
                    </span>
                  </div>
>>>>>>> Stashed changes
                  <textarea
                    placeholder={`What are the frustrations of a ${ut.name}?`}
                    value={goalData.frustrations}
                    onChange={(e) => handleInputChange(ut.name, 'frustrations', e.target.value)}
<<<<<<< Updated upstream
                    maxLength={300}
                    rows={2}
                    className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30 resize-none transition-colors"
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] text-blue-300/50 pointer-events-none bg-blue-950/80 px-1 rounded">
                    {goalData.frustrations.length}/300
                  </div>
=======
                    maxLength={800}
                    rows={3}
                    disabled={isThisLoading}
                    className="w-full bg-white/10 border border-blue-300/40 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-blue-300/40 resize-y transition-colors disabled:opacity-60 shadow-inner"
                  />
>>>>>>> Stashed changes
                </div>

              </div>
            </div>
          );
        })}

        {/* Form Inline Add User Type */}
        {isAdding && (
          <form onSubmit={handleAddUserTypeInline} className="card-enter bg-white/10 border border-blue-300/40 rounded-3xl p-5 backdrop-blur-md shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Add New User Type</span>
              <button
                type="button"
                onClick={handleAiDraftUserType}
                disabled={isAiDraftingUt}
                className="text-yellow-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all px-2.5 py-1 rounded-xl bg-white/10 hover:bg-blue-600/40 border border-white/15 cursor-pointer disabled:opacity-50"
              >
                {isAiDraftingUt ? (
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                )}
                <span>AI Draft</span>
              </button>
            </div>

            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="User type name (cth: Customer, Moderator)..."
              autoFocus
              className="w-full bg-white/10 border border-blue-300/40 rounded-2xl px-4 py-2.5 text-white text-sm font-semibold placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <textarea
              value={newTypeDesc}
              onChange={(e) => setNewTypeDesc(e.target.value)}
              placeholder="Deskripsi singkat peran pengguna ini..."
              rows={2}
              maxLength={800}
              className="w-full bg-white/10 border border-blue-300/40 rounded-2xl px-4 py-2.5 text-blue-100 text-xs placeholder-blue-300/60 resize-y focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
            />
            <div className="flex items-center gap-2 justify-end mt-1">
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
                className="bg-white text-blue-700 text-xs px-4 py-1.5 rounded-lg font-medium hover:bg-blue-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Pesan Peringatan Jika Ada yang Kosong/Kurang */}
      {error && (
<<<<<<< Updated upstream
        <div className="w-full text-left mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
=======
        <div className="w-full text-left mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-fadeIn">
>>>>>>> Stashed changes
          <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">
            <strong>Rules:</strong> Setiap kolom <em>goals</em> dan <em>frustrations</em> wajib diisi dan harus memiliki <strong>minimal 10 karakter</strong>.
          </p>
        </div>
      )}

<<<<<<< Updated upstream
      {/* Tombol Navigasi Next */}
      <div className="w-full flex items-center justify-start">
        <button
          type="button"
          onClick={handleNext}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
=======
      {/* Navigasi Bawah */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={handleNext}
          className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg cursor-pointer text-sm"
>>>>>>> Stashed changes
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>

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

    </div>
  );
}