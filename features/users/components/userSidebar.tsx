// features/users/components/UsersSidebar.tsx
'use client';

import { UserType } from '../types';
import { User, Plus } from 'lucide-react';

interface UsersSidebarProps {
  userTypes: UserType[];
  selectedId?: string;
  onSelectUser: (user: UserType) => void;
}

export default function UsersSidebar({ userTypes, selectedId, onSelectUser }: UsersSidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header Sub-Sidebar */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Showing {userTypes.length} Users
        </span>
        <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* List User Types */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {userTypes.map((type) => {
          const isSelected = selectedId === type.id;
          return (
            <div
              key={type.id}
              onClick={() => onSelectUser(type)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected ? 'bg-blue-50/60 border-blue-200 shadow-xs' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-gray-900">{type.name}</h4>
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-1 mb-2">{type.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                <span>{type.storiesCount} Stories</span>
                <span>•</span>
                <span>{type.personasCount} Personas</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}