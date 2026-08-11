'use client';

import { useState, useEffect } from 'react';
import { UserType, PersonaType } from '../types';
import { Save, X, Plus, Trash2, Camera } from 'lucide-react';

interface UserFormPanelProps {
  initialData?: UserType | null;
  onSubmit: (data: UserType) => void;
  onCancel: () => void;
}

export default function UserFormPanel({ initialData, onSubmit, onCancel }: UserFormPanelProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personas, setPersonas] = useState<PersonaType[]>([]);
  const [activePersonaIndex, setActivePersonaIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPersonas(initialData.personas ? [...initialData.personas] : []);
    } else {
      setName('');
      setDescription('');
      setPersonas([
        {
          name: 'New Persona',
          age: 0,
          location: '',
          familyStatus: '',
          workTitle: '',
          about: '',
          goals: '',
          frustrations: '',
        },
      ]);
    }
    setActivePersonaIndex(0);
  }, [initialData]);

  const handlePersonaChange = (field: keyof PersonaType, value: any) => {
    const updated = [...personas];
    updated[activePersonaIndex] = {
      ...updated[activePersonaIndex],
      [field]: value,
    };
    setPersonas(updated);
  };

  const handleAddPersona = () => {
    setPersonas([
      ...personas,
      {
        name: 'New Persona',
        age: 25,
        location: '',
        familyStatus: '',
        workTitle: '',
        about: '',
        goals: '',
        frustrations: '',
      },
    ]);
    setActivePersonaIndex(personas.length);
  };

  const handleDeletePersona = (index: number) => {
    const updated = personas.filter((_, i) => i !== index);
    setPersonas(updated);
    setActivePersonaIndex(Math.max(0, index - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UserType = {
      id: initialData ? initialData.id : Date.now().toString(),
      name,
      description,
      storiesCount: initialData ? initialData.storiesCount : 0,
      personasCount: personas.length,
      personas,
    };
    onSubmit(payload);
  };

  const activePersona = personas[activePersonaIndex] || {
    name: '',
    age: 0,
    location: '',
    familyStatus: '',
    workTitle: '',
    about: '',
    goals: '',
    frustrations: '',
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Form: Input Nama User Type + Tombol Save & Cancel */}
      <div className="flex items-center justify-between bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-xs">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="User Type Name"
          className="text-base font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-1/2"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      </div>

      {/* Deskripsi Box */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Description</span>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of this User type"
          className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Bagian Personas */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          {/* Tab List Personas */}
          <div className="flex gap-6 overflow-x-auto">
            {personas.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePersonaIndex(idx)}
                className={`pb-1 text-xs font-semibold transition-colors relative cursor-pointer ${
                  activePersonaIndex === idx
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {p.name || `Persona ${idx + 1}`}
              </button>
            ))}
          </div>

          {/* Tombol + New Persona */}
          <button
            type="button"
            onClick={handleAddPersona}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {/* Form Detail Persona yang Aktif */}
        {personas.length > 0 && activePersona && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            
            {/* Kolom Kiri: Foto & Identitas Utama */}
            <div className="md:col-span-4 space-y-4 border-r border-slate-100 pr-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 relative overflow-hidden shadow-xs group">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline">Change photo</span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Persona Name</label>
                  <input
                    type="text"
                    value={activePersona.name}
                    onChange={(e) => handlePersonaChange('name', e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">Age</label>
                    <input
                      type="number"
                      value={activePersona.age || ''}
                      onChange={(e) => handlePersonaChange('age', Number(e.target.value))}
                      className="w-full text-xs text-slate-700 border-b border-slate-200 pb-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">Location</label>
                    <input
                      type="text"
                      value={activePersona.location}
                      onChange={(e) => handlePersonaChange('location', e.target.value)}
                      className="w-full text-xs text-slate-700 border-b border-slate-200 pb-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Family status</label>
                  <input
                    type="text"
                    value={activePersona.familyStatus || ''}
                    onChange={(e) => handlePersonaChange('familyStatus', e.target.value)}
                    className="w-full text-xs text-slate-700 border-b border-slate-200 pb-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Work / Job Title</label>
                  <input
                    type="text"
                    value={activePersona.workTitle || ''}
                    onChange={(e) => handlePersonaChange('workTitle', e.target.value)}
                    className="w-full text-xs text-slate-700 border-b border-slate-200 pb-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Kolom Kanan: About, Goals, Frustrations */}
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-600 block">About</label>
                <textarea
                  rows={3}
                  value={activePersona.about}
                  onChange={(e) => handlePersonaChange('about', e.target.value)}
                  placeholder="Write about this persona..."
                  className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-600 block">Goals</label>
                <textarea
                  rows={3}
                  value={activePersona.goals}
                  onChange={(e) => handlePersonaChange('goals', e.target.value)}
                  placeholder="What are their primary goals?"
                  className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-600 block">Frustrations</label>
                <textarea
                  rows={3}
                  value={activePersona.frustrations}
                  onChange={(e) => handlePersonaChange('frustrations', e.target.value)}
                  placeholder="What challenges or frustrations do they face?"
                  className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tombol Hapus Persona */}
              {personas.length > 1 && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleDeletePersona(activePersonaIndex)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Persona
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </form>
  );
}