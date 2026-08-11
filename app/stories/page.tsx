'use client';

import { useState } from 'react';
import { UserStory } from '@/features/stories/types';
import StoriesSidebar from '@/features/stories/components/StoriesSidebar';
import EmptyDetailPanel from '@/features/stories/components/EmptyDetailPanel';
import EpicDetailPanel from '@/features/stories/components/EpicDetailPanel';
import AppSidebar from '@/features/common/components/AppSidebar';
import { MessageSquare } from 'lucide-react';
import { useWizardStore } from '@/features/project-setup/store/wizard-store';

export default function StoriesPage() {
  const { epics, userStories, projectName } = useWizardStore();

  // Mapping disesuaikan dengan struktur tipe Epic yang asli (menambahkan code, name, user_stories)
  const formattedEpics = epics.map((epic, index) => ({
    id: epic.id,
    code: `EP-${index + 1}`,
    name: epic.title,
    title: epic.title,
    description: epic.description,
    user_stories: userStories
      .filter((story) => story.epicId === epic.id)
      .map((story) => ({
        id: story.id,
        epicId: story.epicId,
        title: story.storyName,
        description: story.description,
        userType: story.userType,
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
        <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <span className="text-xs font-medium text-gray-500">
            {projectName ? projectName : 'alalal'} -
          </span>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat to Userdoc Assistant
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
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