'use client';

import { useRouter } from 'next/navigation';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Check, X, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AiChoice() {
  const router = useRouter();
  const { useAi, setUseAi, nextStep, prevStep } = useWizardStore();

  const handleSelect = (choice: boolean) => {
    setUseAi(choice);
    if (choice === false) {
      // Jika memilih "No", langsung arahkan ke halaman stories (/stories)
      router.push('/stories');
    } else {
      // Jika memilih "Yes", lanjut ke langkah wizard berikutnya
      nextStep();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-12 text-center">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-6">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
        Kick-start your requirements using AI?
      </h1>

      {/* Grid Pilihan (Yes / No) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
        
        {/* Pilihan 1: Yes, use AI */}
        <div
          onClick={() => handleSelect(true)}
          className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col items-center text-center ${
            useAi === true
              ? 'bg-blue-700/80 border-white shadow-lg ring-2 ring-white/50'
              : 'bg-white/10 border-blue-400/30 hover:bg-blue-600/50 hover:border-blue-400/60'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white mb-4">
            <Check className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Yes, use Userdoc AI</h3>
          <p className="text-blue-200 text-xs leading-relaxed">
            Answer a few more questions and have Userdoc scaffold detailed project requirements.
          </p>
        </div>

        {/* Pilihan 2: No, manual */}
        <div
          onClick={() => handleSelect(false)}
          className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col items-center text-center ${
            useAi === false
              ? 'bg-blue-700/80 border-white shadow-lg ring-2 ring-white/50'
              : 'bg-white/10 border-blue-400/30 hover:bg-blue-600/50 hover:border-blue-400/60'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white mb-4">
            <X className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No, not at this stage</h3>
          <p className="text-blue-200 text-xs leading-relaxed">
            Enter your requirements manually, but don’t worry you can always leverage our AI later on.
          </p>
        </div>
      </div>

      {/* Tombol Navigasi (Back & Next) */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-white/10 hover:bg-blue-500 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          type="button"
          onClick={() => {
            if (useAi === false) {
              router.push('/stories');
            } else {
              nextStep();
            }
          }}
        >
        </button>
      </div>
    </div>
  );
}