// features/stories/components/StoriesSidebar.tsx
import { Epic, UserStory } from '../types';
import EpicListItem from './EpicListItem';

interface StoriesSidebarProps {
  epics: Epic[];
  selectedStoryId?: string;
  onSelectStory: (story: UserStory) => void;
}

export default function StoriesSidebar({ epics, selectedStoryId, onSelectStory }: StoriesSidebarProps) {
  return (
    <aside className="w-80 border-r border-gray-200 bg-white h-full flex flex-col">
      {/* Header Sidebar */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">User Stories</h2>
        <p className="text-xs text-gray-500">Kelola epic dan fitur aplikasi</p>
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