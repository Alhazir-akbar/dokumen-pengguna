// features/common/components/AppSidebar.tsx
'use client';

import Link from 'next/link';
import LogoUserdoc from '@/public/logoUserDoc';
import { FileText, Users, Map, Code, Settings, HelpCircle } from 'lucide-react';

interface AppSidebarProps {
  activeMenu: 'stories' | 'users' | 'journeys' | 'build' | 'settings' | 'knowledge';
}

export default function AppSidebar({ activeMenu }: AppSidebarProps) {
  const getButtonStyle = (menuName: string) => {
    const isActive = activeMenu === menuName;
    if (isActive) {
      return "flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 text-blue-600 transition-colors w-full";
    }
    // Ikon tidak aktif dibuat agak putih terang (text-slate-200) dengan efek hover
    return "flex flex-col items-center justify-center p-2 rounded-xl hover:bg-blue-600/60 hover:text-white transition-colors w-full text-slate-200";
  };

  return (
    <div className="w-20 bg-blue-500 border-r border-blue-400 flex flex-col items-center py-4 gap-6 z-10">
      <LogoUserdoc />
      
      {/* Jarak antar menu diperdekat menggunakan gap-2 */}
      <div className="flex flex-col gap-7 w-full px-2">
        {/* Menu Stories */}
        <Link href="/stories" className={getButtonStyle('stories')}>
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight">Stories</span>
        </Link>

        {/* Menu User Types */}
        <Link href="/users" className={getButtonStyle('users')}>
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight text-center">User Types</span>
        </Link>

        {/* Menu Journeys */}
        <Link href="/journeys" className={getButtonStyle('journeys')}>
          <Map className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight text-center">Journeys</span>
        </Link>

        {/* Menu Build */}
        <Link href="/build" className={getButtonStyle('build')}>
          <Code className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight text-center">Build</span>
        </Link>

        {/* Menu Settings */}
        <Link href="/settings" className={getButtonStyle('settings')}>
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight">Settings</span>
        </Link>

        {/* Menu Knowledge Base */}
        <Link href="/knowledge" className={getButtonStyle('knowledge')}>
          <HelpCircle className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-tight text-center">Knowledge Base</span>
        </Link>
      </div>
    </div>
  );
}