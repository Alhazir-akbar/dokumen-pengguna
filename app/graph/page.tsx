'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppSidebar from '@/features/common/components/AppSidebar';
import AccountMenu from '@/features/common/components/accountMenu';
import { fetchEpics, fetchStories, fetchNFRs } from '@/services/storiesApi';
import { projectApi } from '@/services/projectsApi';
import { getAuthToken } from '@/lib/auth';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Loader2,
  FileText,
  Layers,
  Shield,
  Zap,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  GitGraph,
  Info,
  Sparkles,
} from 'lucide-react';

interface EpicNode {
  id: number;
  name: string;
  description?: string;
}

interface StoryNode {
  id: number;
  epic_id?: number | null;
  name: string;
  role?: string;
  action?: string;
  benefit?: string;
  status?: string;
  acceptance_criteria?: any[];
}

interface NfrNode {
  id: number;
  category: string;
  description: string;
}

function GraphPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('project_id');

  const [projectName, setProjectName] = useState('');
  const [projectWorkspaceId, setProjectWorkspaceId] = useState<number | null>(null);
  const [epics, setEpics] = useState<EpicNode[]>([]);
  const [stories, setStories] = useState<StoryNode[]>([]);
  const [nfrs, setNfrs] = useState<NfrNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Canvas View Controls
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<StoryNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter options
  const [showNFR, setShowNFR] = useState(true);
  const [showStories, setShowStories] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectId) {
      setLoadError('project_id tidak ditemukan di URL.');
      setIsLoading(false);
      return;
    }
    const token = getAuthToken();
    if (!token) {
      setLoadError('Sesi habis, silakan login kembali.');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [epicsData, storiesData, nfrsData, projData] = await Promise.all([
          fetchEpics(Number(projectId), token).catch(() => []),
          fetchStories(Number(projectId), token).catch(() => []),
          fetchNFRs(Number(projectId), token).catch(() => []),
          projectApi.getProjectById(Number(projectId), token).catch(() => null),
        ]);

        setEpics(epicsData || []);
        setStories(storiesData || []);
        setNfrs(nfrsData || []);
        if (projData) {
          setProjectName(projData.name || 'Project');
          setProjectWorkspaceId(projData.workspace_id || null);
        }
      } catch (err: any) {
        setLoadError(err.message || 'Gagal memuat data diagram graph.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  // Pan & Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.4), 2.2));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 40, y: 40 });
    setSelectedNode(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen bg-slate-900 text-white items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-sm text-slate-300 font-medium">Rendering Software Definition Graph...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-screen w-screen bg-slate-50 items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-2xl p-6 text-center max-w-md shadow-sm">
          <p className="text-red-600 text-sm mb-4 font-semibold">{loadError}</p>
          <button
            onClick={() => router.push('/workspace')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
          >
            Kembali ke Workspace
          </button>
        </div>
      </div>
    );
  }

  const hasArtifacts = epics.length > 0 || stories.length > 0 || nfrs.length > 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      <AppSidebar activeMenu="graph" projectId={projectId} />

      <div ref={containerRef} className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <GitGraph className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{projectName || 'Project'}</span>
                <span className="text-xs text-slate-600">/</span>
                <h1 className="text-sm font-bold text-white tracking-wide">Software Definition Graph</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Pills */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => setShowStories(!showStories)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  showStories ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stories ({stories.length})
              </button>
              <button
                onClick={() => setShowNFR(!showNFR)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  showNFR ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                NFR ({nfrs.length})
              </button>
            </div>

            <AccountMenu currentWorkspaceId={projectWorkspaceId} />
          </div>
        </header>

        {/* Floating Canvas Controls Toolbar */}
        <div className="absolute top-18 right-6 z-30 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl text-slate-300">
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.15, 2.2))}
            className="p-2 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.4))}
            className="p-2 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />
          <span className="text-[11px] font-mono font-semibold px-2 min-w-[45px] text-center text-slate-400">
            {Math.round(zoom * 100)}%
          </span>
          <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />
          <button
            onClick={resetView}
            className="p-2 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Canvas Area */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className={`flex-1 relative overflow-hidden select-none cursor-grab ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        >
          {!hasArtifacts ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-4 shadow-xl">
                <GitGraph className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Belum Ada Artefak Requirement</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                Tambahkan Epics, User Stories, atau jalankan AI generator di halaman Stories untuk melihat visualisasi diagram node graph.
              </p>
              <button
                onClick={() => router.push(`/stories?project_id=${projectId}`)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors"
              >
                Buka Halaman Stories
              </button>
            </div>
          ) : (
            <div
              className="absolute transition-transform duration-75 origin-top-left"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              {/* Root Project Node */}
              <div className="flex flex-col items-start gap-12">
                <div className="interactive-node p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl border border-blue-400/30 flex items-center gap-4 min-w-[280px]">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Root System</span>
                    <h2 className="text-sm font-bold text-white">{projectName || 'Project Architecture'}</h2>
                    <span className="text-[10px] text-blue-200/90">{epics.length} Epics • {stories.length} Stories</span>
                  </div>
                </div>

                {/* Grid of Epics & Stories */}
                <div className="flex flex-wrap items-start gap-8">
                  {epics.map((epic, epicIdx) => {
                    const epicStories = stories.filter((s) => s.epic_id === epic.id);
                    return (
                      <div
                        key={epic.id}
                        className="interactive-node rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl min-w-[320px] max-w-[380px] flex flex-col gap-4 relative"
                      >
                        {/* Epic Header */}
                        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-400/20 flex items-center justify-center font-bold text-xs">
                              E{epicIdx + 1}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white leading-tight">{epic.name}</h3>
                              <span className="text-[10px] text-slate-400">{epicStories.length} User Stories</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                            Epic
                          </span>
                        </div>

                        {epic.description && (
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{epic.description}</p>
                        )}

                        {/* Stories inside this Epic */}
                        {showStories && epicStories.length > 0 && (
                          <div className="space-y-2.5 pt-1">
                            {epicStories.map((story, storyIdx) => {
                              const isSelected = selectedNode?.id === story.id;
                              return (
                                <div
                                  key={story.id}
                                  onClick={() => setSelectedNode(isSelected ? null : story)}
                                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-blue-600/30 border-blue-400 shadow-lg shadow-blue-500/10'
                                      : 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-mono font-bold text-blue-400">
                                      #ST-{story.id}
                                    </span>
                                    <span
                                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                                        story.status === 'Approved'
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                          : story.status === 'Review'
                                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                          : 'bg-slate-800 text-slate-400'
                                      }`}
                                    >
                                      {story.status || 'Draft'}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-semibold text-slate-200 leading-snug">{story.name}</h4>

                                  {story.role && (
                                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                                      <span className="text-slate-500 font-medium">As a</span> {story.role},{' '}
                                      <span className="text-slate-500 font-medium">I want</span> {story.action}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* NFR Section Column */}
                  {showNFR && nfrs.length > 0 && (
                    <div className="interactive-node rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 shadow-2xl min-w-[300px] max-w-[340px] flex flex-col gap-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/20 flex items-center justify-center">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">Non-Functional</h3>
                            <span className="text-[10px] text-slate-400">{nfrs.length} Requirements</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                          NFR
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {nfrs.map((nfr) => (
                          <div
                            key={nfr.id}
                            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/30 transition-all"
                          >
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                              {nfr.category}
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">{nfr.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Node Details Floating Inspector Drawer */}
        {selectedNode && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-5 shadow-2xl animate-fadeIn text-white">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400">#ST-{selectedNode.id}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedNode.name}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <p><span className="text-slate-400 font-semibold">As a:</span> {selectedNode.role || '-'}</p>
                <p><span className="text-slate-400 font-semibold">I want:</span> {selectedNode.action || '-'}</p>
                <p><span className="text-slate-400 font-semibold">So that:</span> {selectedNode.benefit || '-'}</p>
              </div>

              {selectedNode.acceptance_criteria && selectedNode.acceptance_criteria.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Acceptance Criteria ({selectedNode.acceptance_criteria.length})
                  </span>
                  <ul className="space-y-1">
                    {selectedNode.acceptance_criteria.slice(0, 3).map((ac: any, i: number) => (
                      <li key={i} className="text-[11px] text-slate-300 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                        • {typeof ac === 'string' ? ac : ac.text || ac.criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push(`/stories?project_id=${projectId}`)}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buka di Stories Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GraphPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen bg-slate-950 items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      }
    >
      <GraphPageContent />
    </Suspense>
  );
}