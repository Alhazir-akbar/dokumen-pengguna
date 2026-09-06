// features/common/components/AppSidebar.tsx
'use client';

import Link from 'next/link';
import LogoUserdoc from '@/public/logoUserDoc';
import { FileText, Users, Map, Code, Settings, HelpCircle } from 'lucide-react';

interface AppSidebarProps {
  activeMenu: 'stories' | 'users' | 'journeys' | 'build' | 'settings' | 'knowledge';
  // project_id project yang sedang dibuka. Dioper ke setiap link menu supaya
  // saat pindah halaman (Stories -> Users -> Journeys) project_id tidak hilang.
  projectId?: string | number | null;
}

export default function AppSidebar({ activeMenu, projectId }: AppSidebarProps) {
  const getButtonStyle = (menuName: string) => {
    const isActive = activeMenu === menuName;
    if (isActive) {
      return "flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 text-blue-600 transition-colors w-full";
    }
    return "flex flex-col items-center justify-center p-2 rounded-xl hover:bg-blue-600/60 hover:text-white transition-colors w-full text-slate-200";
  };

  // Tempel query ?project_id=... ke path kalau projectId tersedia.
  // Kalau tidak ada projectId (misal user belum pernah buka project manapun),
  // link tetap jalan tanpa query — halaman tujuan yang akan menampilkan pesan
  // "project_id tidak ditemukan" sebagaimana mestinya.
  const withProject = (path: string) => (projectId ? `${path}?project_id=${projectId}` : path);

  return (
    <div className="w-20 bg-blue-500 border-r border-blue-400 flex flex-col items-center py-4 gap-6 z-10">
      <LogoUserdoc />

      <div className="flex flex-col gap-7 w-full px-2">
        <Link href={withProject('/stories')} className={getButtonStyle('stories')}>
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight">Stories</span>
        </Link>

        <Link href={withProject('/users')} className={getButtonStyle('users')}>
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight text-center">User Types</span>
        </Link>

        <Link href={withProject('/journeys')} className={getButtonStyle('journeys')}>
          <Map className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight text-center">Journeys</span>
        </Link>

        <Link href={withProject('/build')} className={getButtonStyle('build')}>
          <Code className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight text-center">Build</span>
        </Link>

<<<<<<< HEAD
        {/* Settings & Knowledge Base sengaja tidak dibawakan project_id,
            karena keduanya bersifat umum/tidak spesifik ke satu project. */}
=======
<<<<<<< Updated upstream
        {/* Menu Settings */}
>>>>>>> 23ab38d (add file)
        <Link href="/settings" className={getButtonStyle('settings')}>
=======
        {/* PERBAIKAN: Settings sebelumnya sengaja TIDAK dibawakan project_id dengan asumsi
            halaman itu general/tidak spesifik ke satu project. Ternyata Settings menyimpan
            info umum project + AI Rules per-project, jadi project_id wajib dibawa juga. */}
        <Link href={withProject('/settings')} className={getButtonStyle('settings')}>
>>>>>>> Stashed changes
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight">Settings</span>
        </Link>

<<<<<<< HEAD
=======
<<<<<<< Updated upstream
        {/* Menu Knowledge Base */}
=======
        {/* Knowledge Base tetap general/tidak spesifik ke satu project. */}
>>>>>>> Stashed changes
>>>>>>> 23ab38d (add file)
        <Link href="/knowledge" className={getButtonStyle('knowledge')}>
          <HelpCircle className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight text-center">Knowledge Base</span>
        </Link>
      </div>
    </div>
  );
}