'use client';

import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NameProject() {
  const { projectName, updateProjectName, nextStep, prevStep } = useWizardStore();

  return (
    <div className="flex flex-col items-start w-full max-w-xl mx-auto pt-12">
      
      {/* Panggil Logo di sini */}
      <div className="mb-8">
        <LogoUserdoc />
      </div>

      {/* Judul Pertanyaan */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        What is the name of your project?
      </h1>

      {/* Sub-teks penjelasan */}
      <p className="text-blue-200 text-sm mb-6 leading-relaxed">
        This is the name of your software, app, or system you want to create requirements for.{' '}
        <span className="block mt-1 text-blue-300 flex items-center gap-1.5">
          (click the <Sparkles className="w-3.5 h-3.5 inline-block" /> button on the right for some inspiration)
        </span>
      </p>

      {/* Kotak Input dengan Ikon AI di dalamnya */}
      <div className="relative w-full mb-6">
        <input
          type="text"
          value={projectName}
          onChange={(e) => updateProjectName(e.target.value)}
          placeholder="Type your project name here..."
          className="w-full bg-white/10 border border-blue-100/40 rounded-xl px-4 py-3.5 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-inner pr-12"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 cursor-pointer hover:text-white transition-colors">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Tombol Navigasi (Back & Next) */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 backdrop-blur-sm"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}