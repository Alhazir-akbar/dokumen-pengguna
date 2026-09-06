// features/stories/components/StoriesSidebar.tsx
import { Epic, UserStory } from '../types';
import EpicListItem from './EpicListItem';
<<<<<<< Updated upstream
=======
import { Search, Pencil } from 'lucide-react';
import ProjectSwitcher from '@/features/common/components/projectSwitcher';
>>>>>>> Stashed changes

interface StoriesSidebarProps {
  epics: Epic[];
  selectedStoryId?: string;
  currentProjectId?: string | null;
  onSelectStory: (story: UserStory) => void;
}

<<<<<<< Updated upstream
export default function StoriesSidebar({ epics, selectedStoryId, onSelectStory }: StoriesSidebarProps) {
=======
export default function StoriesSidebar({ epics, selectedStoryId, currentProjectId, onSelectStory, onSelectEpic, onAddNew }: StoriesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

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

>>>>>>> Stashed changes
  return (
    <aside className="w-80 border-r border-gray-200 bg-white h-full flex flex-col">
      {/* Header Sidebar */}
      <div className="p-4 border-b border-gray-100">
<<<<<<< Updated upstream
        <h2 className="text-lg font-bold text-gray-800">User Stories</h2>
        <p className="text-xs text-gray-500">Kelola epic dan fitur aplikasi</p>
=======
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

          <button
            type="button"
            onClick={onAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center shadow-sm cursor-pointer"
            title="Create New Story/Epic"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* PERBAIKAN: tombol ini sebelumnya "mati" (cuma ChevronDown tanpa onClick,
              berlabel "More options" tapi tidak melakukan apa-apa). Sekarang jadi
              project switcher: pilih project lain atau buat project baru. */}
          <ProjectSwitcher currentProjectId={currentProjectId} />
        </div>

        <div className="text-[11px] text-gray-400 font-medium px-0.5">
          Showing {totalStories} stories, {epics.length} epics
        </div>
>>>>>>> Stashed changes
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {epics.map((epic) => (
          <EpicListItem 
            key={epic.id} 
            epic={epic} 
            selectedStoryId={selectedStoryId}
            onSelectStory={onSelectStory}
          />
        ))}
      </div>
    </aside>
  );
}