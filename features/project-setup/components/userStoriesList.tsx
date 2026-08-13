'use client';

import { useState } from 'react';
import LogoUserdoc from '../../../public/logoUserDoc';
import { useWizardStore, UserStoryItem } from '../store/wizard-store';
import { 
  ArrowRight, 
  Trash2, 
  ChevronDown, 
  Lock, 
  User, 
  Globe, 
  Sparkles, 
  Sliders, 
  Clock, 
  Bell, 
  MessageSquare,
  FolderKanban,
  AlertCircle,
  Plus
} from 'lucide-react';

// Fungsi helper untuk menentukan ikon berdasarkan nama Epic
const getEpicIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('login') || t.includes('registration') || t.includes('auth')) return <Lock className="w-4 h-4 text-blue-300" />;
  if (t.includes('profile')) return <User className="w-4 h-4 text-blue-300" />;
  if (t.includes('guest') || t.includes('browsing')) return <Globe className="w-4 h-4 text-blue-300" />;
  if (t.includes('content') || t.includes('personalized')) return <Sparkles className="w-4 h-4 text-blue-300" />;
  if (t.includes('preference') || t.includes('setting')) return <Sliders className="w-4 h-4 text-blue-300" />;
  if (t.includes('session')) return <Clock className="w-4 h-4 text-blue-300" />;
  if (t.includes('notification')) return <Bell className="w-4 h-4 text-blue-300" />;
  if (t.includes('feedback') || t.includes('support')) return <MessageSquare className="w-4 h-4 text-blue-300" />;
  return <FolderKanban className="w-4 h-4 text-blue-300" />;
};

export default function UserStoriesList() {
  const { projectName, epics, userTypes, userStories, addUserStory, removeUserStory, nextStep } = useWizardStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpicTitle, setSelectedEpicTitle] = useState(epics[0]?.title || 'General');
  const [storyName, setStoryName] = useState('');
  
  // Defaultkan ke userType pertama jika ada, jika tidak kosongkan
  const [selectedUserType, setSelectedUserType] = useState(userTypes[0]?.name || 'Registered User');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);

  const titleName = projectName.trim() ? projectName : 'your project';

  // Kelompokkan stories berdasarkan epic title
  const groupedStories = epics.map((epic) => ({
    ...epic,
    stories: userStories.filter((s: UserStoryItem) => s.epicTitle.toLowerCase() === epic.title.toLowerCase())
  }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyName.trim()) return;

    const newItem: UserStoryItem = {
      id: Date.now().toString(),
      epicId: 'custom',
      epicTitle: selectedEpicTitle,
      storyName: storyName,
      userType: selectedUserType,
      description: description || 'No description provided.',
    };

    addUserStory(newItem);
    setStoryName('');
    setDescription('');
    setIsModalOpen(false);
    if (error) setError(false);
  };

  const handleNext = () => {
    // Rules: Pastikan minimal ada 1 user story yang dibuat sebelum lanjut
    if (userStories.length === 0) {
      setError(true);
      return;
    }
    setError(false);
    nextStep();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-6 text-center pb-12">
      
      {/* Logo Kotak (UD) */}
      <div className="mb-4">
        <LogoUserdoc />
      </div>

      {/* Judul Utama */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        {titleName} user stories
      </h1>
      
      <p className="text-blue-200 text-xs sm:text-sm mb-8 max-w-xl">
        We&apos;ve suggested user stories below, grouped by their epic. Feel free to add more, edit, or remove them. Click a story to edit its details and assign it to the appropriate user types.
      </p>

      {/* List Container per Epic */}
      <div className="w-full flex flex-col gap-6 mb-6 text-left">
        {groupedStories.map((epic) => (
          <div 
            key={epic.id} 
            className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl overflow-hidden"
          >
            {/* Header Epic dengan Ikon Dinamis */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                {getEpicIcon(epic.title)} {epic.title}
              </h3>
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </div>

            {/* Tabel Header */}
            <div className="grid grid-cols-12 text-[11px] font-semibold text-blue-300 uppercase tracking-wider pb-2 border-b border-white/5 px-2">
              <div className="col-span-4">Story Name</div>
              <div className="col-span-3">User Types</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* List Stories */}
            <div className="divide-y divide-white/5">
              {epic.stories.length === 0 ? (
                <div className="py-4 px-2 text-xs text-blue-200/70">
                  No stories under this epic yet. Click &quot;+ Add row&quot; below.
                </div>
              ) : (
                epic.stories.map((story: UserStoryItem, index: number) => (
                  <div key={story.id} className="grid grid-cols-12 py-3 px-2 text-xs items-center hover:bg-white/5 transition-colors rounded-lg group">
                    <div className="col-span-4 text-white font-medium truncate pr-2 flex items-center gap-1.5">
                      <span className="text-blue-300 font-normal">{index + 1}.</span> {story.storyName}
                    </div>
                    <div className="col-span-3 text-blue-200 truncate pr-2">
                      <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full text-[10px]">
                        {story.userType}
                      </span>
                    </div>
                    <div className="col-span-4 text-blue-200/80 truncate pr-2">
                      {story.description}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeUserStory(story.id)}
                        title="Delete story"
                        className="text-red-300 hover:text-red-100 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tombol Add Row di dalam Card Epic */}
            <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedEpicTitle(epic.title);
                  setIsModalOpen(true);
                }}
                className="text-blue-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add row
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Pesan Peringatan Jika Kosong */}
      {error && (
        <div className="w-full text-left mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">
            <strong>Rules:</strong> Harap tambahkan minimal 1 user story sebelum melanjutkan ke tahap berikutnya.
          </p>
        </div>
      )}

      {/* Tombol Navigasi Bawah */}
      <div className="w-full flex items-center justify-start">
        <button
          type="button"
          onClick={handleNext}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Tambah User Story */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-400/30 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white mb-4">Add User Story ({selectedEpicTitle})</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Story Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. View Dashboard Analytics"
                  value={storyName}
                  onChange={(e) => setStoryName(e.target.value)}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">User Type</label>
                <select
                  value={selectedUserType}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  {userTypes.length > 0 ? (
                    userTypes.map((ut) => (
                      <option key={ut.id} value={ut.name} className="bg-slate-900 text-white">
                        {ut.name}
                      </option>
                    ))
                  ) : (
                    <option value="General User" className="bg-slate-900 text-white">General User</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the user story details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-blue-950/50 border border-blue-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
                >
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}