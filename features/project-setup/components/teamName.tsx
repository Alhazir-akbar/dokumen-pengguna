'use client';

import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
<<<<<<< HEAD
import { ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { getAuthToken } from '@/lib/auth';

export default function TeamName() {
  const {
    teamName,
    updateTeamName,
    nextStep,
    createWorkspaceIfNeeded,
    isCreatingWorkspace,
  } = useWizardStore() as any;

  const [error, setError] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleNext = async () => {
  if (!teamName || teamName.trim() === "") {
    setError(true);
    return;
  }
  setError(false);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');

    // Panggil API buat workspace baru
    const res = await fetch(`${apiUrl}/api/workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
      },
      body: JSON.stringify({ name: teamName })
    });

    if (!res.ok) throw new Error('Gagal membuat workspace');

    const workspace = await res.json();

    // Simpan workspace_id ke localStorage agar halaman lain bisa menggunakannya
    localStorage.setItem('active_workspace_id', String(workspace.id));

    nextStep();
  } catch (err) {
    console.error(err);
    setError(true);
  }
};
=======
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function TeamName() {
  const { teamName, updateTeamName, nextStep } = useWizardStore();
  const [error, setError] = useState(false);

  const handleNext = () => {
    // Validasi: jika kosong atau hanya berisi spasi, batalkan dan tampilkan error
    if (!teamName || teamName.trim() === "") {
      setError(true);
      return;
    }
    setError(false);
    nextStep();
  };
>>>>>>> origin/dev

  return (
    <div className="flex flex-col items-start w-full max-w-xl mx-auto pt-12">
      <div className="mb-8">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        Setup your team
      </h1>

      <p className="text-blue-200 text-sm mb-6 leading-relaxed">
        A team allows you to group your projects, team members, and billing together. Choose a name that identifies your team, this is most likely your company name.
      </p>

<<<<<<< HEAD
=======
      {/* Kotak Input Nama Tim */}
>>>>>>> origin/dev
      <div className="relative w-full mb-2">
        <input
          type="text"
          value={teamName}
<<<<<<< HEAD
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type in your team name..."
          autoFocus
          disabled={isCreatingWorkspace}
          className={`w-full bg-white/10 border rounded-xl px-4 py-3.5 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 transition-all shadow-inner disabled:opacity-60 ${
            error || actionError ? 'border-red-400 focus:ring-red-400' : 'border-blue-200/40 focus:ring-white/50'
=======
          onChange={(e) => {
            updateTeamName(e.target.value);
            if (error) setError(false); // Hilangkan pesan error saat user mulai mengetik
          }}
          placeholder="Type in your team name..."
          className={`w-full bg-white/10 border rounded-xl px-4 py-3.5 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 transition-all shadow-inner ${
            error ? 'border-red-400 focus:ring-red-400' : 'border-blue-200/40 focus:ring-white/50'
>>>>>>> origin/dev
          }`}
        />
      </div>

<<<<<<< HEAD
      {error && (
        <p className="text-red-300 text-xs mb-4 animate-shake flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Nama tim wajib diisi sebelum melanjutkan.
        </p>
      )}

      {actionError && (
        <p className="text-red-300 text-xs mb-4 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {actionError}
        </p>
      )}

      {!error && !actionError && <div className="mb-4"></div>}

      <button
        type="button"
        onClick={handleNext}
        disabled={isCreatingWorkspace}
        className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
=======
      {/* Pesan Peringatan Jika Kosong */}
      {error && (
        <p className="text-red-300 text-xs mb-4 animate-shake">
          ⚠️ Nama tim wajib diisi sebelum melanjutkan.
        </p>
      )}

      {/* Spasi tambahan jika tidak ada error agar layout tetap stabil */}
      {!error && <div className="mb-4"></div>}

      {/* Tombol Create Team */}
      <button
        type="button"
        onClick={handleNext}
        className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg cursor-pointer"
>>>>>>> origin/dev
      >
        {isCreatingWorkspace ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Membuat ruang kerja...
          </>
        ) : (
          <>
            Create Team <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}