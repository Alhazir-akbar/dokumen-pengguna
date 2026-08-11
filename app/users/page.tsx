'use client';

import { useState } from 'react';
import { UserStory } from '@/features/stories/types';
import StoriesSidebar from '@/features/stories/components/StoriesSidebar';
import EmptyDetailPanel from '@/features/stories/components/EmptyDetailPanel';
import EpicDetailPanel from '@/features/stories/components/EpicDetailPanel';
import AppSidebar from '@/features/common/components/AppSidebar';
import { MessageSquare, Upload, Download } from 'lucide-react';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

export default function StoriesPage() {
  const { epics, userStories, projectName } = useWizardStore();

  const formattedEpics = epics.map((epic, index) => ({
    id: epic.id,
    code: `EP-${index + 1}`,
    name: epic.title,
    title: epic.title,
    description: epic.description,
    user_stories: userStories
      .filter((story) => story.epicId === epic.id)
      .map((story, sIndex) => ({
        id: story.id,
        epicId: story.epicId,
        code: `US-${index + 1}.${sIndex + 1}`,
        as_a: story.userType || 'User',
        i_want: story.storyName || 'Melakukan sesuatu',
        so_that: story.description || 'Sistem berjalan dengan baik',
        acceptanceCriteria: [],
        techNotes: [],
        testCases: [],
      })),
  }));

  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      <AppSidebar activeMenu="stories" />

      <StoriesSidebar 
        epics={formattedEpics as any} 
        selectedStoryId={selectedStory?.id} 
        onSelectStory={(story: UserStory) => setSelectedStory(story)} 
      />

      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs font-medium text-gray-600">
            {projectName ? projectName : 'alalal'} <span className="text-gray-400">/</span>
          </span>

          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            
            <div className="flex items-center gap-1.5 text-gray-500">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer" title="Upload">
                <Upload className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer" title="Download">
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ml-1">
              UD
            </div>
          </div>
        </div>

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