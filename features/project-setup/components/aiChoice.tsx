'use client';

import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { getAuthToken } from '@/lib/auth';

export default function AiChoice() {
  const {
    projectId,
    generateAIRequirements,
    nextStep,
    prevStep,
    setUseAi,
  } = useWizardStore() as any;

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateWithAi = async () => {
    setError('');

    if (!projectId) {
      setError('Project belum dibuat. Silakan kembali ke langkah sebelumnya.');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('Sesi habis, silakan login kembali.');
      return;
    }

    setUseAi(true);
    setIsGenerating(true);

    const success = await generateAIRequirements(projectId, token);

    setIsGenerating(false);

    if (success) {
      nextStep();
    } else {
      setError('AI gagal memproses data. Silakan coba lagi.');
    }
  };

  const handleManualInput = () => {
    setUseAi(false);
    nextStep();
  };

  return (
    <div className="flex flex-col items-start w-full max-w-xl mx-auto pt-12">
      <div className="mb-8">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        How do you want to build your requirements?
      </h1>

      <p className="text-blue-200 text-sm mb-6 leading-relaxed">
        Biarkan AI menganalisis deskripsi proyekmu dan menghasilkan draf epics, user stories, dan kebutuhan lainnya secara otomatis. Atau, kamu bisa menyusunnya sendiri secara manual.
      </p>

      {error && (
        <p className="text-red-300 text-xs mb-4 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      <div className="w-full flex flex-col gap-3 mb-6">
        <button
          type="button"
          onClick={handleGenerateWithAi}
          disabled={isGenerating}
          className="w-full bg-white hover:bg-blue-50 text-blue-700 px-6 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> AI sedang memproses...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate dengan AI
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleManualInput}
          disabled={isGenerating}
          className="w-full bg-transparent hover:bg-white/10 text-white border border-white/20 px-6 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Isi secara manual
        </button>
      </div>

      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={isGenerating}
          className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    </div>
  );
}