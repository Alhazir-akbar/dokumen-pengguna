// app/stories/page.tsx
'use client';

import { useState } from 'react';
import { mockEpics } from '@/features/stories/data/mock-epics';
import { UserStory } from '@/features/stories/types';
import StoriesSidebar from '@/features/stories/components/StoriesSidebar';
import EmptyDetailPanel from '@/features/stories/components/EmptyDetailPanel';
import EpicDetailPanel from '@/features/stories/components/EpicDetailPanel';
import AppSidebar from '@/features/common/components/AppSidebar';
import { MessageSquare } from 'lucide-react';

export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      {/* 1. Main Navigation Toolbar (Dipanggil dari Komponen Global) */}
      <AppSidebar activeMenu="stories" />

      {/* 2. Sub-Sidebar (Daftar Epic & Stories khusus halaman ini) */}
      <StoriesSidebar 
        epics={mockEpics} 
        selectedStoryId={selectedStory?.id} 
        onSelectStory={(story: UserStory) => setSelectedStory(story)} 
      />

      {/* 3. Main Content / Detail Panel (Sisi Kanan) */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Top Navbar Kecil */}
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <span className="text-xs font-medium text-gray-500">alalal -</span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              UD
            </div>
          </div>
        </div>

        {/* Konten Berubah Dinamis */}
        <div className="flex-1 flex overflow-hidden">
          {selectedStory ? (
            <EpicDetailPanel story={selectedStory} />
          ) : (
            <EmptyDetailPanel />
          )}
        </div>
      </main>
    </div>
  );
}