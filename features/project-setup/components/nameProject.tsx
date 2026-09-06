'use client';

import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
<<<<<<< HEAD
import { Sparkles, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
=======
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
>>>>>>> origin/dev
import { useState } from 'react';

export default function NameProject() {
  const { projectName, updateProjectName, nextStep, prevStep } = useWizardStore();
  const [error, setError] = useState(false);

  const handleNext = () => {
<<<<<<< HEAD
=======
    // Validasi: jika kosong atau hanya berisi spasi, batalkan dan tampilkan error
>>>>>>> origin/dev
    if (!projectName || projectName.trim() === "") {
      setError(true);
      return;
    }
    setError(false);
    nextStep();
  };
<<<<<<< HEAD

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProjectName(e.target.value);
    if (error) setError(false);
  };
=======
>>>>>>> origin/dev

  return (
    <div className="flex flex-col items-start w-full max-w-xl mx-auto pt-12">
      <div className="mb-8">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        What is the name of your project?
      </h1>

      <p className="text-blue-200 text-sm mb-6 leading-relaxed">
        This is the name of your software, app, or system you want to create requirements for.{' '}
        <span className="mt-1 text-blue-300 flex items-center gap-1.5">
          (click the <Sparkles className="w-3.5 h-3.5 inline-block" /> button on the right for some inspiration)
        </span>
      </p>

<<<<<<< HEAD
=======
      {/* Kotak Input dengan Ikon AI di dalamnya */}
>>>>>>> origin/dev
      <div className="relative w-full mb-2">
        <input
          type="text"
          value={projectName}
<<<<<<< HEAD
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your project name here..."
          autoFocus
=======
          onChange={(e) => {
            updateProjectName(e.target.value);
            if (error) setError(false); // Hilangkan pesan error saat user mengetik
          }}
          placeholder="Type your project name here..."
>>>>>>> origin/dev
          className={`w-full bg-white/10 border rounded-xl px-4 py-3.5 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 transition-all shadow-inner pr-12 ${
            error ? 'border-red-400 focus:ring-red-400' : 'border-blue-100/40 focus:ring-white/50'
          }`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 cursor-pointer hover:text-white transition-colors">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

<<<<<<< HEAD
      {error && (
        <p className="text-red-300 text-xs mb-4 animate-shake flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Nama proyek wajib diisi sebelum melanjutkan.
        </p>
      )}

      {!error && <div className="mb-4"></div>}

=======
      {/* Pesan Peringatan Jika Kosong */}
      {error && (
        <p className="text-red-300 text-xs mb-4 animate-shake">
          ⚠️ Nama proyek wajib diisi sebelum melanjutkan.
        </p>
      )}

      {/* Spasi tambahan jika tidak ada error agar layout tetap stabil */}
      {!error && <div className="mb-4"></div>}

      {/* Tombol Navigasi (Back & Next) */}
>>>>>>> origin/dev
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