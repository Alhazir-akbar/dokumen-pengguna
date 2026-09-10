// features/stories/components/StoriesSidebar.tsx
'use client';

import { useState, useMemo } from 'react';
import { Epic, UserStory } from '../types';
import EpicListItem from './EpicListItem';
import ProjectMenuDropdown from './ProjectMenuDropdown';
import { Search, Edit3, ChevronDown } from 'lucide-react';

interface StoriesSidebarProps {
  epics: Epic[];
  selectedStoryId?: string;
  currentProjectId?: string | null;
  onSelectStory: (story: UserStory) => void;
  onSelectEpic?: (epic: Epic) => void;
  onAddNew?: () => void;
  projectName?: string;
  projectId?: string | null;
  // workspace_id dari project yang lagi dibuka (didapat dari getProjectById
  // di app/stories/page.tsx). WAJIB dikirim eksplisit -- jangan andalkan
  // localStorage untuk ini, soalnya bisa kosong/stale.
  workspaceId?: number | null;
}

export default function StoriesSidebar({
  epics,
  selectedStoryId,
  currentProjectId,
  projectId,
  workspaceId,
  onSelectStory,
  onSelectEpic,
}: StoriesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const activeProjId = currentProjectId || projectId;

  const filteredEpics = useMemo(() => {
    if (!searchQuery.trim()) return epics;
    const query = searchQuery.toLowerCase();

    return epics
      .map((epic) => {
        const matchesEpicName = epic.name.toLowerCase().includes(query);
        const filteredStories = epic.user_stories?.filter(
          (story) =>
            story.i_want?.toLowerCase().includes(query) ||
            story.as_a?.toLowerCase().includes(query) ||
            story.so_that?.toLowerCase().includes(query) ||
            story.code?.toLowerCase().includes(query)
        );

        if (matchesEpicName || (filteredStories && filteredStories.length > 0)) {
          return {
            ...epic,
            user_stories: matchesEpicName ? epic.user_stories : filteredStories,
          };
        }
        return null;
      })
      .filter(Boolean) as Epic[];
  }, [epics, searchQuery]);

  const totalStories = useMemo(() => {
    return epics.reduce((acc, epic) => acc + (epic.user_stories?.length || 0), 0);
  }, [epics]);

  return (
    <aside className="w-80 border-r border-gray-200 bg-white h-full flex flex-col relative select-none">
      <div className="p-4 border-b border-gray-100 relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <ProjectMenuDropdown
            workspaceId={workspaceId}
            activeProjectId={activeProjId}
            renderTrigger={({ onClick, triggerRef }) => (
              <button
                ref={triggerRef}
                type="button"
                onClick={onClick}
                className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-lg text-white overflow-hidden shadow-sm shrink-0 transition-colors cursor-pointer"
                title="Project Menu & Options"
              >
                <span className="p-2 flex items-center justify-center border-r border-blue-500/40">
                  <Edit3 className="w-4 h-4" />
                </span>
                <span className="p-2 flex items-center justify-center">
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </button>
            )}
          />
        </div>

        <div className="text-[11px] text-gray-400 font-medium px-0.5">
          Showing {totalStories} stories, {epics.length} epics
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {filteredEpics.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs italic">
            No stories or epics found.
          </div>
        ) : (
          filteredEpics.map((epic) => (
            <EpicListItem
              key={epic.id}
              epic={epic}
              selectedStoryId={selectedStoryId}
              onSelectStory={onSelectStory}
              onSelectEpic={onSelectEpic}
            />
          ))
        )}
      </div>
    </aside>
  );
}