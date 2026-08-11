// features/users/components/UserDetailPanel.tsx
'use client';

import { useState } from 'react';
import { UserType, Persona } from '../types';

interface UserDetailPanelProps {
  userType: UserType;
}

export default function UserDetailPanel({ userType }: UserDetailPanelProps) {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(
    userType.personas[0] || null
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Info */}
        <div>
          <h1 className="text-lg font-bold text-gray-900">{userType.name}</h1>
          <p className="text-xs text-gray-500 mt-1">{userType.description}</p>
        </div>

        {/* Persona Tabs */}
        {userType.personas.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Personas</span>
            <div className="flex items-center gap-2 mt-2 border-b border-gray-200 pb-3">
              {userType.personas.map((persona, idx) => {
                const isPersonaActive = selectedPersona?.name === persona.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedPersona(persona)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      isPersonaActive ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {persona.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Persona Detail Card */}
        {selectedPersona ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {selectedPersona.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{selectedPersona.name}</h3>
                <p className="text-xs text-gray-500">Age: {selectedPersona.age} • Location: {selectedPersona.location}</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-700 uppercase">About</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{selectedPersona.about}</p>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-700 uppercase">Goals</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{selectedPersona.goals}</p>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-700 uppercase">Frustrations</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{selectedPersona.frustrations}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
            <p className="text-xs text-gray-400">Belum ada persona untuk tipe pengguna ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}