'use client';

import { useState, useEffect } from 'react';
import { UserType } from '../types';

interface UserDetailPanelProps {
  user: UserType;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
}

export default function UserDetailPanel({ user, onEdit, onDelete }: UserDetailPanelProps) {
  const [detailData, setDetailData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchDetailFromAPI = async () => {
      setTimeout(() => {
        setDetailData(user);
        setIsLoading(false);
      }, 300);
    };

    fetchDetailFromAPI();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-xs">
        <p className="animate-pulse">Loading user details...</p>
      </div>
    );
  }

  if (!detailData) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      
      {/* Header Profile */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
            {detailData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{detailData.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{detailData.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(detailData)}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(detailData.id)}
            className="px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs text-slate-400 block mb-1">Total Stories</span>
          <span className="text-xl font-bold text-slate-800">{detailData.storiesCount}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs text-slate-400 block mb-1">Total Personas</span>
          <span className="text-xl font-bold text-slate-800">{detailData.personasCount}</span>
        </div>
      </div>

      {/* Bagian Daftar Personas (Mengikuti mock data baru) */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Associated Personas ({detailData.personas?.length || 0})
        </h3>
        
        <div className="space-y-3">
          {detailData.personas && detailData.personas.length > 0 ? (
            detailData.personas.map((persona, index) => (
              <div key={index} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">{persona.name}</h4>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">
                    {persona.age} yrs • {persona.location}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-700">About:</strong> {persona.about}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <strong className="text-emerald-600 block mb-0.5">Goals:</strong>
                    <span className="text-slate-500">{persona.goals}</span>
                  </div>
                  <div>
                    <strong className="text-rose-600 block mb-0.5">Frustrations:</strong>
                    <span className="text-slate-500">{persona.frustrations}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No personas available for this user type.</p>
          )}
        </div>
      </div>

    </div>
  );
}