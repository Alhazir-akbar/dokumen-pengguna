'use client';

import { useState, useEffect } from 'react';
import { UserType, PersonaType } from '../types';
import { Save, X, Plus, Trash2, Camera, Sparkles } from 'lucide-react';

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
        name: `Persona ${personas.length + 1}`,
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
    if (personas.length === 1) return; // Minimal sisakan 1 persona
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
    <form onSubmit={handleSubmit} className="flex-1 bg-white p-8 overflow-y-auto h-full flex flex-col">
      
      {/* Top Header: Input Nama User Type + Tombol Save & Cancel */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="User Type Name"
          className="flex-1 text-xl font-semibold text-gray-800 placeholder-gray-400 bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4 text-gray-500" /> Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-500" /> Cancel
          </button>
        </div>
      </div>

      {/* Description Box */}
      <div className="mb-8 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          DESCRIPTION
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of this User type"
          className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
        />
      </div>

      {/* Bagian Personas Container */}
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Tab Header & Tombol New Persona */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-gray-50/50">
          <div className="flex items-center gap-2 overflow-x-auto">
            {personas.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePersonaIndex(idx)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activePersonaIndex === idx
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                {p.name || `Persona ${idx + 1}`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddPersona}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> New Persona
          </button>
        </div>

        {/* Persona Content Body */}
        {personas.length > 0 && activePersona && (
          <div className="p-8 flex-1 overflow-y-auto space-y-6">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">PERSONAS</div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Kolom Kiri: Foto & Change Photo */}
              <div className="md:col-span-3 flex flex-col items-center border-r border-gray-100 pr-4">
                <div className="w-24 h-24 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 mb-3 shadow-inner relative overflow-hidden">
                  <Camera className="w-8 h-8" />
                </div>
                <span className="text-xs font-medium text-blue-600 hover:underline cursor-pointer">
                  Change photo
                </span>
              </div>

              {/* Kolom Kanan: Atribut & Field Detail Persona */}
              <div className="md:col-span-9 space-y-5">
                
                {/* Persona Name dengan Ikon Sparkle */}
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <input
                    type="text"
                    value={activePersona.name}
                    onChange={(e) => handlePersonaChange('name', e.target.value)}
                    placeholder="Persona Name"
                    className="text-base font-semibold text-gray-800 focus:outline-none w-full bg-transparent"
                  />
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                </div>

                {/* Garis-garis Atribut (Age, Location, Family status, Work / Job Title) */}
                <div className="space-y-4 text-sm">
                  <div className="flex items-center border-b border-gray-100 pb-2">
                    <span className="w-32 text-xs font-medium text-gray-400">Age</span>
                    <input
                      type="number"
                      value={activePersona.age || ''}
                      onChange={(e) => handlePersonaChange('age', Number(e.target.value))}
                      placeholder="e.g. 25"
                      className="flex-1 text-gray-800 bg-transparent focus:outline-none text-sm"
                    />
                  </div>

                  <div className="flex items-center border-b border-gray-100 pb-2">
                    <span className="w-32 text-xs font-medium text-gray-400">Location</span>
                    <input
                      type="text"
                      value={activePersona.location || ''}
                      onChange={(e) => handlePersonaChange('location', e.target.value)}
                      placeholder="e.g. Jakarta, Indonesia"
                      className="flex-1 text-gray-800 bg-transparent focus:outline-none text-sm"
                    />
                  </div>

                  <div className="flex items-center border-b border-gray-100 pb-2">
                    <span className="w-32 text-xs font-medium text-gray-400">Family status</span>
                    <input
                      type="text"
                      value={activePersona.familyStatus || ''}
                      onChange={(e) => handlePersonaChange('familyStatus', e.target.value)}
                      placeholder="e.g. Single / Married"
                      className="flex-1 text-gray-800 bg-transparent focus:outline-none text-sm"
                    />
                  </div>

                  <div className="flex items-center border-b border-gray-100 pb-2">
                    <span className="w-32 text-xs font-medium text-gray-400">Work / Job Title</span>
                    <input
                      type="text"
                      value={activePersona.workTitle || ''}
                      onChange={(e) => handlePersonaChange('workTitle', e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="flex-1 text-gray-800 bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Section Textarea: About, Goals, Frustrations */}
                <div className="space-y-6 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">About</label>
                    <textarea
                      rows={2}
                      value={activePersona.about || ''}
                      onChange={(e) => handlePersonaChange('about', e.target.value)}
                      placeholder="Write background information about this persona..."
                      className="w-full text-sm text-gray-700 bg-gray-50/50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Goals</label>
                    <textarea
                      rows={2}
                      value={activePersona.goals || ''}
                      onChange={(e) => handlePersonaChange('goals', e.target.value)}
                      placeholder="What does this persona want to achieve?"
                      className="w-full text-sm text-gray-700 bg-gray-50/50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Frustrations</label>
                    <textarea
                      rows={2}
                      value={activePersona.frustrations || ''}
                      onChange={(e) => handlePersonaChange('frustrations', e.target.value)}
                      placeholder="What pain points does this persona face?"
                      className="w-full text-sm text-gray-700 bg-gray-50/50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Tombol Delete Persona di pojok kanan bawah */}
                {personas.length > 1 && (
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => handleDeletePersona(activePersonaIndex)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Persona
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>

    </form>
  );
}