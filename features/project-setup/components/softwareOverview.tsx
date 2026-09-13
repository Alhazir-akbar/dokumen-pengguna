'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

export default function SoftwareOverview() {
  const { softwareOverview, setSoftwareOverview, nextStep, prevStep } = useWizardStore();
  const [localDesc, setLocalDesc] = useState(softwareOverview || '');
  const [error, setError] = useState(false);

  const handleNext = () => {
    if (!localDesc.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setSoftwareOverview(localDesc.trim());
    nextStep();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDesc(e.target.value);
    if (error) setError(false);
  };

  return (
    <div className="flex flex-col items-start w-full max-w-xl mx-auto pt-12">
      <div className="mb-8">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        High level overview of your software
      </h1>

      <p className="text-blue-200 text-sm mb-6 leading-relaxed">
        Briefly describe what this system does, how it works, and anything else important.
      </p>

      <div className="relative w-full mb-2">
        <textarea
          rows={5}
          value={localDesc}
          onChange={handleChange}
          placeholder="Software description..."
          autoFocus
          className={`w-full bg-white/10 border rounded-xl px-4 py-3.5 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 transition-all shadow-inner resize-y ${
            error ? 'border-red-400 focus:ring-red-400' : 'border-blue-100/40 focus:ring-white/50'
          }`}
        />
      </div>

      {error && (
        <p className="text-red-300 text-xs mb-4 animate-shake flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          Deskripsi software wajib diisi sebelum melanjutkan.
        </p>
      )}

      {!error && <div className="mb-4"></div>}

      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}