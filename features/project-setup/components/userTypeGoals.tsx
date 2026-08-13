'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function UserTypeGoals() {
  const { projectName, userTypes, userGoals, updateUserGoal, nextStep } = useWizardStore();
  const [error, setError] = useState(false);

  const titleName = projectName.trim() ? projectName : 'your project';

  const handleInputChange = (userTypeName: string, field: 'goals' | 'frustrations', value: string) => {
    const current = userGoals.find((g) => g.userTypeName === userTypeName) || { goals: '', frustrations: '' };
    const updatedGoals = field === 'goals' ? value : current.goals;
    const updatedFrustrations = field === 'frustrations' ? value : current.frustrations;
    updateUserGoal(userTypeName, updatedGoals, updatedFrustrations);
    if (error) setError(false);
  };

  // Fungsi untuk mengisi otomatis contoh AI Suggest berdasarkan tipe user
  const handleAiSuggest = (userTypeName: string) => {
    const sampleGoals = `Achieve maximum productivity and efficiency while using ${titleName} seamlessly.`;
    const sampleFrustrations = `Dealing with complex navigation, slow response times, and lack of clear guidance.`;
    updateUserGoal(userTypeName, sampleGoals, sampleFrustrations);
    if (error) setError(false);
  };

  const handleNext = () => {
    // Validasi: Pastikan setiap userType memiliki goals dan frustrations yang terisi
    for (const ut of userTypes) {
      const goalData = userGoals.find((g) => g.userTypeName === ut.name);
      if (!goalData || !goalData.goals.trim() || !goalData.frustrations.trim()) {
        setError(true);
        return;
      }
    }
    setError(false);
    nextStep();
  };

  return (
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
      <div className="w-full flex flex-col gap-6 mb-4 text-left">
        {userTypes.map((ut) => {
          const goalData = userGoals.find((g) => g.userTypeName === ut.name) || { goals: '', frustrations: '' };
          const isCardError = error && (!goalData.goals.trim() || !goalData.frustrations.trim());

          return (
            <div 
              key={ut.id} 
              className={`bg-white/15 border rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl relative transition-all ${
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
                  title="AI Suggestions"
                  className="text-yellow-300 hover:text-yellow-200 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium border border-white/20 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Suggest
                </button>
              </div>

              {/* Input Fields */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`What are the goals of a ${ut.name}?`}
                    value={goalData.goals}
                    onChange={(e) => handleInputChange(ut.name, 'goals', e.target.value)}
                    maxLength={300}
                    className="w-full bg-blue-950/50 border border-blue-400/30 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/50"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder={`What are the frustrations of a ${ut.name}?`}
                    value={goalData.frustrations}
                    onChange={(e) => handleInputChange(ut.name, 'frustrations', e.target.value)}
                    maxLength={300}
                    className="w-full bg-blue-950/50 border border-blue-400/30 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/50"
                  />
                  <div className="absolute right-3 bottom-2 text-[10px] text-blue-300/60 pointer-events-none">
                    {goalData.frustrations.length}/312
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pesan Peringatan Jika Ada yang Kosong */}
      {error && (
        <div className="w-full text-left mb-4">
          <p className="text-red-300 text-xs">
            ⚠️ Semua kolom goals dan frustrations untuk setiap tipe user wajib diisi sebelum melanjutkan.
          </p>
        </div>
      )}

      {!error && <div className="mb-4"></div>}

      {/* Tombol Navigasi Next */}
      <div className="w-full flex items-center justify-start">
        <button
          type="button"
          onClick={handleNext}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}