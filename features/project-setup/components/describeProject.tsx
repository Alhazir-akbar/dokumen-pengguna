'use client';

import { useState, useRef } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore } from '../store/wizard-store';
import { Box, Paperclip, Sparkles, ArrowRight, Check, FileText, Image as ImageIcon, Link as LinkIcon, Code, X } from 'lucide-react';

export default function DescribeProject() {
  const { projectName, projectDescription, setProjectDescription, platformType, setPlatformType, nextStep } = useWizardStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
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

  // Fungsi untuk menangani pilihan dari menu attach
  const handleSelectAttachOption = (option: typeof attachOptions[0]) => {
    setIsAttachOpen(false);

    if (option.type === 'file') {
      if (fileInputRef.current) {
        fileInputRef.current.accept = option.accept;
        fileInputRef.current.click();
      }
    } else if (option.type === 'link') {
      // Memunculkan prompt untuk memasukkan URL web
      const url = prompt('Enter Web Link / URL:', 'https://');
      if (url && url.trim() !== '' && url !== 'https://') {
        // Membersihkan protokol agar tampilannya lebih rapi pada badge
        setAttachedFile(url.trim());
      }
    }
  };

  // Fungsi ketika file lokal berhasil dipilih
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachedFile(files[0].name);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-8 text-center">
      
      {/* Hidden File Input untuk Upload Lokal */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Logo Kotak (UD) */}
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Tell us about {titleName}
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-6 max-w-lg">
        Enter a high level overview of what it does, and how you use it (click the <Sparkles className="w-3.5 h-3.5 inline text-gray-300 mx-0.5" /> button for a detailed example and suggestion).
      </p>

      {/* Kotak Input / Textarea Container */}
      <div className="bg-white/20 border border-blue-400/30 rounded-2xl p-4 w-full mb-6 backdrop-blur-sm shadow-xl text-left relative flex flex-col">
        
        {/* Tombol AI Suggestion */}
        <button 
          type="button" 
          onClick={() => setProjectDescription(`${titleName} is a comprehensive digital platform designed to optimize workflow management, track real-time analytics, and streamline team collaboration efficiently.`)}
          className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors p-1 cursor-pointer"
          title="Get AI suggestion"
        >
          <Sparkles className="w-4 h-4 text-gray-300" />
        </button>

        {/* Textarea */}
        <textarea
          rows={7}
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder={`${titleName} description...`}
          className="w-full bg-transparent text-white placeholder-white/40 text-sm focus:outline-none resize-none mb-4 pr-8"
        />

        {/* Bagian Bawah Textarea: Tombol Dropdown & Attach */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-400/25 relative">
          
          {/* Tombol Dropdown Platform */}
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

            {/* Menu Dropdown Popup Platform */}
            {isDropdownOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-56 bg-white border border-blue-400/30 rounded-xl shadow-2xl py-2 z-50 flex flex-col">
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

          {/* Tombol Dropdown Attach */}
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

            {/* Menu Dropdown Popup Attach */}
            {isAttachOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-blue-400/30 rounded-xl shadow-2xl py-2 z-50 flex flex-col">
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

          {/* Badge Label Jika File / Link Berhasil Ditambahkan */}
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

      {/* Tombol Next */}
      <div className="w-full flex justify-start">
        <button
          type="button"
          onClick={nextStep}
          className="bg-white text-blue-500 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}