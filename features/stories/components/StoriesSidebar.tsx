// features/stories/components/StoriesSidebar.tsx
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Epic, UserStory } from '../types';
import EpicListItem from './EpicListItem';
import { Search, Edit3, ChevronDown, Plus, Settings, Folder, Trash2 } from 'lucide-react';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';

interface StoriesSidebarProps {
  epics: Epic[];
  selectedStoryId?: string;
  currentProjectId?: string | null;
  onSelectStory: (story: UserStory) => void;
  onSelectEpic?: (epic: Epic) => void;
  onAddNew?: () => void;
  projectName?: string;
  projectId?: string | null;
  // BARU: workspace_id dari project yang lagi dibuka (didapat dari getProjectById
  // di app/stories/page.tsx). Ini WAJIB dikirim eksplisit -- jangan andalkan
  // localStorage untuk ini, soalnya localStorage 'workspace_id' bisa kosong/stale
  // (misal user baru selesai wizard dan belum pernah mampir ke halaman /workspace).
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
  onAddNew,
}: StoriesSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeProjId = currentProjectId || projectId;

  useEffect(() => {
    const fetchProjects = async () => {
      // Tunggu sampai workspaceId project aktif diketahui dari parent -- jangan
      // fetch dengan workspace_id yang salah/kosong (itu penyebab bug 403
      // sebelumnya).
      if (!workspaceId) return;

      const token = getAuthToken();
      if (!token) return;
      try {
        const response: any = await projectApi.getProjects(workspaceId, token);
        const projectsList = Array.isArray(response) ? response : response?.data || response?.projects || [];
        setAllProjects(projectsList);
      } catch (err) {
        console.error('Gagal memuat list project:', err);
      }
    };
    fetchProjects();
  }, [activeProjId, workspaceId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteProject = async (e: React.MouseEvent, pId: number, pName: string) => {
    e.stopPropagation();
    if (!confirm(`Hapus project "${pName}"? Seluruh data di dalamnya akan terhapus permanen.`)) return;

    const token = getAuthToken();
    if (!token) return;

    try {
      await projectApi.deleteProject(pId, token);
      const remaining = allProjects.filter((p) => p.id !== pId);
      setAllProjects(remaining);

      if (String(pId) === String(activeProjId)) {
        if (remaining.length > 0) {
          router.push(`/stories?project_id=${remaining[0].id}`);
        } else {
          router.push('/workspace');
        }
      }
    } catch (err: any) {
      console.error('Gagal menghapus project:', err);
      alert(err.message || 'Gagal menghapus project.');
    }
  };

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
      <div className="p-4 border-b border-gray-100 relative" ref={dropdownRef}>
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
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
        </div>

        <div className="text-[11px] text-gray-400 font-medium px-0.5">
          Showing {totalStories} stories, {epics.length} epics
        </div>

        {isDropdownOpen && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-2">
            <div className="px-3 py-2 border-b border-gray-100">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push(`/project-setup${workspaceId ? `?workspace_id=${workspaceId}` : ''}`);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer text-left"
              >
                <Plus className="w-4 h-4 text-blue-600" /> Create new Project
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push(`/settings?project_id=${activeProjId}`);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer text-left"
              >
                <Settings className="w-4 h-4 text-gray-400" /> Project Settings
              </button>
            </div>

            <div className="px-3 py-1.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold px-2 py-1">CHANGE PROJECT</p>
              <div className="max-h-48 overflow-y-auto space-y-1 mt-1">
                {allProjects.length === 0 ? (
                  <p className="text-xs text-gray-400 px-2 py-1 italic">Memuat project...</p>
                ) : (
                  allProjects.map((p) => {
                    const isCurrent = String(p.id) === String(activeProjId);
                    return (
                      <div
                        key={p.id}
                        className={`group/item flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors ${
                          isCurrent ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100 font-medium'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            router.push(`/stories?project_id=${p.id}`);
                          }}
                          className="flex items-center gap-2 text-xs text-left truncate flex-1 cursor-pointer"
                        >
                          <Folder className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className="truncate">{p.name}</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(e, p.id, p.name)}
                          title="Hapus Project"
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer opacity-0 group-hover/item:opacity-100 shrink-0 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
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