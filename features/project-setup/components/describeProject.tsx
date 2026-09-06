'use client';

import { useState, useRef } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import {
  Box,
  Paperclip,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';

export default function DescribeProject() {
  const {
    projectName,
    projectDescription,
    setProjectDescription,
    platformType,
    setPlatformType,
    nextStep,
    prevStep,
    createProjectIfNeeded,
    isCreatingProject,
  } = useWizardStore() as any;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [actionError, setActionError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleName = projectName.trim() ? projectName : 'your project';

  const platforms = [
    'Web Application',
    'Mobile Application',
    'Desktop Application',
    'CLI Tool',
    'Backend Service',
    'Integration',
    'API',
    'Microservice',
    'Data pipeline / ETL'
  ];

  const attachOptions = [
    { label: 'Upload Document (.pdf, .docx)', icon: FileText, type: 'file', accept: '.pdf,.docx,.doc' },
    { label: 'Upload Image / Screenshot', icon: ImageIcon, type: 'file', accept: 'image/*' },
    { label: 'Add Web Link / URL', icon: LinkIcon, type: 'link', accept: '' },
    { label: 'Attach Source Code / Repo', icon: Code, type: 'file', accept: '.zip,.rar,.tar,.json' },
  ];

  const handleSelectAttachOption = (option: typeof attachOptions[0]) => {
    setIsAttachOpen(false);

    if (option.type === 'file') {
      if (fileInputRef.current) {
        fileInputRef.current.accept = option.accept;
        fileInputRef.current.click();
      }
    } else if (option.type === 'link') {
      const url = prompt('Enter Web Link / URL:', 'https://');
      if (url && url.trim() !== '' && url !== 'https://') {
        setAttachedFile(url.trim());
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachedFile(files[0].name);
    }
  };

  const handleAiSuggest = async () => {
    setActionError('');
    const token = getAuthToken();

    if (!token) {
      setActionError('Sesi habis, silakan login kembali.');
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await projectApi.suggestDescription(
        {
          project_name: projectName?.trim() || 'Proyek Baru',
          platform_type: platformType,
        },
        token
      );

      setProjectDescription(result.description);
      if (error) setError(false);
    } catch (err: any) {
      console.error('Gagal mendapatkan saran AI:', err);
      setActionError(err.message || 'AI gagal memberikan saran. Silakan coba lagi.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleNext = async () => {
    if (!projectDescription || projectDescription.trim() === "") {
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

    const id = await createProjectIfNeeded(token);
    if (!id) {
      setActionError('Gagal membuat proyek. Silakan coba lagi.');
      return;
    }

    nextStep();
  };

  const isBusy = isSuggesting || isCreatingProject;

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-8 text-center">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
=======
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-8 text-center pb-12">
      {/* Pengaturan Scrollbar Transparan Total */}
      <style jsx global>{`
        textarea.transparent-scroll::-webkit-scrollbar {
          width: 6px;
        }
        textarea.transparent-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea.transparent-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }
        textarea.transparent-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
>>>>>>> Stashed changes

      <div className="mb-4">
        <LogoUserdoc />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Tell us about {titleName}
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-6 max-w-lg">
        Enter a high level overview of what it does, and how you use it (click the <Sparkles className="w-3.5 h-3.5 inline text-gray-300 mx-0.5" /> button and let AI suggest a description for you if you're not sure where to start).
      </p>

      <div className={`bg-white/20 border rounded-2xl p-4 w-full mb-2 backdrop-blur-sm shadow-xl text-left relative flex flex-col transition-all ${
        error ? 'border-red-400 ring-2 ring-red-400/50' : 'border-blue-400/30'
      }`}>
        
        <button 
          type="button" 
          onClick={handleAiSuggest}
          disabled={isBusy}
          className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors p-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Get AI suggestion"
        >
          {isSuggesting ? (
            <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-gray-300" />
          )}
        </button>

        <textarea
          rows={7}
          value={projectDescription}
          onChange={(e) => {
            setProjectDescription(e.target.value);
            if (error) setError(false);
          }}
          placeholder={
            isSuggesting
              ? 'AI sedang menyusun draf deskripsi...'
              : `${titleName} description...`
          }
          disabled={isSuggesting}
<<<<<<< Updated upstream
          className="w-full bg-transparent text-white placeholder-white/40 text-sm focus:outline-none resize-none mb-4 pr-8 disabled:opacity-70"
=======
          className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-blue-400 resize-none mb-4 disabled:opacity-70 leading-relaxed transparent-scroll"
>>>>>>> Stashed changes
        />

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-400/25 relative">
          
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsAttachOpen(false);
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-blue-600/80 border border-blue-400/40 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all shadow-sm"
            >
              <Box className="w-3.5 h-3.5 text-blue-300" />
              <span>{platformType}</span>
              <span className="text-blue-300 text-[10px] ml-1">▼</span>
            </button>

            {isDropdownOpen && (
<<<<<<< Updated upstream
              <div className="absolute left-0 bottom-full mb-2 w-56 bg-white border border-blue-400/30 rounded-xl shadow-2xl py-2 z-50 flex flex-col">
=======
              <div className="absolute left-0 bottom-full mb-2 w-56 max-h-48 overflow-y-auto bg-slate-900/90 border border-blue-400/30 rounded-2xl shadow-2xl py-2 z-50 flex flex-col backdrop-blur-2xl transparent-scroll">
                <div className="px-4 py-1 text-[10px] font-semibold text-blue-400 uppercase tracking-wider sticky top-0 bg-slate-900/90 backdrop-blur-md">
                  Select Platform Type
                </div>
>>>>>>> Stashed changes
                {platforms.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setPlatformType(item);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2 text-xs text-left transition-colors hover:bg-blue-600/40 cursor-pointer ${
                      platformType === item ? 'text-white font-semibold bg-blue-600/50' : 'text-blue-500'
                    }`}
                  >
                    <span>{item}</span>
                    {platformType === item && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsAttachOpen(!isAttachOpen);
                setIsDropdownOpen(false);
              }}
              className="flex items-center gap-2 bg-white/20 hover:bg-blue-600/80 border border-blue-400/40 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all shadow-sm"
            >
              <Paperclip className="w-3.5 h-3.5 text-blue-300" />
              <span>{attachedFile ? 'Attached (1)' : 'Attach'}</span>
              <span className="text-blue-300 text-[10px] ml-1">▼</span>
            </button>

            {isAttachOpen && (
<<<<<<< Updated upstream
              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-blue-400/30 rounded-xl shadow-2xl py-2 z-50 flex flex-col">
=======
              <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-900/90 border border-blue-400/30 rounded-2xl shadow-2xl py-2 z-50 flex flex-col backdrop-blur-2xl transparent-scroll">
>>>>>>> Stashed changes
                <div className="px-4 py-1 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                  Select Attachment Type
                </div>
                {attachOptions.map((opt) => {
                  const IconComp = opt.icon;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectAttachOption(opt)}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-left text-blue-500 hover:text-white transition-colors hover:bg-blue-600/40 cursor-pointer"
                    >
                      <IconComp className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {attachedFile && (
          <span className="text-[11px] text-blue-400 bg-white border border-blue-400/30 px-2.5 py-1 rounded-md flex items-center gap-1.5 max-w-[220px] truncate" title={attachedFile}>
            <Paperclip className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{attachedFile}</span>
            <button 
              type="button" 
              onClick={() => setAttachedFile(null)}
              className="text-red-300 hover:text-red-100 ml-1 font-bold cursor-pointer shrink-0"
            >
                <X className="w-3 h-3 inline" />
              </button>
            </span>
          )}
        </div>
      </div>

      {(error || actionError) && (
        <div className="w-full text-left mb-4">
          <p className="text-red-300 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error ? 'Deskripsi proyek wajib diisi sebelum melanjutkan.' : actionError}
          </p>
        </div>
      )}

<<<<<<< Updated upstream
      {!error && !actionError && <div className="mb-4"></div>}

      <div className="w-full flex justify-start">
=======
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={isBusy}
          className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-5 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

>>>>>>> Stashed changes
        <button
          type="button"
          onClick={handleNext}
          disabled={isBusy}
<<<<<<< Updated upstream
          className="bg-white text-blue-500 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
=======
          className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2.5 shadow-xl text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
>>>>>>> Stashed changes
        >
          {isCreatingProject ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Membuat proyek...
            </>
          ) : (
            <>
              Next <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}