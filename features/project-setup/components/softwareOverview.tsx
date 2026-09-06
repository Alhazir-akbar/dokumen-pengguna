'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Check } from 'lucide-react';

export default function SoftwareOverview() {
  const { nextStep, prevStep } = useWizardStore();
  const [description, setDescription] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi: Jika kosong, jangan lanjutkan
    if (!description.trim()) return;

    // Simpan ke store jika diperlukan di masa mendatang
    nextStep();
  };

  return (
    <div className="flex flex-col items-center text-center w-full max-w-xl mx-auto pt-10">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-6">
        <LogoUserdoc />
      </div>

      {/* Judul & Deskripsi */}
      <div className="mb-6 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
          High level overview of your software
        </h2>
        <p className="text-blue-100 text-xs sm:text-sm">
          Briefly describe what this system does, how it works, and anything else important.
        </p>
      </div>

      {/* Form Input Textarea & Tombol */}
      <form onSubmit={handleNext} className="w-full flex flex-col items-center">
        <div className="w-full mb-6">
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Software description..."
            className="w-full bg-white/10 border border-blue-400/50 rounded-xl p-4 text-sm text-white placeholder-blue-300/60 focus:outline-none focus:border-white transition-all shadow-inner resize-none"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-4 w-full">
          <button
            type="submit"
            disabled={!description.trim()}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
              description.trim()
                ? 'bg-white text-blue-700 hover:bg-blue-50 cursor-pointer'
                : 'bg-white/40 text-white/50 cursor-not-allowed'
            }`}
          >
            Next <Check className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={prevStep}
            className="text-white/80 hover:text-white text-xs sm:text-sm font-medium transition-colors underline underline-offset-4 cursor-pointer"
          >
            Back
          </button>
        </div>
      </form>

    </div>
  );
}