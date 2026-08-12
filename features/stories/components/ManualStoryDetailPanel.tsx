// features/stories/components/ManualStoryDetailPanel.tsx
'use client';

import { useState } from 'react';
import { UserStory } from '../types';
import { Copy, Code, History, BookOpen, Layers, GitFork, Trash2, Edit3 } from 'lucide-react';

interface ManualStoryDetailPanelProps {
  story: UserStory;
  onDelete?: () => void;
  onUpdate?: (updated: UserStory) => void;
}

export default function ManualStoryDetailPanel({ story, onDelete, onUpdate }: ManualStoryDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'criteria' | 'notes' | 'tests'>('criteria');
  const [isEditing, setIsEditing] = useState(false);

  // State untuk form edit data manual
  const [asA, setAsA] = useState(story.as_a);
  const [iWant, setIWant] = useState(story.i_want);
  const [soThat, setSoThat] = useState(story.so_that);

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate({
        ...story,
        as_a: asA,
        i_want: iWant,
        so_that: soThat,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="flex-1 bg-gray-50/50 flex overflow-y-auto">
      {/* Bagian Utama Kiri */}
      <div className="flex-1 bg-white p-8 overflow-y-auto border-r border-gray-200">
        {/* Header Title & Action Code */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-6 mb-6">
          <div>
            {/* Mengganti label agar tidak kaku bertuliskan "Example story" */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {story.i_want ? `I want ${story.i_want}` : 'Manual User Story'}
            </h1>
            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
              Manual Entry
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono font-medium">{story.code}</span>
            <span className="text-xs text-gray-400 font-mono font-medium">v0.1</span>
            
            {/* Tombol Edit */}
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md transition-colors cursor-pointer" 
              title="Edit Story"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Tombol Delete */}
            <button 
              onClick={onDelete} 
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors cursor-pointer" 
              title="Delete Story"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Edit atau Tampilan Detail Manual */}
        {isEditing ? (
          <div className="space-y-4 mb-8 bg-blue-50/30 p-4 rounded-xl border border-blue-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase">Edit Manual Story</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">As a...</label>
              <input 
                type="text" 
                value={asA} 
                onChange={(e) => setAsA(e.target.value)} 
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">I want to...</label>
              <input 
                type="text" 
                value={iWant} 
                onChange={(e) => setIWant(e.target.value)} 
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">So that...</label>
              <input 
                type="text" 
                value={soThat} 
                onChange={(e) => setSoThat(e.target.value)} 
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-gray-800 mb-8 leading-relaxed">
            <p><strong className="text-gray-900">As a</strong> {story.as_a},</p>
            <p><strong className="text-gray-900">I want to</strong> {story.i_want},</p>
            <p><strong className="text-gray-900">So that</strong> {story.so_that}</p>
          </div>
        )}

        {/* Tab Navigasi Bawah */}
        <div className="border-b border-gray-200 mb-6 flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'criteria' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ACCEPTANCE CRITERIA
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            TECH NOTES
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'tests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            TEST CASES
          </button>
        </div>

        {activeTab === 'criteria' && (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <p className="text-gray-600">Acceptance criteria defined manually for this user story.</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Ensure clear definitions of done</li>
              <li>Validate requirements from the user perspective</li>
            </ul>
          </div>
        )}

        {activeTab === 'notes' && <div className="text-xs text-gray-500 italic">No tech notes added yet.</div>}
        {activeTab === 'tests' && <div className="text-xs text-gray-500 italic">No test cases added yet.</div>}
      </div>

      {/* Sidebar Kanan */}
      <div className="w-80 bg-white p-6 space-y-5 overflow-y-auto border-l border-gray-200">
        <div className="border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Version History</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="text-green-600 font-medium flex items-center gap-1.5">
              <span>✓</span> v0.1 - Manual entry
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 space-y-2 shadow-xs">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Resources
          </div>
          <p className="text-xs text-blue-600 hover:underline cursor-pointer">User story help</p>
        </div>
      </div>
    </div>
  );
}