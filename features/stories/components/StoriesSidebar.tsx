// features/stories/components/StoriesSidebar.tsx
import { useState, useMemo } from 'react';
import { Epic, UserStory } from '../types';
import EpicListItem from './EpicListItem';
import { Search, Plus, ChevronDown } from 'lucide-react';

interface StoriesSidebarProps {
  epics: Epic[];
  selectedStoryId?: string;
  onSelectStory: (story: UserStory) => void;
  onAddNew?: () => void; // Opsional: fungsi untuk tombol tambah baru
}

export default function StoriesSidebar({ epics, selectedStoryId, onSelectStory, onAddNew }: StoriesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter epics dan user stories berdasarkan keyword pencarian
  const filteredEpics = useMemo(() => {
    if (!searchQuery.trim()) return epics;

    const query = searchQuery.toLowerCase();

    return epics
      .map((epic) => {
        // Cocokkan nama epic atau saring user stories di dalamnya
        const matchesEpicName = epic.name.toLowerCase().includes(query);
        const filteredStories = epic.user_stories?.filter(
          (story) =>
            story.i_want?.toLowerCase().includes(query) ||
            story.as_a?.toLowerCase().includes(query) ||
            story.so_that?.toLowerCase().includes(query) ||
            story.code?.toLowerCase().includes(query)
        );

        // Jika epic cocok atau ada story di dalamnya yang cocok
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

  // Hitung total stories dan epics yang sedang ditampilkan
  const totalStories = useMemo(() => {
    return filteredEpics.reduce((acc, epic) => acc + (epic.user_stories?.length || 0), 0);
  }, [filteredEpics]);

  return (
    <aside className="w-80 border-r border-gray-200 bg-white h-full flex flex-col">
      {/* Header Sidebar dengan Search Bar & Tombol Tambah */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          {/* Input Search Bar */}
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

          {/* Tombol Add / Create dengan Dropdown Kecil */}
          <button
            type="button"
            onClick={onAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors flex items-center justify-center shadow-sm cursor-pointer"
            title="Create New"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title="More options"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Informasi Jumlah (Showing X stories, Y epics) */}
        <div className="text-[11px] text-gray-400 font-medium px-0.5">
          Showing {totalStories} stories, {filteredEpics.length} epics
        </div>
      </div>

      {/* List Content */}
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
            />
          ))
        )}
      </div>
    </aside>
  );
}