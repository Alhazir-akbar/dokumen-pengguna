// features/project-setup/components/UserJourney.tsx
'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Sparkles, Loader2, AlertCircle, User } from 'lucide-react';
import { projectApi } from '@/services/projectsApi';
import { journeysApi } from '@/services/journeysApi';
import { getAuthToken } from '@/lib/auth';

interface UserJourneyProps {
  onFinishProject: () => Promise<void> | void;
}

interface JourneyStepDraft {
  title: string;
  description: string;
  persona_name?: string | null;
}

export default function UserJourney({ onFinishProject }: UserJourneyProps) {
  const { projectName, projectDescription, projectId, userTypes } = useWizardStore() as any;

  const [journeyText, setJourneyText] = useState('');
  const [journeySteps, setJourneySteps] = useState<JourneyStepDraft[]>([]);
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

    // Ambil persona asli dari userTypes di store (hasil step AI Requirements
    // sebelumnya, UserTypeItem.personas: PersonaDraft[]). Ini yang dipakai
    // AI untuk assign persona_name per step -- bukan lagi nama user type.
    const personas = (userTypes || []).flatMap((ut: any) =>
      (ut.personas || []).map((p: any) => ({
        name: p.name,
        user_type: ut.name,
        about: p.about || '',
      }))
    );

    if (personas.length === 0) {
      setActionError(
        'Belum ada Persona yang tersedia. Kembali ke step User Types dan pastikan persona sudah dibuat sebelum generate AI journey.'
      );
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await projectApi.suggestUserJourney(
        {
          project_name: titleName,
          project_description: projectDescription || '',
          personas, // <- ganti dari user_types: string[]
        },
        token
      );
      setJourneyText(result.journey);
      setJourneySteps(
        (result.steps || []).map((s: any) => ({
          title: s.title,
          description: s.description,
          persona_name: s.persona_name ?? null,
        }))
      );
      if (error) setError(false);
    } catch (err: any) {
      console.error('Gagal mendapatkan saran AI:', err);
      setActionError(err.message || 'AI gagal memberikan saran. Silakan coba lagi.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleFinish = async () => {
    if (!journeyText || journeyText.trim() === '') {
      setError(true);
      return;
    }
    setError(false);
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
      // CATATAN: di titik wizard ini persona masih berupa draft di store
      // (belum tentu punya id asli di DB tergantung urutan save-requirements),
      // jadi step yang dibuat di sini belum menyertakan persona_id. Persona
      // per step baru bisa di-assign final nanti di halaman Journeys, baik
      // lewat "Generate AI Steps" ulang (yang query persona asli dari DB dan
      // match by name) atau lewat dropdown assign manual.
      await journeysApi.createJourney(
        {
          name: `${titleName} — Main User Journey`,
          description: journeyText,
          project_id: projectId,
          steps: journeySteps.map((step, index) => ({
            step_order: index + 1,
            title: step.title,
            description: step.description,
          })),
        },
        token
      );

      await onFinishProject();
    } catch (err: any) {
      console.error('Gagal menyelesaikan project:', err);
      setActionError(err.message || 'Gagal menyimpan user journey ke server.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-10 px-4 pb-16">
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

        <p className="text-blue-200 text-sm mb-8 max-w-2xl mx-auto leading-relaxed">
          Describe how users interact with your product along a timeline. Gunakan tombol{' '}
          <Sparkles className="w-3.5 h-3.5 inline text-yellow-300 mx-0.5" /> AI Suggest untuk draf
          instan otomatis.
        </p>
      </div>

      <div
        className={`w-full bg-white/10 border rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl text-left mb-4 transition-all ${
          error ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/20'
        }`}
      >
        <textarea
          rows={6}
          placeholder={
            isSuggesting
              ? 'AI sedang menyusun draf user journey...'
              : `What is a sample user journey within ${titleName}?`
          }
          value={journeyText}
          onChange={(e) => {
            setJourneyText(e.target.value);
            if (error) setError(false);
          }}
          disabled={isSuggesting}
          className="w-full bg-white/10 border border-blue-300/40 rounded-2xl p-4 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/50 resize-y placeholder:text-blue-300/40 disabled:opacity-70 shadow-inner"
        />

        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={isSuggesting}
            className="text-yellow-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all px-3 py-2 rounded-xl bg-white/10 hover:bg-blue-600/40 border border-white/15 cursor-pointer disabled:opacity-60 shadow-sm"
          >
            {isSuggesting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-yellow-300" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" /> AI Suggest
              </>
            )}
          </button>
        </div>
      </div>

      {journeySteps.length > 0 && (
        <div className="w-full text-left mb-4 space-y-2">
          <span className="text-[11px] text-green-300 font-medium bg-green-950/30 px-3 py-1.5 rounded-xl border border-green-500/20 inline-block">
            ✓ {journeySteps.length} langkah journey berhasil disiapkan AI — bisa ditinjau nanti di
            halaman Journeys
          </span>

          <div className="flex flex-wrap gap-1.5">
            {journeySteps.map(
              (s, i) =>
                s.persona_name && (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[10px] text-blue-100 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full"
                  >
                    <User className="w-2.5 h-2.5" /> {i + 1}. {s.persona_name}
                  </span>
                )
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="w-full text-left mb-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">
            User journey wajib diisi sebelum menyelesaikan proyek.
          </p>
        </div>
      )}

      {actionError && (
        <div className="w-full text-left mb-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">{actionError}</p>
        </div>
      )}

      <div className="w-full flex items-center justify-start mt-2">
        <button
          type="button"
          onClick={handleFinish}
          disabled={isSuggesting}
          className="bg-white hover:bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Finished, Create my Project
        </button>
      </div>
    </div>
  );
}