// features/stories/components/EpicDetailPanel.tsx
import { Epic, UserStory } from '../types';
import { Copy, Edit3, FolderGit2, FileText } from 'lucide-react';

interface EpicDetailPanelProps {
  epic: Epic;
  onSelectStory: (story: UserStory) => void;
}

export default function EpicDetailPanel({ epic, onSelectStory }: EpicDetailPanelProps) {
  const stories = epic.user_stories || [];

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{epic.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded font-mono font-medium border border-gray-200">
            {epic.code}
          </span>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer" title="Copy ID">
            <Copy className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer">
            <Edit3 className="w-4 h-4 text-gray-500" /> Edit
          </button>
        </div>
      </div>

      <div className="mb-8 bg-blue-50/40 p-4 rounded-xl border border-blue-50">
        <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Description</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {epic.description || 'Tidak ada deskripsi epic.'}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-50 pb-2 flex items-center gap-1.5">
          <FolderGit2 className="w-4 h-4" /> CHILD REQUIREMENTS
        </h3>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 w-24">Type</th>
                <th className="py-3 px-4">Text</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {stories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 px-4 text-center text-gray-400 text-xs">
                    Belum ada user story di epic ini.
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr
                    key={story.id}
                    onClick={() => onSelectStory(story)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-medium text-blue-600">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                        {story.i_want}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">Story</td>
                    <td className="py-3 px-4 text-gray-600">
                      As a {story.as_a}, I want to {story.i_want}, So that {story.so_that}.
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}