// features/users/components/userFormPanel.tsx
'use client';

import { useState } from 'react';
import { UserType, Persona } from '../types';
import { Plus, Trash2, Sparkles, User as UserIcon } from 'lucide-react';

interface UserFormPanelProps {
  initialData?: UserType | null;
  onSubmit: (data: UserType) => void;
  onCancel: () => void;
}

export default function UserFormPanel({ initialData, onSubmit, onCancel }: UserFormPanelProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [personas, setPersonas] = useState<Persona[]>(initialData?.personas || []);

  // Simpan id persona yang sudah ada sejak awal form dibuka.
  // Dipakai untuk mendeteksi persona mana yang dihapus user selama sesi edit ini,
  // supaya nanti bisa benar-benar dihapus di backend (bukan cuma hilang dari state lokal).
  const [initialPersonaIds] = useState<number[]>(
    (initialData?.personas || []).map((p) => p.id).filter((id): id is number => !!id)
  );

  const handleAddPersona = () => {
    const newPersona: Persona = {
      // sengaja tanpa id -> menandakan persona baru, belum ada di database
      name: 'New Persona',
      workTitle: '',
      age: '',
      location: '',
      familyStatus: '',
      about: '',
      goals: '',
      frustrations: '',
    };
    setPersonas([...personas, newPersona]);
  };

  const handleRemovePersona = (index: number) => {
    setPersonas(personas.filter((_, i) => i !== index));
  };

  const handlePersonaChange = (index: number, field: keyof Persona, value: string) => {
    const updated = [...personas];
    updated[index] = { ...updated[index], [field]: value };
    setPersonas(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Persona yang id-nya ada di initialPersonaIds tapi sudah tidak ada lagi
    // di array `personas` saat ini berarti sengaja dihapus user selama edit.
    const remainingIds = personas.map((p) => p.id).filter((id): id is number => !!id);
    const deletedPersonaIds = initialPersonaIds.filter((id) => !remainingIds.includes(id));

    const savedUserType: UserType = {
      id: initialData?.id || '', // id asli akan diisi backend saat create; page yang handle ini
      name,
      description,
      storiesCount: initialData?.storiesCount || 0,
      personasCount: personas.length,
      personas,
      deletedPersonaIds,
    };

    onSubmit(savedUserType);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 bg-white flex flex-col h-full overflow-hidden">
      {/* Top Bar Form */}
      <div className="h-16 border-b border-gray-200 px-8 flex items-center justify-between shrink-0 bg-white">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="User Type Name"
          className="text-lg font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-1/2 transition-colors"
          required
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* Content Form */}
      <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-gray-50/30">
        {/* Description Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of this User type"
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Personas Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Personas</h3>
            <button
              type="button"
              onClick={handleAddPersona}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New Persona
            </button>
          </div>

          {personas.map((persona, index) => (
            <div key={persona.id ?? `new-${index}`} className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={persona.name}
                    onChange={(e) => handlePersonaChange(index, 'name', e.target.value)}
                    placeholder="Persona Name"
                    className="text-sm font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                  />
                </div>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>

              {/* Grid Atribut Persona */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Age</label>
                  <input
                    type="text"
                    value={persona.age || ''}
                    onChange={(e) => handlePersonaChange(index, 'age', e.target.value)}
                    placeholder="e.g., 25"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Location</label>
                  <input
                    type="text"
                    value={persona.location || ''}
                    onChange={(e) => handlePersonaChange(index, 'location', e.target.value)}
                    placeholder="e.g., Jakarta"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Family Status</label>
                  <input
                    type="text"
                    value={persona.familyStatus || ''}
                    onChange={(e) => handlePersonaChange(index, 'familyStatus', e.target.value)}
                    placeholder="e.g., Single"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Work / Job Title</label>
                  <input
                    type="text"
                    value={persona.workTitle || ''}
                    onChange={(e) => handlePersonaChange(index, 'workTitle', e.target.value)}
                    placeholder="e.g., Developer"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* About */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">About</label>
                <textarea
                  value={persona.about || ''}
                  onChange={(e) => handlePersonaChange(index, 'about', e.target.value)}
                  placeholder="Describe about this persona..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg p-3 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Goals */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Goals</label>
                <textarea
                  value={persona.goals || ''}
                  onChange={(e) => handlePersonaChange(index, 'goals', e.target.value)}
                  placeholder="List persona goals..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg p-3 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Frustrations */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Frustrations</label>
                <textarea
                  value={persona.frustrations || ''}
                  onChange={(e) => handlePersonaChange(index, 'frustrations', e.target.value)}
                  placeholder="List persona frustrations..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg p-3 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tombol Delete Persona */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleRemovePersona(index)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Persona
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}