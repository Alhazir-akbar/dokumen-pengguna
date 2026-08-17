'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Check } from 'lucide-react';

export default function SoftwareDatabaseLogic() {
  const { nextStep, prevStep } = useWizardStore();
  
  // State pertanyaan utama
  const [hasDbLogic, setHasDbLogic] = useState<string | null>(null);

  // State pertanyaan lanjutan (jika db logic = yes)
  const [useMicroservice, setUseMicroservice] = useState<string | null>(null);
  const [otherComplexity, setOtherComplexity] = useState<string>('');

  // Aturan validasi tombol Next:
  // - Jika belum pilih db logic -> false
  // - Jika pilih db logic 'no' -> valid (cukup pilih no)
  // - Jika pilih db logic 'yes' -> harus pilih microservice (yes/no) DAN mengisi textarea other complexity
  const isFormValid = 
    hasDbLogic === 'no' ? true :
    hasDbLogic === 'yes' ? (useMicroservice !== null && otherComplexity.trim().length > 0) :
    false;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    nextStep();
  };

  return (
    <div className="flex flex-col items-center text-center w-full max-w-xl mx-auto pt-10 pb-16">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-6">
        <LogoUserdoc />
      </div>

      {/* Judul & Deskripsi */}
      <div className="mb-6 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
          A little more about your software
        </h2>
        <p className="text-blue-100 text-xs sm:text-sm">
          Does your software use database logic such as stored procedures or triggers?
        </p>
      </div>

      {/* Form & Opsi Utama */}
      <form onSubmit={handleNext} className="w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-8 mb-6">
          <label className="flex items-center gap-2.5 cursor-pointer text-white text-sm font-medium">
            <input
              type="radio"
              name="hasDbLogic"
              value="yes"
              checked={hasDbLogic === 'yes'}
              onChange={() => setHasDbLogic('yes')}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-blue-400/50 bg-white/10 cursor-pointer"
            />
            Yes
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-white text-sm font-medium">
            <input
              type="radio"
              name="hasDbLogic"
              value="no"
              checked={hasDbLogic === 'no'}
              onChange={() => {
                setHasDbLogic('no');
                // Reset sub-state jika user memilih No
                setUseMicroservice(null);
                setOtherComplexity('');
              }}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-blue-400/50 bg-white/10 cursor-pointer"
            />
            No
          </label>
        </div>

        {/* --- KONDISI DINAMIS: Jika user memilih 'yes' --- */}
        {hasDbLogic === 'yes' && (
          <div className="w-full flex flex-col gap-6 mb-8 text-left transition-all animate-fadeIn">
            
            {/* Pertanyaan Lanjutan 1: Microservice */}
            <div>
              <label className="block text-xs font-medium text-blue-100 mb-2">
                Does your software use a microservice architecture?
              </label>
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-2.5 cursor-pointer text-white text-sm font-medium">
                  <input
                    type="radio"
                    name="useMicroservice"
                    value="yes"
                    checked={useMicroservice === 'yes'}
                    onChange={() => setUseMicroservice('yes')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-blue-400/50 bg-white/10 cursor-pointer"
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-white text-sm font-medium">
                  <input
                    type="radio"
                    name="useMicroservice"
                    value="no"
                    checked={useMicroservice === 'no'}
                    onChange={() => setUseMicroservice('no')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-blue-400/50 bg-white/10 cursor-pointer"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Pertanyaan Lanjutan 2: Other complexity */}
            <div>
              <label className="block text-xs font-medium text-blue-100 mb-2">
                Is there any other complexity you think our AI needs to know about your software?
              </label>
              <textarea
                rows={4}
                value={otherComplexity}
                onChange={(e) => setOtherComplexity(e.target.value)}
                placeholder="Any other relevant complexity..."
                className="w-full bg-white/10 border border-blue-400/50 rounded-xl p-4 text-sm text-white placeholder-blue-300/60 focus:outline-none focus:border-white transition-all shadow-inner resize-none"
              />
            </div>

          </div>
        )}

        {/* Tombol Navigasi */}
        <div className="flex items-center gap-4 w-full">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
              isFormValid
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