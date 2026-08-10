// features/stories/components/EmptyDetailPanel.tsx
import { Plus, Sparkles } from 'lucide-react';

export default function EmptyDetailPanel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
      {/* Ilustrasi Placeholder */}
      <div className="w-64 h-48 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white shadow-md mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="text-xs text-blue-600 font-medium">Userdoc Workflow</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">User Stories, Epics, and Non-functional Requirements</h2>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
        Capture requirements in a language everyone can understand
      </p>

      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm">
        <Plus className="w-4 h-4" />
        <span>Create New</span>
      </button>
    </div>
  );
}