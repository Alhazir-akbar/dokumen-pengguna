'use client';

import { useState } from 'react';
import { UserType, PersonaType } from '../types';
import { Edit2, MapPin, Briefcase, Users, Target, AlertCircle } from 'lucide-react';

interface UserDetailPanelProps {
  user: UserType;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
}

export default function UserDetailPanel({ user, onEdit, onDelete }: UserDetailPanelProps) {
  // State untuk melacak tab persona yang sedang dipilih (default ke persona pertama)
  const [activePersonaIndex, setActivePersonaIndex] = useState(0);

  const activePersona: PersonaType | undefined = user.personas?.[activePersonaIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Atas: Nama User Type & Tombol Edit */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-base font-bold text-slate-900">{user.name}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
      </div>

      {/* Deskripsi Box */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Description</span>
        <p className="text-sm text-slate-700 leading-relaxed">{user.description}</p>
      </div>

      {/* Bagian Personas */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Personas</span>

        {/* Tab List Personas (Misal: Serena Bialek | Darius Okonkwo) */}
        {user.personas && user.personas.length > 0 ? (
          <div>
            <div className="flex border-b border-slate-200 gap-8">
              {user.personas.map((persona, index) => (
                <button
                  key={index}
                  onClick={() => setActivePersonaIndex(index)}
                  className={`pb-3 text-xs font-semibold transition-colors relative cursor-pointer ${
                    activePersonaIndex === index
                      ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {persona.name}
                </button>
              ))}
            </div>

            {/* Detail Informasi Persona yang Aktif */}
            {activePersona && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
                
                {/* Kolom Kiri: Profil Singkat Persona */}
                <div className="md:col-span-4 space-y-4 border-r border-slate-100 pr-6">
                  <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden shadow-sm flex items-center justify-center text-slate-500 font-bold text-xl">
                    {/* Placeholder gambar jika belum ada foto */}
                    {activePersona.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{activePersona.name}</h3>
                    <div className="text-xs text-slate-500 mt-1 space-y-1">
                      <p><strong className="text-slate-700">Age:</strong> {activePersona.age}</p>
                      <p><strong className="text-slate-700">Location:</strong> {activePersona.location}</p>
                      {activePersona.familyStatus && (
                        <p><strong className="text-slate-700">Family status:</strong> {activePersona.familyStatus}</p>
                      )}
                      {activePersona.workTitle && (
                        <p><strong className="text-slate-700">Work / Job Title:</strong> {activePersona.workTitle}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: About, Goals, Frustrations */}
                <div className="md:col-span-8 space-y-6">
                  {/* About */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                      <Briefcase className="w-4 h-4" />
                      <h4>About</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{activePersona.about}</p>
                  </div>

                  {/* Goals */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <Target className="w-4 h-4" />
                      <h4>Goals</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{activePersona.goals}</p>
                  </div>

                  {/* Frustrations */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                      <AlertCircle className="w-4 h-4" />
                      <h4>Frustrations</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{activePersona.frustrations}</p>
                  </div>
                </div>

              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No personas found for this user type.</p>
        )}
      </div>

    </div>
  );
}