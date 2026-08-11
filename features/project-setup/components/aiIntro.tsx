'use client';

import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AiIntro() {
  const { nextStep, prevStep } = useWizardStore();

  const stepsList = [
    "Project details",
    "User types",
    "Epics & Non-functional requirements",
    "User story overviews",
    "User goals & example journey"
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto pt-8 text-center">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-6">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        Let&apos;s create your project requirements...
      </h1>
      
      <p className="text-blue-200 text-sm mb-8">
        We&apos;ll help you create your initial software requirements in 5 simple steps.
      </p>

      {/* List 5 Langkah AI */}
      <div className="bg-white/20 border border-blue-200/50 rounded-2xl p-6 w-full mb-8 text-left backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          {stepsList.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center font-semibold text-xs shrink-0 border border-white/20">
                {index + 1}
              </div>
              <span className="text-white text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Aksi Bawah */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={nextStep}
          className="bg-white text-blue-500 hover:bg-blue-50 px-3 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
        >
          Get started <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={prevStep}
          className="text-blue-200 hover:text-white text-sm font-medium transition-colors underline underline-offset-4"
        >
          Back to project type
        </button>
      </div>

    </div>
  );
}