// features/journeys/components/journeyDetailPanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit3, ArrowDown, Sparkles, Trash2, Plus, Save, X } from 'lucide-react';

interface Step {
  id: number | string;
  title: string;
  description: string;
}

export interface JourneyDetailPanelProps {
  journey?: {
    id: string;
    title: string;
    description: string;
    steps?: Step[];
  } | null;
  isEditingInitially?: boolean;
  onClose: () => void;
  onSave: (updatedJourney: any) => void;
}

const DEFAULT_STEP: Step = { id: 1, title: 'Step name', description: 'Description of this Step' };

export default function JourneyDetailPanel({ journey, isEditingInitially = false, onClose, onSave }: JourneyDetailPanelProps) {
  // Safe fallback object jika journey kosong/undefined
  const safeJourney = journey || {
    id: '',
    title: '',
    description: '',
    steps: []
  };

  const [isEditing, setIsEditing] = useState(isEditingInitially);

  const [title, setTitle] = useState(safeJourney.title || '');
  const [description, setDescription] = useState(safeJourney.description || '');

  const [steps, setSteps] = useState<Step[]>(
    safeJourney.steps && safeJourney.steps.length > 0 ? safeJourney.steps : [DEFAULT_STEP]
  );

  // PENTING: useState di atas cuma jalan sekali waktu mount pertama. Kalau
  // parent (app/journeys/page.tsx) reload data journey ini dari server --
  // misalnya setelah AI selesai generate steps -- prop `journey` berubah,
  // tapi komponen ini TIDAK remount (masih instance React yang sama), jadi
  // state `steps`/`title`/`description` di atas gak pernah ke-update dan
  // tetap nyangkut di nilai awal (placeholder "Step name"). Efek di bawah
  // ini yang nge-sync ulang state internal setiap kali data journey dari
  // parent berubah. Di-skip saat sedang mode edit supaya draf yang lagi
  // diketik user tidak ketiban reload dari server.
  useEffect(() => {
    if (isEditing) return;
    setTitle(safeJourney.title || '');
    setDescription(safeJourney.description || '');
    setSteps(safeJourney.steps && safeJourney.steps.length > 0 ? safeJourney.steps : [DEFAULT_STEP]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journey]);

  const handleStepChange = (id: number | string, field: 'title' | 'description', value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddStep = () => {
    const newStep: Step = {
      id: Date.now(),
      title: 'Step name',
      description: 'Description of this Step'
    };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id: number | string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...safeJourney,
      title,
      description,
      steps,
      stepsCount: steps.length
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
        <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Journey Editor</span>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button 
              type="button"
              onClick={handleFormSubmit}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>

        <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
          <div>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Journey name"
              className="w-full text-xl font-bold text-gray-900 placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 shadow-xs bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Journey name / description..."
              rows={3}
              className="w-full text-xs text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 shadow-xs bg-white resize-none"
            />
          </div>

          <div className="flex flex-col items-center pt-4 pb-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-xs">
              Begin Journey <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            </div>

            <div className="my-1 text-blue-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="w-full space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center w-full space-y-4">
                  <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3 relative group hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-bold text-gray-400">{index + 1}.</span>
                        <input 
                          type="text"
                          value={step.title}
                          onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                          className="text-xs font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-full"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <button 
                          type="button"
                          onClick={() => handleDeleteStep(step.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <textarea 
                        value={step.description}
                        onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full text-xs text-gray-600 bg-gray-50/50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>

                  <div className="my-1 text-blue-400">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={handleAddStep}
              className="w-full border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-600 transition-all bg-gray-50/30 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 group-hover:border-blue-400 flex items-center justify-center shadow-xs transition-all">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold">Create a new step in the journey</span>
            </button>

            <div className="my-1 text-blue-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="inline-flex items-center text-xs font-bold text-gray-700 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-xs">
              End Journey
            </div>
            
            <span className="text-[10px] text-gray-400 pt-2">Userdoc uses AI. Check for mistakes.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
      <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">Journey Flow</span>
          <h1 className="text-sm font-bold text-gray-900 truncate max-w-xl">{safeJourney.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Journey
          </button>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Description</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            {safeJourney.description || 'Deskripsi journey belum tersedia.'}
          </p>
        </div>

        <div className="flex flex-col items-center pt-2 pb-6 space-y-3">
          <div className="text-[11px] font-bold text-gray-700 bg-white px-4 py-1.5 rounded-full border border-gray-200 mb-2 shadow-xs flex items-center gap-1.5">
            Begin Journey <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
          </div>

          <div className="w-full space-y-3">
            {steps.map((step, index) => (
              <div key={step.id || index} className="relative flex flex-col items-center">
                <div className="w-full bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-all flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-bold text-xs text-gray-900">{index + 1}. {step.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                </div>

                {index < steps.length - 1 && (
                  <div className="my-2.5 flex items-center justify-center text-blue-500 w-6 h-6">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-[11px] font-bold text-gray-700 bg-white px-4 py-1.5 rounded-full border border-gray-200 mt-4 shadow-xs">
            End Journey
          </div>
          <span className="text-[10px] text-gray-400 pt-2">Userdoc uses AI. Check for mistakes.</span>
        </div>
      </div>
    </div>
  );
}