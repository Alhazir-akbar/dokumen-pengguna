'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Sparkles, Loader2 } from 'lucide-react';

interface UserJourneyProps {
  onFinishProject: () => void;
}

export default function UserJourney({ onFinishProject }: UserJourneyProps) {
  const { projectName, projectDescription } = useWizardStore();
  const [journeyText, setJourneyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing project context...');

  const titleName = projectName.trim() ? projectName : 'your project';

  const handleFinish = () => {
    setIsGenerating(true);

    // Simulasi tahapan proses AI generating data sebelum masuk ke halaman stories
    setTimeout(() => {
      setLoadingText('Generating user stories & epics...');
    }, 1200);

    setTimeout(() => {
      setLoadingText('Finalizing project structure...');
    }, 2400);

    setTimeout(() => {
      setIsGenerating(false);
      onFinishProject(); // Pindah ke halaman stories/dashboard utama
    }, 3500);
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto pt-20 text-center pb-12 animate-fadeIn">
        <div className="mb-6 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Building Your Project</h2>
          <p className="text-blue-200 text-xs">{loadingText}</p>
        </div>
        <div className="w-full bg-blue-950/50 rounded-full h-2 overflow-hidden border border-white/10">
          <div className="bg-white h-full rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-6 text-center pb-12">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Let&apos;s capture a User Journey through {titleName}
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-8 max-w-lg leading-relaxed">
        A user journey is a description of how one or more user types interact with your product along a timeline. It could start with them having a problem, discovering your product, using it, getting a result etc.
        <br />
        As always, you can use <Sparkles className="w-3 h-3 inline text-yellow-300" /> to get some AI suggestions.
      </p>

      {/* Textarea Input User Journey */}
      <div className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl text-left mb-6">
        <textarea
          rows={5}
          placeholder={`What is a sample user journey within ${titleName}?`}
          value={journeyText}
          onChange={(e) => setJourneyText(e.target.value)}
          className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl p-4 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 resize-none placeholder:text-blue-200/50"
        />
        
        {/* Tombol AI Suggestion kecil di dalam box */}
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={() => setJourneyText(`A user discovers ${titleName} via search, registers an account, explores the main dashboard, sets up preferences, and successfully completes their first task.`)}
            className="text-gray-300 hover:text-yellow-200 text-xs font-medium flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tombol Finished / Create my Project */}
      <div className="w-full flex items-center justify-start">
        <button
          type="button"
          onClick={handleFinish}
          className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg text-sm cursor-pointer"
        >
          Finished, Create my Project
        </button>
      </div>

    </div>
  );
}