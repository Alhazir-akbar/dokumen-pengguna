<<<<<<< Updated upstream
// features/project-setup/components/UserJourney.tsx
=======
// features/project-setup/components/userJourney.tsx
>>>>>>> Stashed changes
'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
<<<<<<< Updated upstream
=======
import { projectApi } from '@/services/projectsApi';
import { journeysApi } from '@/services/journeysApi';
import { getAuthToken } from '@/lib/auth';
>>>>>>> Stashed changes

interface UserJourneyProps {
  onFinishProject: () => Promise<void> | void;
}

export default function UserJourney({ onFinishProject }: UserJourneyProps) {
<<<<<<< Updated upstream
  const { projectName } = useWizardStore() as any;
  const [journeyText, setJourneyText] = useState('');
<<<<<<< HEAD
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing project context...');
=======
  const [isSubmitting, setIsSubmitting] = useState(false);
>>>>>>> feature/req-002-project-setup
  const [error, setError] = useState(false);

  const titleName = projectName?.trim() ? projectName : 'your project';

<<<<<<< HEAD
<<<<<<< HEAD
  const handleFinish = async () => {
  if (!journeyText || journeyText.trim() === "") {
    setError(true);
    return;
  }
  setError(false);
  setIsGenerating(true);
  setLoadingText('Menyimpan proyek ke server...');
=======
=======
>>>>>>> 23ab38d (add file)
  const handleFinish = () => {
    // Validasi: jika kosong atau hanya berisi spasi, batalkan dan tampilkan error
    if (!journeyText || journeyText.trim() === "") {
      setError(true);
      return;
    }
    setError(false);
    setIsGenerating(true);
<<<<<<< HEAD
>>>>>>> origin/dev

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');
    const workspaceId = localStorage.getItem('active_workspace_id');

    if (!workspaceId) throw new Error('Workspace belum dibuat');

    setLoadingText('Generating user stories & epics...');

    // Panggil API buat proyek baru
    const res = await fetch(`${apiUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`
      },
      body: JSON.stringify({
        name: projectName,
        description: projectDescription,
        workspace_id: Number(workspaceId)
      })
    });

    if (!res.ok) throw new Error('Gagal membuat proyek');

    const project = await res.json();

    // Simpan project_id ke localStorage agar halaman Build, Settings, dll bisa menggunakannya
    localStorage.setItem('active_project_id', String(project.id));

    setLoadingText('Finalizing project structure...');

    setTimeout(() => {
      setIsGenerating(false);
      onFinishProject(); // Redirect ke /stories
    }, 1000);

  } catch (err) {
    console.error(err);
    setIsGenerating(false);
    setError(true);
  }
};
=======
=======
  const handleFinish = async () => {
    if (!journeyText || journeyText.trim() === "") {
=======
  const { projectName, projectDescription, projectId, userTypes } = useWizardStore() as any;
>>>>>>> feature/req-002-project-setup

  const [journeyText, setJourneyText] = useState('');
  const [journeySteps, setJourneySteps] = useState<{ title: string; description: string }[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [actionError, setActionError] = useState('');

  const titleName = projectName?.trim() ? projectName : 'your project';

  const handleAiSuggest = async () => {
    setActionError('');
    const token = getAuthToken();
    if (!token) {
      setActionError('Sesi habis, silakan login kembali.');
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await projectApi.suggestUserJourney(
        {
          project_name: titleName,
          project_description: projectDescription || '',
          user_types: (userTypes || []).map((ut: any) => ut.name),
        },
        token
      );
      setJourneyText(result.journey);
      setJourneySteps(result.steps || []);
      if (error) setError(false);
    } catch (err: any) {
      console.error('Gagal mendapatkan saran AI:', err);
      setActionError(err.message || 'AI gagal memberikan saran. Silakan coba lagi.');
    } finally {
      setIsSuggesting(false);
    }
  };
>>>>>>> 23ab38d (add file)

  const handleFinish = async () => {
    if (!journeyText || journeyText.trim() === '') {
>>>>>>> Stashed changes
      setError(true);
      return;
    }
    setError(false);
<<<<<<< Updated upstream
    setIsSubmitting(true);

    try {
      // Penyimpanan sebenarnya (create workspace/project sudah selesai di step sebelumnya,
      // dan submitWizardBatch ditangani di WizardPage lewat prop onFinishProject ini).
      await onFinishProject();
    } catch (err) {
      console.error('Gagal menyelesaikan project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

=======
    setActionError('');

    const token = getAuthToken();
    if (!token) {
      setActionError('Sesi habis, silakan login kembali.');
      return;
    }

    if (!projectId) {
      setActionError('Project belum berhasil dibuat sebelumnya. Silakan ulangi dari awal wizard.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await journeysApi.createJourney(
        {
          name: `${titleName} — Main User Journey`,
          description: journeyText,
          project_id: projectId,
        },
        token
      );

      if (journeySteps.length > 0) {
        await journeysApi.saveSteps(Number(created.id), journeySteps, token);
      }

      await onFinishProject();
    } catch (err: any) {
      console.error('Gagal menyelesaikan project:', err);
      setActionError(err.message || 'Gagal menyimpan user journey ke server.');
    } finally {
      setIsSubmitting(false);
    }
  };

>>>>>>> Stashed changes
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto pt-20 text-center pb-12 animate-fadeIn">
        <div className="mb-6 p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Building Your Project</h2>
          <p className="text-blue-200 text-xs">Menyimpan spesifikasi proyek ke server...</p>
        </div>
        <div className="w-full bg-blue-950/50 rounded-full h-2 overflow-hidden border border-white/10">
          <div className="bg-white h-full rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-6 text-center pb-12">
      
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Let&apos;s capture a User Journey through {titleName}
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-8 max-w-lg leading-relaxed">
        A user journey is a description of how one or more user types interact with your product along a timeline.
        <br />
        As always, you can use <Sparkles className="w-3 h-3 inline text-yellow-300" /> to get some AI suggestions.
      </p>

<<<<<<< HEAD
      {/* Textarea Input User Journey */}
      <div className={`w-full bg-white/10 border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl text-left mb-2 transition-all ${
        error ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/20'
      }`}>
        <textarea
          rows={5}
          placeholder={`What is a sample user journey within ${titleName}?`}
          value={journeyText}
          onChange={(e) => {
            setJourneyText(e.target.value);
            if (error) setError(false); // Hilangkan pesan error saat user mengetik
          }}
          className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl p-4 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 resize-none placeholder:text-blue-200/50"
        />
=======
      <div className={`w-full bg-white/10 border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl text-left mb-2 transition-all ${
=======
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-10 px-4 pb-16">
      {/* Scrollbar transparan & selaras */}
      <style jsx global>{`
        textarea::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <div className="mb-8 header-fade">
        <LogoUserdoc />
      </div>

      <div className="header-fade w-full text-center" style={{ animationDelay: '80ms' }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Let&apos;s capture a User Journey through {titleName}
        </h1>
        
        {/* Penjelasan dibuat lebih ringkas, padat, dan elegan */}
        <p className="text-blue-200 text-sm mb-8 max-w-2xl mx-auto leading-relaxed">
          Describe how users interact with your product along a timeline. Gunakan tombol <Sparkles className="w-3.5 h-3.5 inline text-yellow-300 mx-0.5" /> AI Suggest untuk draf instan otomatis.
        </p>
      </div>

      <div className={`w-full bg-white/10 border rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl text-left mb-4 transition-all ${
>>>>>>> Stashed changes
        error ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/20'
      }`}>
        <textarea
          rows={6}
          placeholder={isSuggesting ? 'AI sedang menyusun draf user journey...' : `What is a sample user journey within ${titleName}?`}
          value={journeyText}
          onChange={(e) => {
            setJourneyText(e.target.value);
            if (error) setError(false);
          }}
          disabled={isSuggesting}
          className="w-full bg-white/10 border border-blue-300/40 rounded-2xl p-4 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/50 resize-y placeholder:text-blue-300/40 disabled:opacity-70 shadow-inner"
        />
<<<<<<< Updated upstream
>>>>>>> feature/req-002-project-setup
        
        <div className="flex justify-end mt-2">
=======

        <div className="flex justify-end mt-3">
>>>>>>> Stashed changes
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => {
              setJourneyText(`A user discovers ${titleName} via search, registers an account, explores the main dashboard, sets up preferences, and successfully completes their first task.`);
              if (error) setError(false);
            }}
            className="text-gray-300 hover:text-yellow-200 text-xs font-medium flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
=======
            onClick={handleAiSuggest}
            disabled={isSuggesting}
            className="text-yellow-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all px-3 py-2 rounded-xl bg-white/10 hover:bg-blue-600/40 border border-white/15 cursor-pointer disabled:opacity-60 shadow-sm"
>>>>>>> feature/req-002-project-setup
          >
<<<<<<< Updated upstream
            <Sparkles className="w-3 h-3" /> AI Suggestion
=======
            {isSuggesting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-yellow-300" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              </>
            )}
>>>>>>> Stashed changes
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Pesan Peringatan Jika Kosong */}
      {error && (
        <div className="w-full text-left mb-4">
          <p className="text-red-300 text-xs">
            ⚠️ User journey wajib diisi sebelum menyelesaikan proyek.
=======
<<<<<<< Updated upstream
      {error && (
        <div className="w-full text-left mb-4">
          <p className="text-red-300 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
=======
      {journeySteps.length > 0 && (
        <div className="w-full text-left mb-4">
          <span className="text-[11px] text-green-300 font-medium bg-green-950/30 px-3 py-1.5 rounded-xl border border-green-500/20 inline-block">
            ✓ {journeySteps.length} langkah journey berhasil disiapkan AI — bisa ditinjau nanti di halaman Journeys
          </span>
        </div>
      )}

      {error && (
        <div className="w-full text-left mb-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">
>>>>>>> Stashed changes
            User journey wajib diisi sebelum menyelesaikan proyek.
>>>>>>> feature/req-002-project-setup
          </p>
        </div>
      )}

<<<<<<< HEAD
      {!error && <div className="mb-4"></div>}

      {/* Tombol Finished / Create my Project */}
=======
      {actionError && (
        <div className="w-full text-left mb-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">
            {actionError}
          </p>
        </div>
      )}

<<<<<<< Updated upstream
>>>>>>> feature/req-002-project-setup
      <div className="w-full flex items-center justify-start">
        <button
          type="button"
          onClick={handleFinish}
          disabled={isSubmitting}
          className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
=======
      <div className="w-full flex items-center justify-start mt-2">
        <button
          type="button"
          onClick={handleFinish}
          disabled={isSuggesting}
          className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
>>>>>>> Stashed changes
        >
          Finished, Create my Project
        </button>
      </div>
    </div>
  );
}