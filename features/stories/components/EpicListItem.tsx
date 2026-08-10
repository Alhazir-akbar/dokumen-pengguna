// features/stories/components/EpicListItem.tsx
import { Epic, UserStory } from '../types';
import { ChevronDown, FileText } from 'lucide-react';

interface EpicListItemProps {
  epic: Epic;
  selectedStoryId?: string;
  onSelectStory: (story: UserStory) => void;
}

export default function EpicListItem({ epic, selectedStoryId, onSelectStory }: EpicListItemProps) {
  return (
    <div className="mb-4">
      {/* Judul Epic */}
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-md mb-1 flex items-center gap-1.5">
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        <span className="truncate">{epic.name}</span>
      </div>

      {/* List User Stories di dalam Epic ini */}
      <div className="space-y-1 pl-3">
        {epic.user_stories && epic.user_stories.length > 0 ? (
          epic.user_stories.map((story) => {
            const isSelected = selectedStoryId === story.id;
            return (
              <button
                key={story.id}
                onClick={() => onSelectStory(story)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between group ${
                  isSelected 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="truncate">{story.i_want}</span>
                </div>
                
                {/* Kode Story Badge */}
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono shrink-0">
                  {story.code}
                </span>
              </button>
            );
          })
        ) : (
          <div className="px-3 py-1.5 text-xs text-gray-400 italic">No stories yet</div>
        )}
      </div>
    </div>
  );
}