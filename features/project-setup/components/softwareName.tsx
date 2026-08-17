'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Check } from 'lucide-react';

export default function SoftwareName() {
  // Asumsikan di wizard store Anda sudah ada state untuk menyimpan nama software (misal: softwareName & setSoftwareName)
  // Jika belum ada, Anda bisa menambahkannya ke wizard-store.ts nanti.
  const { nextStep, prevStep } = useWizardStore();
  const [softwareName, setSoftwareName] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi: Jika kosong, jangan lakukan apa-apa
    if (!softwareName.trim()) return;

    // Simpan ke store jika diperlukan (opsional, sesuaikan dengan store Anda)
    // setSoftwareName(softwareName); 

    nextStep();
  };

  return (
    <div className="flex flex-col items-center text-center w-full max-w-xl mx-auto pt-10">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-6">
        <LogoUserdoc />
      </div>

      {/* Judul & Deskripsi */}
      <div className="mb-8 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
          What is the name of your software?
        </h2>
        <p className="text-blue-100 text-xs sm:text-sm">
          This is the name of your system you want to reverse engineer documentation for.
        </p>
      </div>

      {/* Form Input & Tombol */}
      <form onSubmit={handleNext} className="w-full flex flex-col items-center">
        <div className="w-full mb-6">
          <input
            type="text"
            value={softwareName}
            onChange={(e) => setSoftwareName(e.target.value)}
            placeholder="Type your software name here..."
            className="w-full bg-white/10 border border-blue-400/50 rounded-xl px-4 py-3 text-sm text-white placeholder-blue-300/60 focus:outline-none focus:border-white transition-all shadow-inner"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-4 w-full">
          <button
            type="submit"
            disabled={!softwareName.trim()}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
              softwareName.trim()
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