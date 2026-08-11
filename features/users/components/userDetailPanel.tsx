// features/users/components/UserDetailPanel.tsx
'use client';

import { useState } from 'react';
import { UserType, Persona } from '../types';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';

interface UserDetailPanelProps {
  userType: UserType;
}

export default function UserDetailPanel({ userType }: UserDetailPanelProps) {
  // State untuk mode edit form
  const [name, setName] = useState(userType.name);
  const [description, setDescription] = useState(userType.description);
  const [personas, setPersonas] = useState<Persona[]>(userType.personas || []);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(personas[0] || null);

  return (
    <div className="flex-1 bg-white overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Action Bar (Save & Cancel buttons seperti di referensi) */}
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-full transition-colors"
            placeholder="User Type Name"
          />
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition-colors shadow-2xs">
              <Save className="w-3.5 h-3.5 text-gray-500" /> Save
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-lg transition-colors shadow-2xs">
              <X className="w-3.5 h-3.5 text-gray-400" /> Cancel
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            DESCRIPTION
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full text-xs text-gray-700 bg-transparent focus:outline-none resize-none placeholder-gray-400"
            placeholder="Description of this User type"
          />
        </div>

        {/* Persona Section Header */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {personas.map((persona, idx) => {
                const isActive = selectedPersona?.name === persona.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedPersona(persona)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {persona.name}
                  </button>
                );
              })}
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors shadow-2xs">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>
        </div>

        {/* Persona Detail View */}
        {selectedPersona ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-inner">
                  {selectedPersona.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    {selectedPersona.name} <span className="text-xs">✏️</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Age: {selectedPersona.age || '-'} &bull; Location: {selectedPersona.location || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Field Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Age</span>
                <p className="text-gray-800 border-b border-gray-100 pb-1">{selectedPersona.age || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Location</span>
                <p className="text-gray-800 border-b border-gray-100 pb-1">{selectedPersona.location || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Family status</span>
                <p className="text-gray-800 border-b border-gray-100 pb-1">{selectedPersona.familyStatus || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Work / Job Title</span>
                <p className="text-gray-800 border-b border-gray-100 pb-1">{selectedPersona.workTitle || '-'}</p>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase">About</h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                {selectedPersona.about || 'No additional details provided.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
            <p className="text-xs text-gray-400">Belum ada persona yang dipilih atau dibuat.</p>
          </div>
        )}

      </div>
    </div>
  );
}