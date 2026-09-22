// features/stories/components/ManualStoryDetailPanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserStory } from '../types';
import {
  Code,
  History,
  BookOpen,
  FileText,
  Map,
  Trash2,
  Edit3,
  Sparkles,
  Plus,
  Loader2,
} from 'lucide-react';
import { suggestStoryWithAi } from '@/services/storiesApi';
import { getAuthToken } from '@/lib/auth';

interface ManualStoryDetailPanelProps {
  story: UserStory;
  onDelete?: () => void;
  onUpdate?: (updated: UserStory) => void;
  projectId?: string | null;
}

function SidebarCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  action,
  children,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          </div>
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
        </div>
        {action}
      </div>
      <div className="border-t border-gray-100 pt-3">{children}</div>
    </div>
  );
}

export default function ManualStoryDetailPanel({
  story,
  onDelete,
  onUpdate,
  projectId,
}: ManualStoryDetailPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'criteria' | 'notes' | 'tests'>('criteria');
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<'draft' | 'review' | 'approved'>('draft');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleAiRegenerate = async () => {
    const token = getAuthToken();
    if (!token) {
      alert('Sesi login habis, silakan login kembali.');
      return;
    }

    setIsRegenerating(true);
    try {
      const result = await suggestStoryWithAi(
        {
          as_a: asA,
          i_want: iWant,
          so_that: soThat,
        },
        token
      );

      setAsA(result.as_a);
      setIWant(result.i_want);
      setSoThat(result.so_that);
      setCriteriaList(result.acceptance_criteria || []);
      setTechNotesList(result.tech_notes || []);
      setTestCasesList(result.test_cases || []);

      if (onUpdate) {
        onUpdate({
          ...story,
          as_a: result.as_a,
          i_want: result.i_want,
          so_that: result.so_that,
          acceptanceCriteria: result.acceptance_criteria,
          techNotes: result.tech_notes,
          testCases: result.test_cases,
        });
      }
    } catch (err: any) {
      console.error('Error AI regenerate:', err);
      alert(err.message || 'Gagal generate story dengan AI');
    } finally {
      setIsRegenerating(false);
    }
  };

  const [asA, setAsA] = useState(story.as_a);
  const [iWant, setIWant] = useState(story.i_want);
  const [soThat, setSoThat] = useState(story.so_that);

  const [criteriaList, setCriteriaList] = useState<string[]>(story.acceptanceCriteria || []);
  const [newCriterion, setNewCriterion] = useState('');

  const [techNotesList, setTechNotesList] = useState<string[]>(story.techNotes || []);
  const [newTechNote, setNewTechNote] = useState('');

  const [testCasesList, setTestCasesList] = useState<string[]>(story.testCases || []);
  const [newTestCase, setNewTestCase] = useState('');

  useEffect(() => {
    setAsA(story.as_a);
    setIWant(story.i_want);
    setSoThat(story.so_that);
    setCriteriaList(story.acceptanceCriteria || []);
    setTechNotesList(story.techNotes || []);
    setTestCasesList(story.testCases || []);
  }, [story]);

  const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
    review: { label: 'In Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  };

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

  const handleAddCriterion = () => {
    if (!newCriterion.trim()) return;
    const updated = [...criteriaList, newCriterion.trim()];
    setCriteriaList(updated);
    setNewCriterion('');
    if (onUpdate) {
      onUpdate({ ...story, acceptanceCriteria: updated });
    }
  };

  const handleDeleteCriterion = (indexToRemove: number) => {
    const updated = criteriaList.filter((_, idx) => idx !== indexToRemove);
    setCriteriaList(updated);
    if (onUpdate) {
      onUpdate({ ...story, acceptanceCriteria: updated });
    }
  };

  const handleAddTechNote = () => {
    if (!newTechNote.trim()) return;
    const updated = [...techNotesList, newTechNote.trim()];
    setTechNotesList(updated);
    setNewTechNote('');
    if (onUpdate) {
      onUpdate({ ...story, techNotes: updated });
    }
  };

  const handleDeleteTechNote = (indexToRemove: number) => {
    const updated = techNotesList.filter((_, idx) => idx !== indexToRemove);
    setTechNotesList(updated);
    if (onUpdate) {
      onUpdate({ ...story, techNotes: updated });
    }
  };

  const handleAddTestCase = () => {
    if (!newTestCase.trim()) return;
    const updated = [...testCasesList, newTestCase.trim()];
    setTestCasesList(updated);
    setNewTestCase('');
    if (onUpdate) {
      onUpdate({ ...story, testCases: updated });
    }
  };

  const handleDeleteTestCase = (indexToRemove: number) => {
    const updated = testCasesList.filter((_, idx) => idx !== indexToRemove);
    setTestCasesList(updated);
    if (onUpdate) {
      onUpdate({ ...story, testCases: updated });
    }
  };

  const handleOpenStoryHelp = () => {
    const params = new URLSearchParams();
    if (projectId) params.set('project_id', projectId);
    params.set('article', 'stories-epics');
    router.push(`/knowledge?${params.toString()}`);
  };

  return (
    <div className="flex-1 bg-gray-50/50 flex overflow-y-auto">
      <div className="flex-1 bg-white p-8 overflow-y-auto border-r border-gray-200">
        <div className="flex items-start justify-between border-b border-gray-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer outline-none transition-colors ${statusConfig[status].bg} ${statusConfig[status].text} ${statusConfig[status].border}`}
              >
                <option value="draft">📝 Draft</option>
                <option value="review">⏳ In Review</option>
                <option value="approved">✅ Approved</option>
              </select>

              <span className="text-xs text-gray-400 font-mono font-medium">{story.code}</span>
              <span className="text-xs text-gray-400 font-mono font-medium">v0.1</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              {story.i_want ? `I want ${story.i_want}` : 'User Story'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAiRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Regenerate with AI"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                </>
              )}
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              title="Edit Story"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors cursor-pointer border border-transparent hover:border-red-100"
              title="Delete Story"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

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

        <div className="border-b border-gray-200 mb-6 flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'criteria' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ACCEPTANCE CRITERIA
            {criteriaList.length > 0 && (
              <span className="ml-1.5 text-[10px] text-gray-400 font-normal">({criteriaList.length})</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            TECH NOTES
            {techNotesList.length > 0 && (
              <span className="ml-1.5 text-[10px] text-gray-400 font-normal">({techNotesList.length})</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'tests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            TEST CASES
            {testCasesList.length > 0 && (
              <span className="ml-1.5 text-[10px] text-gray-400 font-normal">({testCasesList.length})</span>
            )}
          </button>
        </div>

        {activeTab === 'criteria' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: Given pengguna login, When klik submit, Then data tersimpan"
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCriterion()}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCriterion}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {criteriaList.length > 0 ? (
              <ul className="space-y-2">
                {criteriaList.map((ac, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors group"
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        className="mt-0.5 w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs text-gray-700 leading-relaxed font-mono">
                        {ac}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteCriterion(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity cursor-pointer"
                      title="Hapus kriteria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                <p className="text-xs text-gray-500">Belum ada acceptance criteria. Tulis format Given-When-Then di atas lalu klik Tambah.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah catatan arsitektur / database / API endpoint..."
                value={newTechNote}
                onChange={(e) => setNewTechNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTechNote()}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTechNote}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {techNotesList.length > 0 ? (
              <ul className="space-y-2.5">
                {techNotesList.map((note, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between gap-2.5 p-3 bg-blue-50/40 border border-blue-100 rounded-lg group hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <Code className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-700 leading-relaxed font-mono">{note}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTechNote(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity cursor-pointer"
                      title="Hapus tech note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                <p className="text-xs text-gray-500">Belum ada tech notes. Tambahkan arsitektur atau instruksi teknis di atas.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: Verifikasi sistem menampilkan pesan error jika email duplikat..."
                value={newTestCase}
                onChange={(e) => setNewTestCase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTestCase()}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTestCase}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {testCasesList.length > 0 ? (
              <ul className="space-y-2.5">
                {testCasesList.map((tc, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between gap-2.5 p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-200/70 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                        TC-{index + 1}
                      </span>
                      <span className="text-xs text-gray-700 leading-relaxed">{tc}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTestCase(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity cursor-pointer"
                      title="Hapus test case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                <p className="text-xs text-gray-500">Belum ada test cases. Tulis skenario pengujian di atas lalu klik Tambah.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-80 bg-white p-6 space-y-4 overflow-y-auto border-l border-gray-200">
        <SidebarCard
          icon={History}
          iconBg="bg-rose-100"
          iconColor="text-rose-600"
          title="Version History"
          action={
            <button
              type="button"
              disabled
              title="Fitur riwayat versi lengkap belum tersedia"
              className="text-[10px] text-gray-300 cursor-not-allowed"
            >
              View Versions
            </button>
          }
        >
          <div className="text-xs space-y-1">
            <div className="text-green-600 font-medium flex items-center gap-1.5">
              <span>✓</span> v0.1 - Manual entry
            </div>
          </div>
        </SidebarCard>

        <SidebarCard
          icon={BookOpen}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          title="Stories Linked To"
        >
          <p className="text-[11px] text-gray-400 italic">
            Belum ada story lain yang di-link dari sini.
          </p>
        </SidebarCard>

        <SidebarCard
          icon={FileText}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          title="Stories Linked From"
        >
          <p className="text-[11px] text-gray-400 italic">
            Belum ada story lain yang nge-link ke sini.
          </p>
        </SidebarCard>

        <SidebarCard
          icon={Map}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          title="Journeys Linked From"
        >
          <p className="text-[11px] text-gray-400 italic">
            Belum ada journey yang terhubung ke story ini.
          </p>
        </SidebarCard>

        <SidebarCard
          icon={Sparkles}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          title="Resources"
        >
          <button
            type="button"
            onClick={handleOpenStoryHelp}
            className="text-xs text-blue-600 hover:underline cursor-pointer text-left"
          >
            Learn about user stories
          </button>
        </SidebarCard>
      </div>
    </div>
  );
}