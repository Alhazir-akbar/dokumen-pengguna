// features/users/components/userDetailPanel.tsx
'use client';

import { UserType } from '../types';
import { Sparkles } from 'lucide-react';

interface UserDetailPanelProps {
  userType: UserType;
}

export default function UserDetailPanel({ userType }: UserDetailPanelProps) {
  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto h-full flex flex-col">
      {/* Header Info User Type */}
      <div className="pb-6 border-b border-gray-200 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{userType.name}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{userType.description}</p>
        <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-500">
          <span>{userType.storiesCount || 0} Stories</span>
          <span>•</span>
          <span>{userType.personasCount || userType.personas?.length || 0} Personas</span>
        </div>
      </div>

      {/* Daftar Personas */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Personas</h3>
        {userType.personas && userType.personas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {userType.personas.map((persona, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50/30 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {persona.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{persona.name}</h4>
                      <p className="text-xs text-gray-500">{persona.workTitle || 'No Job Title'}</p>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-1">Age</span>
                    <span className="font-semibold text-gray-800">{persona.age || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Location</span>
                    <span className="font-semibold text-gray-800">{persona.location || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Family Status</span>
                    <span className="font-semibold text-gray-800">{persona.familyStatus || '-'}</span>
                  </div>
                </div>

                {persona.about && (
                  <div className="text-xs pt-2">
                    <span className="font-bold text-gray-700 block mb-1 uppercase">About</span>
                    <p className="text-gray-600 leading-relaxed">{persona.about}</p>
                  </div>
                )}

                {persona.goals && (
                  <div className="text-xs pt-1">
                    <span className="font-bold text-gray-700 block mb-1 uppercase">Goals</span>
                    <p className="text-gray-600 leading-relaxed">{persona.goals}</p>
                  </div>
                )}

                {persona.frustrations && (
                  <div className="text-xs pt-1">
                    <span className="font-bold text-gray-700 block mb-1 uppercase">Frustrations</span>
                    <p className="text-gray-600 leading-relaxed">{persona.frustrations}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No personas defined for this user type yet.</p>
        )}
      </div>
    </div>
  );
}