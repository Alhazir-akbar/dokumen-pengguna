// features/project-setup/components/userTypeGoals.tsx
'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function UserTypeGoals() {
<<<<<<< HEAD
  const { projectName, userTypes, userGoals, updateUserGoal, nextStep } = useWizardStore() as any;
=======
  const { projectName, userTypes, userGoals, updateUserGoal, nextStep } = useWizardStore();
>>>>>>> origin/dev
  const [error, setError] = useState(false);

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleInputChange = (userTypeName: string, field: 'goals' | 'frustrations', value: string) => {
    const current = userGoals.find((g: any) => g.userTypeName === userTypeName) || { goals: '', frustrations: '' };
    const updatedGoals = field === 'goals' ? value : current.goals;
    const updatedFrustrations = field === 'frustrations' ? value : current.frustrations;
    
    updateUserGoal(userTypeName, updatedGoals, updatedFrustrations);
    if (error) setError(false);
  };

<<<<<<< HEAD
=======
  // Fungsi untuk mengisi otomatis AI Suggestion dengan konteks yang lebih dinamis
>>>>>>> origin/dev
  const handleAiSuggest = (userTypeName: string) => {
    const isAdmin = userTypeName.toLowerCase().includes('admin') || userTypeName.toLowerCase().includes('manager');
    
    const sampleGoals = isAdmin
      ? `To efficiently manage system operations, oversee activities, and ensure ${titleName} runs smoothly without downtime.`
      : `To easily navigate ${titleName}, accomplish daily tasks quickly, and achieve desired outcomes with minimal friction.`;
      
    const sampleFrustrations = isAdmin
      ? `Dealing with complicated settings, lack of bulk-action tools, and insufficient analytics or reporting features.`
      : `Experiencing confusing interfaces, slow load times, and lack of clear guidance or help when encountering errors.`;

    updateUserGoal(userTypeName, sampleGoals, sampleFrustrations);
    if (error) setError(false);
  };

  const handleNext = () => {
<<<<<<< HEAD
    for (const ut of userTypes) {
      const goalData = userGoals.find((g: any) => g.userTypeName === ut.name);
      if (
        !goalData || 
        !goalData.goals || 
        goalData.goals.trim().length < 10 || 
        !goalData.frustrations || 
=======
    // RULES / Validasi: Pastikan data ada dan panjang karakter minimal 10
    for (const ut of userTypes) {
      const goalData = userGoals.find((g) => g.userTypeName === ut.name);
      if (
        !goalData || 
        goalData.goals.trim().length < 10 || 
>>>>>>> origin/dev
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
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto pt-6 text-center pb-12">
      <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
        User type goals and frustrations
      </h1>
      
      <p className="text-blue-100/80 text-xs sm:text-sm mb-8 max-w-xl leading-relaxed">
        We want to understand what motivates users of {titleName} - so we can craft realistic user personas. 
        Gunakan tombol <Sparkles className="w-3.5 h-3.5 inline text-yellow-300 mx-0.5" /> untuk saran instan dari AI.
      </p>

<<<<<<< HEAD
      <div className="w-full flex flex-col gap-6 mb-6 text-left">
        {userTypes.map((ut: any) => {
          const goalData = userGoals.find((g: any) => g.userTypeName === ut.name) || { goals: '', frustrations: '' };
          const isCardError = error && (!goalData.goals || goalData.goals.trim().length < 10 || !goalData.frustrations || goalData.frustrations.trim().length < 10);
=======
      {/* List Card per User Type */}
      <div className="w-full flex flex-col gap-6 mb-6 text-left">
        {userTypes.map((ut) => {
          const goalData = userGoals.find((g) => g.userTypeName === ut.name) || { goals: '', frustrations: '' };
          
          // Cek apakah card ini tidak memenuhi rule (jika state error aktif)
          const isCardError = error && (goalData.goals.trim().length < 10 || goalData.frustrations.trim().length < 10);
>>>>>>> origin/dev

          return (
            <div 
              key={ut.id} 
<<<<<<< HEAD
              className={`bg-white/10 border rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl relative transition-all ${
                isCardError ? 'border-red-400 ring-4 ring-red-400/20 bg-red-950/10' : 'border-blue-400/30'
=======
              className={`bg-white/10 border rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl relative transition-all ${
                isCardError ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/20'
>>>>>>> origin/dev
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm sm:text-base">
                  {ut.name}
                </h3>
                <button
                  type="button"
                  onClick={() => handleAiSuggest(ut.name)}
                  title="Generate or enhance with AI"
<<<<<<< HEAD
                  className="text-yellow-300 hover:text-white bg-white/10 hover:bg-blue-600/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold border border-white/15 cursor-pointer shadow-sm"
=======
                  className="text-yellow-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium border border-white/10 cursor-pointer shadow-sm"
>>>>>>> origin/dev
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Suggest
                </button>
              </div>

<<<<<<< HEAD
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">
=======
              {/* Input Fields menggunakan TEXTAREA */}
              <div className="flex flex-col gap-4">
                
                {/* Field Goals */}
                <div className="relative">
                  <label className="block text-[11px] font-medium text-blue-300/80 mb-1.5 uppercase tracking-wider ml-1">
>>>>>>> origin/dev
                    Goals
                  </label>
                  <textarea
                    placeholder={`What are the goals of a ${ut.name}?`}
                    value={goalData.goals}
                    onChange={(e) => handleInputChange(ut.name, 'goals', e.target.value)}
                    maxLength={300}
                    rows={2}
<<<<<<< HEAD
                    className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30 resize-none transition-colors"
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] text-blue-200/50 pointer-events-none bg-blue-950/80 px-1.5 py-0.5 rounded">
=======
                    className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30 resize-none transition-colors"
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] text-blue-300/50 pointer-events-none bg-blue-950/80 px-1 rounded">
>>>>>>> origin/dev
                    {goalData.goals.length}/300
                  </div>
                </div>

                {/* Field Frustrations */}
                <div className="relative">
<<<<<<< HEAD
                  <label className="block text-[11px] font-semibold text-blue-200 uppercase tracking-wider mb-1.5 ml-1">
=======
                  <label className="block text-[11px] font-medium text-blue-300/80 mb-1.5 uppercase tracking-wider ml-1">
>>>>>>> origin/dev
                    Frustrations
                  </label>
                  <textarea
                    placeholder={`What are the frustrations of a ${ut.name}?`}
                    value={goalData.frustrations}
                    onChange={(e) => handleInputChange(ut.name, 'frustrations', e.target.value)}
                    maxLength={300}
                    rows={2}
<<<<<<< HEAD
                    className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30 resize-none transition-colors"
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] text-blue-200/50 pointer-events-none bg-blue-950/80 px-1.5 py-0.5 rounded">
=======
                    className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30 resize-none transition-colors"
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] text-blue-300/50 pointer-events-none bg-blue-950/80 px-1 rounded">
>>>>>>> origin/dev
                    {goalData.frustrations.length}/300
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

<<<<<<< HEAD
      {error && (
        <div className="w-full text-left mb-6">
          <p className="text-red-300 text-xs sm:text-sm flex items-center gap-2 bg-red-950/40 border border-red-500/30 px-4 py-3 rounded-2xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span><strong>Rules:</strong> Setiap kolom <em>goals</em> dan <em>frustrations</em> wajib diisi minimal <strong>10 karakter</strong>.</span>
=======
      {/* Pesan Peringatan Jika Ada yang Kosong/Kurang */}
      {error && (
        <div className="w-full text-left mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">
            <strong>Rules:</strong> Setiap kolom <em>goals</em> dan <em>frustrations</em> wajib diisi dan harus memiliki <strong>minimal 10 karakter</strong>.
>>>>>>> origin/dev
          </p>
        </div>
      )}

<<<<<<< HEAD
=======
      {/* Tombol Navigasi Next */}
>>>>>>> origin/dev
      <div className="w-full flex items-center justify-start">
        <button
          type="button"
          onClick={handleNext}
<<<<<<< HEAD
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2.5 shadow-xl text-sm cursor-pointer"
=======
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
>>>>>>> origin/dev
        >
          <span>Next</span> <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}