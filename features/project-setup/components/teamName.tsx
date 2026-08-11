'use client';

import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { ArrowRight } from 'lucide-react';

export default function TeamName() {
  const { teamName, updateTeamName, nextStep } = useWizardStore();

  return (
    <div className="flex flex-col items-start w-full max-w-xl mx-auto pt-12">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-8">
        <LogoUserdoc />
      </div>

      {/* Judul Halaman */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        Setup your team
      </h1>

      {/* Sub-teks penjelasan */}
      <p className="text-blue-200 text-sm mb-6 leading-relaxed">
        A team allows you to group your projects, team members, and billing together. Choose a name that identifies your team, this is most likely your company name.
      </p>

      {/* Kotak Input Nama Tim */}
      <div className="relative w-full mb-6">
        <input
          type="text"
          value={teamName}
          onChange={(e) => updateTeamName(e.target.value)}
          placeholder="Type in your team name..."
          className="w-full bg-blue-700/50 border border-blue-400/40 rounded-xl px-4 py-3.5 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-inner"
        />
      </div>

      {/* Tombol Create Team */}
      <button
        type="button"
        onClick={nextStep}
        className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg"
      >
        Create Team <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}