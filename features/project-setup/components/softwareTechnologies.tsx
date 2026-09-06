'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Check, X } from 'lucide-react';

export default function SoftwareTechnologies() {
  const { nextStep, prevStep } = useWizardStore();
  const [technologies, setTechnologies] = useState<string[]>(['HTML', 'Python']);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTech = inputValue.trim();
      if (!technologies.includes(newTech)) {
        setTechnologies([...technologies, newTech]);
      }
      setInputValue('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setTechnologies(technologies.filter((tech) => tech !== techToRemove));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (technologies.length === 0) return;
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
          What technologies does this software use?
        </h2>
        <p className="text-blue-100 text-xs sm:text-sm">
          Select the programming languages and frameworks used to build this system
        </p>
      </div>

      {/* Form Input Tags & Tombol */}
      <form onSubmit={handleNext} className="w-full flex flex-col items-center">
        <div className="w-full bg-white/10 border border-blue-400/50 rounded-xl p-3 flex flex-wrap items-center gap-2 mb-6 focus-within:border-white transition-all shadow-inner text-left">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium backdrop-blur-sm"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="hover:text-red-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={technologies.length === 0 ? "Type technology and press Enter..." : ""}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-blue-300/60 flex-1 min-w-[140px] px-1 py-1"
          />
        </div>

        <div className="flex items-center gap-4 w-full">
          <button
            type="submit"
            disabled={technologies.length === 0}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
              technologies.length > 0
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